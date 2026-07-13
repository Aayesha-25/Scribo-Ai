# Scribo AI

Voice-to-summary web app. Upload an audio file or record live — get a full transcript, key points, and action items, automatically.

## Features

- 🎙️ **Record or Upload** — record directly in-browser or upload an existing audio file
- 📝 **Full Transcript** — accurate speech-to-text of the entire recording
- 🔑 **Key Points** — auto-extracted summary of what matters
- ✅ **Action Items** — pulls out tasks/next steps mentioned in the conversation
- ⚡ **Fast turnaround** — async processing with live status updates

## Tech Stack

- **Frontend/Framework:** Next.js (TypeScript)
- **Backend/DB/Auth/Storage:** Supabase (Postgres, Auth, Storage)
- **Transcription/Summarization:** [add provider — e.g. Whisper API / AssemblyAI / Claude API]

## How It Works

1. User uploads a file or records audio in-browser
2. Audio is stored in Supabase Storage
3. Transcription job runs → full transcript saved to DB
4. Transcript is passed to an LLM → key points + action items extracted
5. Results shown on a per-recording summary page

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project (URL + anon/service keys)
- API key for your transcription/summarization provider

### Setup

```bash
git clone <repo-url>
cd scribo-ai
npm install
```

Create a `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
TRANSCRIPTION_API_KEY=your-provider-key
```

Run the dev server:

```bash
npm run dev
```

App runs at `http://localhost:3000`.

### Database

Run the schema/migrations in `supabase/migrations` against your Supabase project (via SQL editor or CLI):

```bash
supabase db push
```

## Project Structure

```
scribo-ai/
├── app/                  # Next.js app router pages
├── components/           # UI components (recorder, upload, summary view)
├── lib/                  # Supabase client, API helpers
├── supabase/             # DB schema/migrations
└── types/                # Shared TypeScript types
```

## Roadmap

- [ ] Speaker diarization (who said what)
- [ ] Search across past recordings
- [ ] Export summary as PDF/Notion
- [ ] Team/shared workspaces

## License

MIT