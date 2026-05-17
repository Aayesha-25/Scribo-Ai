// ============================================
// Scribo AI - Backend Server
// Converted from n8n workflow
// Stack: Node.js + Express
// APIs: Deepgram + Groq + Supabase + Cloudinary
// ============================================

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ── MIDDLEWARE ──────────────────────────────
app.use(cors({
  origin: true,
  methods: ["GET", "POST", "DELETE"],
}));
app.use(express.json());

// Multer for handling file uploads (stores in memory temporarily)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
  fileFilter: (req, file, cb) => {
    const allowed = [
      'audio/mpeg', 'audio/wav', 'audio/mp4',
      'audio/webm', 'audio/ogg', 'video/mp4', 'video/webm'
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only audio/video files allowed.'));
    }
  }
});

// ── CLOUDINARY CONFIG ───────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ── SUPABASE CONFIG ─────────────────────────
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// ============================================
// STEP 1 — UPLOAD AUDIO TO CLOUDINARY
// ============================================
async function uploadToCloudinary(fileBuffer, filename) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        folder: 'scribo-ai/audio',
        public_id: `meeting_${Date.now()}`,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    uploadStream.end(fileBuffer);
  });
}

// ============================================
// STEP 2 — TRANSCRIBE AUDIO WITH DEEPGRAM
// ============================================
async function transcribeAudio(audioUrl) {
  const response = await fetch('https://api.deepgram.com/v1/listen?punctuate=true&diarize=true&utterances=true', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${process.env.DEEPGRAM_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ url: audioUrl })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Deepgram error: ${error}`);
  }

  const data = await response.json();

  // Extract full transcript
  const fullTranscript = data.results.channels[0].alternatives[0].transcript;

  // Extract word-level segments with timestamps
  const words = data.results.channels[0].alternatives[0].words || [];
  const segments = words.map(word => ({
    word: word.word,
    start: word.start,
    end: word.end,
    confidence: word.confidence,
    speaker: word.speaker || 0
  }));

  return {
    fullTranscript,
    segments,
    duration: data.metadata?.duration || 0
  };
}

// ============================================
// STEP 3 — SUMMARIZE WITH GROQ
// ============================================
async function summarizeWithGroq(transcript) {
  const prompt = `You are an AI meeting assistant. Analyze this transcript and return a JSON response with exactly this structure:

{
  "tldr": "A 2-3 sentence summary of the entire meeting",
  "key_points": [
    "Key point 1",
    "Key point 2",
    "Key point 3"
  ],
  "action_items": [
    {
      "task": "Description of the task",
      "owner": "Person responsible (if mentioned, otherwise 'Team')",
      "due": "Due date if mentioned, otherwise 'Not specified'"
    }
  ]
}

Return ONLY the JSON, no extra text.

Transcript:
${transcript}`;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 1000
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Groq error: ${error}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  // Parse JSON response from Groq
  try {
    const cleaned = content.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    // If parsing fails, return raw content
    return {
      tldr: content,
      key_points: [],
      action_items: []
    };
  }
}

// ============================================
// STEP 4 — SAVE TO SUPABASE
// ============================================
async function saveToSupabase({ title, audioUrl, duration, transcript, segments, summary }) {
  
  // Save meeting
  const { data: meeting, error: meetingError } = await supabase
    .from('meetings')
    .insert({
      title: title || 'Untitled Meeting',
      audio_url: audioUrl,
      duration_seconds: Math.round(duration),
      status: 'done'
    })
    .select()
    .single();

  if (meetingError) throw new Error(`Meeting save error: ${meetingError.message}`);

  const meetingId = meeting.id;

  // Save transcript
  const { error: transcriptError } = await supabase
    .from('transcripts')
    .insert({
      meeting_id: meetingId,
      full_text: transcript,
      segments: segments
    });

  if (transcriptError) throw new Error(`Transcript save error: ${transcriptError.message}`);

  // Save summary
  const { error: summaryError } = await supabase
    .from('summaries')
    .insert({
      meeting_id: meetingId,
      tldr: summary.tldr,
      key_points: summary.key_points,
      action_items: summary.action_items
    });

  if (summaryError) throw new Error(`Summary save error: ${summaryError.message}`);

  return meetingId;
}

// ============================================
// MAIN API ROUTES
// ============================================

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'Scribo AI Backend is running! 🚀' });
});

// ── ROUTE 1: Upload & Process Audio File ────
app.post('/api/upload', upload.single('audio'), async (req, res) => {
  try {
    const { meeting_title } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    console.log(`📁 File received: ${file.originalname} (${file.size} bytes)`);

    // Step 1: Upload to Cloudinary
    console.log('☁️ Uploading to Cloudinary...');
    const audioUrl = await uploadToCloudinary(file.buffer, file.originalname);
    console.log(`✅ Cloudinary URL: ${audioUrl}`);

    // Step 2: Transcribe with Deepgram
    console.log('🎙️ Transcribing with Deepgram...');
    const { fullTranscript, segments, duration } = await transcribeAudio(audioUrl);
    console.log(`✅ Transcript length: ${fullTranscript.length} characters`);

    // Step 3: Summarize with Groq
    console.log('🤖 Summarizing with Groq...');
    const summary = await summarizeWithGroq(fullTranscript);
    console.log('✅ Summary generated');

    // Step 4: Save to Supabase
    console.log('💾 Saving to Supabase...');
    const meetingId = await saveToSupabase({
      title: meeting_title || file.originalname,
      audioUrl,
      duration,
      transcript: fullTranscript,
      segments,
      summary
    });
    console.log(`✅ Saved! Meeting ID: ${meetingId}`);

    // Return everything to frontend
    res.json({
      success: true,
      meeting_id: meetingId,
      audio_url: audioUrl,
      transcript: fullTranscript,
      segments,
      summary
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ── ROUTE 2: Process Audio from URL ─────────
app.post('/api/process-url', async (req, res) => {
  try {
    const { meeting_title, audio_url } = req.body;

    if (!audio_url) {
      return res.status(400).json({ error: 'No audio URL provided' });
    }

    // Step 1: Transcribe with Deepgram
    console.log('🎙️ Transcribing with Deepgram...');
    const { fullTranscript, segments, duration } = await transcribeAudio(audio_url);

    // Step 2: Summarize with Groq
    console.log('🤖 Summarizing with Groq...');
    const summary = await summarizeWithGroq(fullTranscript);

    // Step 3: Save to Supabase
    console.log('💾 Saving to Supabase...');
    const meetingId = await saveToSupabase({
      title: meeting_title || 'Untitled Meeting',
      audioUrl: audio_url,
      duration,
      transcript: fullTranscript,
      segments,
      summary
    });

    res.json({
      success: true,
      meeting_id: meetingId,
      audio_url,
      transcript: fullTranscript,
      segments,
      summary
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ── ROUTE 3: Get All Meetings (History) ─────
app.get('/api/meetings', async (req, res) => {
  try {
    const { search } = req.query;

    let query = supabase
      .from('meetings')
      .select(`
        *,
        summaries (tldr, key_points, action_items),
        transcripts (full_text)
      `)
      .order('created_at', { ascending: false });

    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    res.json({ success: true, meetings: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── ROUTE 4: Get Single Meeting ─────────────
app.get('/api/meetings/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('meetings')
      .select(`
        *,
        summaries (tldr, key_points, action_items),
        transcripts (full_text, segments)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    res.json({ success: true, meeting: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── ROUTE 5: Delete Meeting ──────────────────
app.delete('/api/meetings/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('meetings')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ success: true, message: 'Meeting deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── START SERVER ─────────────────────────────
app.listen(PORT, () => {
  console.log(`
  🚀 Scribo AI Backend Running!
  ─────────────────────────────
  Local:  http://localhost:${PORT}
  
  Routes:
  POST /api/upload          → Upload & process audio file
  POST /api/process-url     → Process audio from URL
  GET  /api/meetings        → Get all meetings
  GET  /api/meetings/:id    → Get single meeting
  DELETE /api/meetings/:id  → Delete meeting
  `);
});
