import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Mic, ArrowLeft, Copy, Download, FileText,
  CheckSquare, Loader2, Clock, Calendar,
  ChevronDown, ChevronUp
} from "lucide-react";
import { Navbar } from "@/components/scribo/Navbar";
import { Footer } from "@/components/scribo/Footer";
import { toast } from "sonner";

// ── ROUTE SETUP ──────────────────────────────
export const Route = createFileRoute("/result")({
  validateSearch: (search: Record<string, unknown>) => ({
    meetingId: (search.meetingId as string) || "",
  }),
  head: () => ({
    meta: [
      { title: "Meeting Results — Scribo AI" },
      { name: "description", content: "View your meeting transcript, summary, and action items." },
    ],
  }),
  component: ResultsPage,
});

// ── BACKEND URL ──────────────────────────────
const BACKEND_URL = "http://localhost:3000";

// ── TYPES ────────────────────────────────────
interface ActionItem {
  task: string;
  owner: string;
  due: string;
}

interface Meeting {
  id: string;
  title: string;
  status: string;
  duration_seconds: number;
  audio_url: string;
  created_at: string;
  summaries: {
    tldr: string;
    key_points: string[];
    action_items: ActionItem[];
  }[];
  transcripts: {
    full_text: string;
    segments: { word: string; start: number; end: number; speaker: number }[];
  }[];
}

// ── HELPERS ──────────────────────────────────
function formatDuration(seconds: number) {
  if (!seconds) return "Unknown";
  const mins = Math.floor(seconds / 60);
  const hrs = Math.floor(mins / 60);
  if (hrs > 0) return `${hrs}h ${mins % 60}m`;
  return `${mins} min`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });
}

