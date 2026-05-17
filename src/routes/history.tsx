import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Mic, Search, Play, Trash2, Loader2 } from "lucide-react";
import { Navbar } from "@/components/scribo/Navbar";
import { Footer } from "@/components/scribo/Footer";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Meeting History — Scribo AI" },
      { name: "description", content: "Browse, search, and replay all your past meeting recordings and AI summaries." },
    ],
  }),
  component: HistoryPage,
});

// ── BACKEND URL ──────────────────────────────
const BACKEND_URL = "http://localhost:3000";

// ── TYPES ────────────────────────────────────
interface Meeting {
  id: string;
  title: string;
  status: string;
  duration_seconds: number;
  created_at: string;
  summaries: {
    tldr: string;
    key_points: string[];
    action_items: { task: string; owner: string; due: string }[];
  }[];
  transcripts: {
    full_text: string;
  }[];
}

// ── HELPERS ──────────────────────────────────
function formatDuration(seconds: number) {
  if (!seconds) return "Unknown duration";
  const mins = Math.floor(seconds / 60);
  const hrs = Math.floor(mins / 60);
  if (hrs > 0) return `${hrs}h ${mins % 60} min`;
  return `${mins} min`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function HistoryPage() {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  // ── FETCH MEETINGS ───────────────────────────
  const fetchMeetings = async (query = "") => {
    try {
      setLoading(true);
      const url = query
        ? `${BACKEND_URL}/api/meetings?search=${encodeURIComponent(query)}`
        : `${BACKEND_URL}/api/meetings`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch meetings");

      const data = await response.json();
      setMeetings(data.meetings || []);
    } catch (err) {
      toast.error("Failed to load meetings. Is the backend running?");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  // ── SEARCH ───────────────────────────────────
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    const timeout = setTimeout(() => fetchMeetings(value), 400);
    return () => clearTimeout(timeout);
  };

  // ── DELETE MEETING ───────────────────────────
  const deleteMeeting = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Delete this meeting?")) return;

    try {
      setDeleting(id);
      const response = await fetch(`${BACKEND_URL}/api/meetings/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Delete failed");
      setMeetings((prev) => prev.filter((m) => m.id !== id));
      toast.success("Meeting deleted");
    } catch (err) {
      toast.error("Failed to delete meeting");
    } finally {
      setDeleting(null);
    }
  };

  // ── VIEW MEETING ─────────────────────────────
  const viewMeeting = (id: string) => {
    navigate({ to: "/result", search: { meetingId: id } });
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#FFF0F5" }}>
      <Navbar />
      <main className="flex-1 px-5 md:px-8 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">

          <span className="pill-badge">Your meetings</span>
          <h1 className="font-display text-4xl md:text-5xl mt-5">Meeting history</h1>
          <p className="mt-3 text-[color:var(--muted-foreground)]">
            Every meeting, transcribed and summarized — searchable forever.
          </p>

          {/* Search */}
          <div
            className="mt-8 bg-white rounded-2xl flex items-center gap-3 px-5 py-3.5 shadow-soft border"
            style={{ borderColor: "var(--border)" }}
          >
            <Search size={18} className="text-[color:var(--muted-2)]" />
            <input
              placeholder="Search across transcripts and summaries..."
              className="bg-transparent outline-none flex-1 text-charcoal placeholder:text-[color:var(--muted-2)]"
              value={search}
              onChange={handleSearch}
            />
          </div>

          {/* Meetings List */}
          <div className="mt-8 space-y-3">

            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center gap-3 py-16">
                <Loader2 size={32} className="animate-spin" style={{ color: "var(--pistachio)" }} />
                <p className="text-sm text-gray-500">Loading your meetings...</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && meetings.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border" style={{ borderColor: "var(--border)" }}>
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: "color-mix(in oklab, var(--pistachio) 18%, white)" }}
                >
                  <Mic size={28} style={{ color: "var(--pistachio)" }} />
                </div>
                <h3 className="font-display text-xl text-charcoal mb-2">No meetings yet</h3>
                <p className="text-sm text-gray-500 mb-6">
                  {search ? "No meetings match your search." : "Start recording your first meeting!"}
                </p>
                {!search && (
                  <Link to="/app" className="btn-primary">
                    Start recording →
                  </Link>
                )}
              </div>
            )}

            {/* Meeting Cards */}
            {!loading && meetings.map((m) => (
              <div
                key={m.id}
                onClick={() => viewMeeting(m.id)}
                className="bg-white rounded-2xl p-5 flex items-center gap-5 shadow-soft border hover:shadow-card transition-all cursor-pointer group"
                style={{ borderColor: "var(--border)" }}
              >
                {/* Icon */}
                <span
                  className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "color-mix(in oklab, var(--pistachio) 18%, white)" }}
                >
                  <Mic size={20} style={{ color: "var(--pistachio)" }} strokeWidth={2.4} />
                </span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-display text-lg text-charcoal">{m.title}</h3>
                    <span
                      className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                      style={{ background: "var(--green-tint)", color: "var(--pistachio)" }}
                    >
                      {m.status}
                    </span>
                  </div>
                  <p className="text-sm mt-1 line-clamp-1 text-gray-500">
                    {m.summaries?.[0]?.tldr || m.transcripts?.[0]?.full_text?.slice(0, 100) || "Processing..."}
                  </p>
                  <div className="text-xs text-[color:var(--muted-2)] mt-1.5">
                    {formatDate(m.created_at)} · {formatDuration(m.duration_seconds)}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Delete */}
                  <button
                    onClick={(e) => deleteMeeting(m.id, e)}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100 hover:bg-red-50"
                    style={{ border: "1px solid var(--border)" }}
                  >
                    {deleting === m.id ? (
                      <Loader2 size={14} className="animate-spin text-red-400" />
                    ) : (
                      <Trash2 size={14} className="text-red-400" />
                    )}
                  </button>

                  {/* Play */}
                  <button
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors hover:bg-[color:var(--green-tint)]"
                    style={{ border: "1px solid var(--border)" }}
                  >
                    <Play size={14} style={{ color: "var(--pistachio)" }} fill="currentColor" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/app" className="btn-primary">
              Start a new recording →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
