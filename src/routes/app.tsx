import { createFileRoute, Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { Mic, Home, Clock, Settings, Upload, Pause, Square, FileAudio, Loader2 } from "lucide-react";
import { Logo } from "@/components/scribo/Logo";
import { toast } from "sonner";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Scribo AI — Recorder" },
      { name: "description", content: "Record, upload, and transcribe meetings with Scribo AI." },
    ],
  }),
  component: AppPage,
});

// ── BACKEND URL ──────────────────────────────
const BACKEND_URL = "http://localhost:3000";

function AppPage() {
  const navigate = useNavigate();

  // Recording state
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState("");
  const [meetingTitle, setMeetingTitle] = useState("");
  const [showTitleInput, setShowTitleInput] = useState(false);

  // Refs
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  // ── START RECORDING ──────────────────────────
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.start(1000);
      setRecording(true);
      setPaused(false);
      setSeconds(0);
      intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
   } catch (err) {
  console.error("Mic error:", err);
  toast.error(`Microphone error: ${err}`);
}
  };

  // ── PAUSE RECORDING ──────────────────────────
  const pauseRecording = () => {
    if (mediaRecorderRef.current && recording) {
      if (paused) {
        mediaRecorderRef.current.resume();
        intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
        setPaused(false);
      } else {
        mediaRecorderRef.current.pause();
        if (intervalRef.current) clearInterval(intervalRef.current);
        setPaused(true);
      }
    }
  };

  // ── STOP & PROCESS RECORDING ─────────────────
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
    }
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRecording(false);
    setPaused(false);
    setShowTitleInput(true);
  };

  // ── SUBMIT RECORDING ─────────────────────────
  const submitRecording = async () => {
    setShowTitleInput(false);
    setProcessing(true);

    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");
      formData.append("meeting_title", meetingTitle || `Recording ${new Date().toLocaleDateString()}`);

      setProcessingStep("Uploading audio...");
      const response = await fetch(`${BACKEND_URL}/api/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      setProcessingStep("Transcribing with AI...");
      const data = await response.json();

      setProcessingStep("Generating summary...");
      await new Promise((r) => setTimeout(r, 500));

      toast.success("Meeting processed successfully!");
      navigate({ to: "/history" });
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setProcessing(false);
      setProcessingStep("");
      setSeconds(0);
    }
  };

  // ── UPLOAD FILE ──────────────────────────────
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProcessing(true);
    setProcessingStep("Uploading file...");

    try {
      const formData = new FormData();
      formData.append("audio", file);
      formData.append("meeting_title", file.name.replace(/\.[^/.]+$/, ""));

      const response = await fetch(`${BACKEND_URL}/api/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      setProcessingStep("Transcribing with AI...");
      const data = await response.json();

      setProcessingStep("Generating summary...");
      await new Promise((r) => setTimeout(r, 500));

      toast.success("File processed successfully!");
      navigate({ to: "/history" });
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setProcessing(false);
      setProcessingStep("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#FFF0F5" }}>
      <Sidebar />
      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl md:text-4xl">New recording</h1>
              <p className="text-sm mt-1.5 text-gray-500">
                Start a live meeting or upload an audio file.
              </p>
            </div>
          </div>

          {/* Main Card */}
          <div
            className="bg-white rounded-3xl shadow-card p-8 md:p-12 text-center border"
            style={{ borderColor: "var(--border)" }}
          >
            {/* Processing State */}
            {processing ? (
              <div className="flex flex-col items-center gap-4 py-8">
                <Loader2 size={48} className="animate-spin" style={{ color: "var(--pistachio)" }} />
                <div className="font-display text-2xl text-charcoal">Processing your meeting...</div>
                <p className="text-sm text-gray-500">{processingStep}</p>
                <div className="w-64 h-2 bg-gray-100 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ background: "var(--pistachio)", width: processingStep.includes("summary") ? "90%" : processingStep.includes("Transcribing") ? "60%" : "30%" }}
                  />
                </div>
              </div>

            ) : showTitleInput ? (
              /* Title Input State */
              <div className="flex flex-col items-center gap-4 py-8 max-w-md mx-auto">
                <div className="font-display text-2xl text-charcoal mb-2">
                  Name your recording
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  Give your meeting a title so you can find it later.
                </p>
                <input
                  type="text"
                  placeholder="e.g. Q3 Planning Meeting"
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2"
                  style={{ borderColor: "var(--border)" }}
                  onKeyDown={(e) => e.key === "Enter" && submitRecording()}
                  autoFocus
                />
                <div className="flex gap-3 w-full mt-2">
                  <button
                    onClick={() => { setShowTitleInput(false); setSeconds(0); }}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button onClick={submitRecording} className="btn-primary flex-1">
                    Process recording →
                  </button>
                </div>
              </div>

            ) : (
              /* Default / Recording State */
              <>
                <div
                  className="w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-6 transition-transform"
                  style={{
                    background: recording
                      ? "var(--pistachio)"
                      : "color-mix(in oklab, var(--pistachio) 18%, white)",
                    transform: recording ? "scale(1.05)" : "scale(1)",
                  }}
                >
                  <Mic
                    size={56}
                    style={{ color: recording ? "#fff" : "var(--pistachio)" }}
                    strokeWidth={2.2}
                  />
                </div>

                <div className="font-display text-3xl md:text-4xl text-charcoal mb-2">
                  {recording ? fmt(seconds) : "Ready when you are"}
                </div>
                <p className="text-sm text-gray-500 mb-8">
                  {recording
                    ? paused ? "Recording paused" : "Recording in progress..."
                    : "Click below to begin"}
                </p>

                {/* Waveform */}
                {recording && !paused && (
                  <div className="flex items-end gap-1 h-12 max-w-md mx-auto mb-8">
                    {Array.from({ length: 40 }).map((_, i) => (
                      <span
                        key={i}
                        className="wave-bar flex-1 rounded-full"
                        style={{
                          background: "var(--pistachio)",
                          height: `${30 + Math.abs(Math.sin(i * 0.7)) * 70}%`,
                          animationDelay: `${i * 0.04}s`,
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Buttons */}
                <div className="flex flex-wrap justify-center gap-3">
                  {!recording ? (
                    <button onClick={startRecording} className="btn-primary">
                      <Mic size={18} /> Start recording
                    </button>
                  ) : (
                    <>
                      <button onClick={stopRecording} className="btn-primary">
                        <Square size={16} /> Stop & Process
                      </button>
                      <button onClick={pauseRecording} className="btn-secondary">
                        <Pause size={16} /> {paused ? "Resume" : "Pause"}
                      </button>
                    </>
                  )}

                  {!recording && (
                    <>
                      <button
                        className="btn-secondary"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload size={16} /> Upload file
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="audio/*,video/*"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Supported formats */}
          {!processing && !showTitleInput && (
            <div className="mt-8 grid md:grid-cols-3 gap-4">
              {[
                { icon: FileAudio, label: "MP3, WAV, M4A" },
                { icon: FileAudio, label: "MP4 video" },
                { icon: FileAudio, label: "Up to 4 hours" },
              ].map((s, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-4 flex items-center gap-3 border"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ background: "color-mix(in oklab, var(--pistachio) 18%, white)" }}
                  >
                    <s.icon size={16} style={{ color: "var(--pistachio)" }} />
                  </span>
                  <span className="text-sm font-medium text-charcoal">{s.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function Sidebar() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const items = [
    { icon: Home, label: "Home", to: "/app" as const },
    { icon: Clock, label: "History", to: "/history" as const },
    { icon: Settings, label: "Settings", to: "/pricing" as const },
  ];
  return (
    <aside
      className="hidden md:flex w-64 bg-white border-r flex-col p-5"
      style={{ borderColor: "var(--border)" }}
    >
      <Link to="/" className="mb-8">
        <Logo />
      </Link>
      <nav className="flex flex-col gap-1">
        {items.map((it) => {
          const active = path === it.to;
          return (
            <Link
              key={it.label}
              to={it.to}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
              style={{
                background: active ? "var(--green-tint)" : "transparent",
                color: active ? "var(--charcoal)" : "var(--muted-foreground)",
              }}
            >
              <it.icon size={18} style={{ color: active ? "var(--pistachio)" : undefined }} />
              {it.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto p-4 rounded-2xl" style={{ background: "var(--pink-tint)" }}>
        <div className="text-sm font-semibold text-charcoal mb-1">Upgrade to Pro</div>
        <div className="text-xs text-[color:var(--muted-2)] mb-3">
          Unlimited recordings & translations
        </div>
        <Link to="/pricing" className="btn-primary !py-2 !px-4 text-xs w-full">
          View plans
        </Link>
      </div>
    </aside>
  );
}
