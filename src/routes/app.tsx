import { createFileRoute, Link, useRouterState } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { Mic, Home, Clock, Settings, Upload, Pause, Square, FileAudio } from "lucide-react";
import { Logo } from "@/components/scribo/Logo";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Scribo AI — Recorder" },
      { name: "description", content: "Record, upload, and transcribe meetings with Scribo AI." },
    ],
  }),
  component: AppPage,
});

function AppPage() {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    setRecording(true);
    intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  };
  const stop = () => {
    setRecording(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="min-h-screen flex" style={{ background: "#FFF0F5" }}>
      <Sidebar />
      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl md:text-4xl">New recording</h1>
              <p className="text-sm mt-1.5">Start a live meeting or upload an audio file.</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-card p-8 md:p-12 text-center border" style={{ borderColor: "var(--border)" }}>
            <div
              className="w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-6 transition-transform"
              style={{
                background: recording ? "var(--pistachio)" : "color-mix(in oklab, var(--pistachio) 18%, white)",
                transform: recording ? "scale(1.05)" : "scale(1)",
              }}
            >
              <Mic size={56} style={{ color: recording ? "#fff" : "var(--pistachio)" }} strokeWidth={2.2} />
            </div>

            <div className="font-display text-3xl md:text-4xl text-charcoal mb-2">
              {recording ? fmt(seconds) : "Ready when you are"}
            </div>
            <p className="text-sm text-[color:var(--muted-2)] mb-8">
              {recording ? "Recording in progress..." : "Click below to begin"}
            </p>

            {recording && (
              <div className="flex items-end gap-1 h-12 max-w-md mx-auto mb-8">
                {Array.from({ length: 40 }).map((_, i) => (
                  <span key={i} className="wave-bar flex-1 rounded-full" style={{ background: "var(--pistachio)", height: `${30 + Math.abs(Math.sin(i * 0.7)) * 70}%`, animationDelay: `${i * 0.04}s` }} />
                ))}
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-3">
              {!recording ? (
                <button onClick={start} className="btn-primary">
                  <Mic size={18} /> Start recording
                </button>
              ) : (
                <>
                  <button onClick={stop} className="btn-primary">
                    <Square size={16} /> Stop
                  </button>
                  <button className="btn-secondary"><Pause size={16} /> Pause</button>
                </>
              )}
              <button className="btn-secondary"><Upload size={16} /> Upload file</button>
            </div>
          </div>

          <div className="mt-8 grid md:grid-cols-3 gap-4">
            {[
              { icon: FileAudio, label: "MP3, WAV, M4A" },
              { icon: FileAudio, label: "MP4 video" },
              { icon: FileAudio, label: "Up to 4 hours" },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 flex items-center gap-3 border" style={{ borderColor: "var(--border)" }}>
                <span className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "color-mix(in oklab, var(--pistachio) 18%, white)" }}>
                  <s.icon size={16} style={{ color: "var(--pistachio)" }} />
                </span>
                <span className="text-sm font-medium text-charcoal">{s.label}</span>
              </div>
            ))}
          </div>
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
    <aside className="hidden md:flex w-64 bg-white border-r flex-col p-5" style={{ borderColor: "var(--border)" }}>
      <Link to="/" className="mb-8"><Logo /></Link>
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
        <div className="text-xs text-[color:var(--muted-2)] mb-3">Unlimited recordings & translations</div>
        <Link to="/pricing" className="btn-primary !py-2 !px-4 text-xs w-full">View plans</Link>
      </div>
    </aside>
  );
}