// ── MAIN COMPONENT ───────────────────────────
function ResultsPage() {
  const { meetingId } = Route.useSearch();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"summary" | "transcript" | "actions">("summary");
  const [showFullTranscript, setShowFullTranscript] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

  // ── FETCH MEETING ────────────────────────────
  useEffect(() => {
    if (!meetingId) {
      navigate({ to: "/history" });
      return;
    }
    fetchMeeting();
  }, [meetingId]);

  const fetchMeeting = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/api/meetings/${meetingId}`);
      if (!response.ok) throw new Error("Meeting not found");
      const data = await response.json();
      setMeeting(data.meeting);
    } catch (err) {
      toast.error("Failed to load meeting");
      navigate({ to: "/history" });
    } finally {
      setLoading(false);
    }
  };

  // ── COPY TO CLIPBOARD ────────────────────────
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  // ── DOWNLOAD AS TXT ──────────────────────────
  const downloadTxt = () => {
    if (!meeting) return;
    const summary = meeting.summaries?.[0];
    const transcript = meeting.transcripts?.[0];

    const content = `
SCRIBO AI — MEETING NOTES
=========================
Title: ${meeting.title}
Date: ${formatDate(meeting.created_at)}
Duration: ${formatDuration(meeting.duration_seconds)}

TLDR
----
${summary?.tldr || "No summary available"}

KEY POINTS
----------
${summary?.key_points?.map((p, i) => `${i + 1}. ${p}`).join("\n") || "No key points"}

ACTION ITEMS
------------
${summary?.action_items?.map((a, i) => `${i + 1}. ${a.task} — ${a.owner} (Due: ${a.due})`).join("\n") || "No action items"}

FULL TRANSCRIPT
---------------
${transcript?.full_text || "No transcript available"}
    `.trim();

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${meeting.title.replace(/\s+/g, "_")}_notes.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Notes downloaded!");
  };

  // ── EXPORT TO NOTION (copy formatted) ────────
  const exportToNotion = () => {
    if (!meeting) return;
    const summary = meeting.summaries?.[0];
    const content = `# ${meeting.title}

## TLDR
${summary?.tldr || ""}

## Key Points
${summary?.key_points?.map(p => `- ${p}`).join("\n") || ""}

## Action Items
${summary?.action_items?.map(a => `- [ ] ${a.task} — **${a.owner}** (Due: ${a.due})`).join("\n") || ""}

## Full Transcript
${meeting.transcripts?.[0]?.full_text || ""}`;

    navigator.clipboard.writeText(content);
    toast.success("Copied in Notion format! Paste into Notion.");
  };

  // ── TOGGLE ACTION ITEM ───────────────────────
  const toggleAction = (index: number) => {
    setCheckedItems(prev => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  // ── LOADING STATE ────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "#FFF0F5" }}>
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 size={40} className="animate-spin" style={{ color: "var(--pistachio)" }} />
            <p className="text-gray-500">Loading meeting...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!meeting) return null;

  const summary = meeting.summaries?.[0];
  const transcript = meeting.transcripts?.[0];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#FFF0F5" }}>
      <Navbar />
      <main className="flex-1 px-5 md:px-8 py-10">
        <div className="max-w-5xl mx-auto">

          {/* Back button */}
          <Link
            to="/history"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-charcoal mb-6 transition-colors"
          >
            <ArrowLeft size={16} /> Back to history
          </Link>

          {/* Header */}
          <div className="bg-white rounded-3xl border p-6 md:p-8 mb-6" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <span
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: "color-mix(in oklab, var(--pistachio) 18%, white)" }}
                >
                  <Mic size={26} style={{ color: "var(--pistachio)" }} />
                </span>
                <div>
                  <h1 className="font-display text-2xl md:text-3xl text-charcoal">{meeting.title}</h1>
                  <div className="flex items-center gap-4 mt-1.5 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} /> {formatDate(meeting.created_at)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} /> {formatDuration(meeting.duration_seconds)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Export buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={exportToNotion}
                  className="btn-secondary text-sm !py-2 !px-4"
                >
                  📎 Notion
                </button>
                <button
                  onClick={() => copyToClipboard(transcript?.full_text || "", "Transcript")}
                  className="btn-secondary text-sm !py-2 !px-4"
                >
                  <Copy size={14} /> Copy
                </button>
                <button
                  onClick={downloadTxt}
                  className="btn-primary text-sm !py-2 !px-4"
                >
                  <Download size={14} /> Download
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {(["summary", "actions", "transcript"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize"
                style={{
                  background: activeTab === tab ? "var(--charcoal)" : "white",
                  color: activeTab === tab ? "white" : "var(--muted-foreground)",
                  border: "1px solid var(--border)",
                }}
              >
                {tab === "summary" && "📋 "}
                {tab === "actions" && "✅ "}
                {tab === "transcript" && "📝 "}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* SUMMARY TAB */}
          {activeTab === "summary" && (
            <div className="space-y-4">
              {/* TLDR */}
              <div className="bg-white rounded-2xl border p-6" style={{ borderColor: "var(--border)" }}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-display text-lg text-charcoal">TL;DR</h2>
                  <button
                    onClick={() => copyToClipboard(summary?.tldr || "", "TLDR")}
                    className="text-gray-400 hover:text-charcoal transition-colors"
                  >
                    <Copy size={15} />
                  </button>
                </div>
                <div
                  className="rounded-xl p-4 text-sm leading-relaxed"
                  style={{ background: "color-mix(in oklab, var(--pistachio) 12%, white)", color: "var(--charcoal)" }}
                >
                  {summary?.tldr || "No summary available"}
                </div>
              </div>

              {/* Key Points */}
              <div className="bg-white rounded-2xl border p-6" style={{ borderColor: "var(--border)" }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-lg text-charcoal">Key Points</h2>
                  <button
                    onClick={() => copyToClipboard(summary?.key_points?.join("\n") || "", "Key points")}
                    className="text-gray-400 hover:text-charcoal transition-colors"
                  >
                    <Copy size={15} />
                  </button>
                </div>
                <ul className="space-y-2.5">
                  {summary?.key_points?.map((point, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold text-white"
                        style={{ background: "var(--pistachio)" }}
                      >
                        {i + 1}
                      </span>
                      <span className="text-sm text-gray-700 leading-relaxed">{point}</span>
                    </li>
                  )) || <p className="text-sm text-gray-500">No key points available</p>}
                </ul>
              </div>
            </div>
          )}

          {/* ACTIONS TAB */}
          {activeTab === "actions" && (
            <div className="bg-white rounded-2xl border p-6" style={{ borderColor: "var(--border)" }}>
              <h2 className="font-display text-lg text-charcoal mb-4">
                Action Items
                <span className="ml-2 text-sm font-normal text-gray-400">
                  ({checkedItems.size}/{summary?.action_items?.length || 0} done)
                </span>
              </h2>
              <div className="space-y-3">
                {summary?.action_items?.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => toggleAction(i)}
                    className="flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all"
                    style={{
                      background: checkedItems.has(i) ? "color-mix(in oklab, var(--pistachio) 10%, white)" : "var(--muted)",
                      borderLeft: checkedItems.has(i) ? "3px solid var(--pistachio)" : "3px solid transparent",
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 transition-all"
                      style={{
                        background: checkedItems.has(i) ? "var(--pistachio)" : "white",
                        border: `2px solid ${checkedItems.has(i) ? "var(--pistachio)" : "var(--border)"}`,
                      }}
                    >
                      {checkedItems.has(i) && <CheckSquare size={12} className="text-white" />}
                    </div>
                    <div className="flex-1">
                      <p
                        className="text-sm font-medium"
                        style={{
                          color: checkedItems.has(i) ? "var(--muted-foreground)" : "var(--charcoal)",
                          textDecoration: checkedItems.has(i) ? "line-through" : "none",
                        }}
                      >
                        {item.task}
                      </p>
                      <div className="flex gap-3 mt-1 text-xs text-gray-400">
                        <span>👤 {item.owner}</span>
                        <span>📅 {item.due}</span>
                      </div>
                    </div>
                  </div>
                )) || <p className="text-sm text-gray-500">No action items found</p>}
              </div>
            </div>
          )}

          {/* TRANSCRIPT TAB */}
          {activeTab === "transcript" && (
            <div className="bg-white rounded-2xl border p-6" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg text-charcoal">Full Transcript</h2>
                <button
                  onClick={() => copyToClipboard(transcript?.full_text || "", "Transcript")}
                  className="btn-secondary text-sm !py-1.5 !px-3"
                >
                  <Copy size={13} /> Copy all
                </button>
              </div>
              <div className="text-sm text-gray-700 leading-relaxed">
                {transcript?.full_text ? (
                  <>
                    <p>
                      {showFullTranscript
                        ? transcript.full_text
                        : transcript.full_text.slice(0, 800) + (transcript.full_text.length > 800 ? "..." : "")}
                    </p>
                    {transcript.full_text.length > 800 && (
                      <button
                        onClick={() => setShowFullTranscript(!showFullTranscript)}
                        className="mt-4 flex items-center gap-1.5 text-sm font-medium"
                        style={{ color: "var(--pistachio)" }}
                      >
                        {showFullTranscript ? (
                          <><ChevronUp size={16} /> Show less</>
                        ) : (
                          <><ChevronDown size={16} /> Show full transcript</>
                        )}
                      </button>
                    )}
                  </>
                ) : (
                  <p className="text-gray-500">No transcript available</p>
                )}
              </div>
            </div>
          )}

          {/* Bottom CTA */}
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
