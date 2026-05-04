import { createFileRoute, Link } from "@tanstack/react-router";
import { Mic, Search, Play } from "lucide-react";
import { Navbar } from "@/components/scribo/Navbar";
import { Footer } from "@/components/scribo/Footer";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Meeting History — Scribo AI" },
      { name: "description", content: "Browse, search, and replay all your past meeting recordings and AI summaries." },
    ],
  }),
  component: HistoryPage,
});

const meetings = [
  { title: "Q3 Roadmap Review", date: "Oct 2, 2025", duration: "32 min", summary: "Aligned on dashboard ship date and analytics module timing.", tag: "Product" },
  { title: "Customer Discovery — Acme", date: "Oct 1, 2025", duration: "48 min", summary: "Acme is interested in enterprise tier; key blockers are SSO and audit logs.", tag: "Sales" },
  { title: "Design Critique", date: "Sep 28, 2025", duration: "26 min", summary: "Reviewed onboarding flow v2 — small copy changes requested.", tag: "Design" },
  { title: "All-Hands Meeting", date: "Sep 25, 2025", duration: "55 min", summary: "Q3 wins, upcoming hires, Q4 OKRs introduced.", tag: "Company" },
  { title: "Lecture: Distributed Systems", date: "Sep 24, 2025", duration: "1h 12 min", summary: "Consensus algorithms — Paxos and Raft compared.", tag: "Lecture" },
  { title: "1:1 with Marcus", date: "Sep 22, 2025", duration: "29 min", summary: "Career growth discussion and design system ownership.", tag: "1:1" },
];

function HistoryPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#FFF0F5" }}>
      <Navbar />
      <main className="flex-1 px-5 md:px-8 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <span className="pill-badge">Your meetings</span>
          <h1 className="font-display text-4xl md:text-5xl mt-5">Meeting history</h1>
          <p className="mt-3 text-[color:var(--muted-foreground)]">Every meeting, transcribed and summarized — searchable forever.</p>

          <div className="mt-8 bg-white rounded-2xl flex items-center gap-3 px-5 py-3.5 shadow-soft border" style={{ borderColor: "var(--border)" }}>
            <Search size={18} className="text-[color:var(--muted-2)]" />
            <input placeholder="Search across transcripts and summaries..." className="bg-transparent outline-none flex-1 text-charcoal placeholder:text-[color:var(--muted-2)]" />
            <kbd className="text-xs px-2 py-1 rounded-md bg-[color:var(--muted)] text-[color:var(--muted-2)]">⌘K</kbd>
          </div>

          <div className="mt-8 space-y-3">
            {meetings.map((m, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 flex items-center gap-5 shadow-soft border hover:shadow-card transition-shadow" style={{ borderColor: "var(--border)" }}>
                <span className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ background: "color-mix(in oklab, var(--pistachio) 18%, white)" }}>
                  <Mic size={20} style={{ color: "var(--pistachio)" }} strokeWidth={2.4} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-display text-lg text-charcoal">{m.title}</h3>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ background: "var(--green-tint)", color: "var(--pistachio)" }}>{m.tag}</span>
                  </div>
                  <p className="text-sm mt-1 line-clamp-1">{m.summary}</p>
                  <div className="text-xs text-[color:var(--muted-2)] mt-1.5">{m.date} · {m.duration}</div>
                </div>
                <button className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors hover:bg-[color:var(--green-tint)]" style={{ border: "1px solid var(--border)" }}>
                  <Play size={14} style={{ color: "var(--pistachio)" }} fill="currentColor" />
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/app" className="btn-primary">Start a new recording →</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
