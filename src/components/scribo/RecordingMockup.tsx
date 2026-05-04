import { Mic } from "lucide-react";

export function RecordingMockup() {
  const lines = [
    { speaker: "Sarah", time: "00:14", text: "Let's kick off with the Q3 roadmap review. Priya, can you walk us through the highlights?" },
    { speaker: "Priya", time: "00:32", text: "Sure! We're shipping the new dashboard next sprint, then moving onto the analytics module." },
    { speaker: "Marcus", time: "01:05", text: "Sounds great. I'll handle the design handoff by Friday." },
    { speaker: "Sarah", time: "01:21", text: "Perfect. Let's also align on the launch date — I'm thinking October 15th." },
  ];

  const summary = [
    "Q3 roadmap reviewed — dashboard ships next sprint",
    "Analytics module follows after dashboard launch",
    "Design handoff due Friday (owner: Marcus)",
    "Target launch date: October 15th",
  ];

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-3xl shadow-card overflow-hidden border" style={{ borderColor: "var(--border)" }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2.5">
          <span className="inline-flex w-8 h-8 items-center justify-center rounded-full" style={{ background: "color-mix(in oklab, var(--pistachio) 18%, white)" }}>
            <Mic size={16} style={{ color: "var(--pistachio)" }} strokeWidth={2.5} />
          </span>
          <span className="font-semibold" style={{ color: "var(--pistachio)" }}>Recording... 04:32</span>
          <span className="w-2.5 h-2.5 rounded-full pulse-dot" style={{ background: "#ef4444" }} />
        </div>
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#FFF0F5]" />
          <span className="w-3 h-3 rounded-full bg-[#F0FAF2]" />
          <span className="w-3 h-3 rounded-full bg-[#F0E8EC]" />
        </div>
      </div>

      <div className="grid md:grid-cols-[1.6fr_1fr]">
        {/* Transcript */}
        <div className="p-6 space-y-4">
          {lines.map((l, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-end shrink-0 w-20">
                <span className="font-semibold text-sm" style={{ color: "var(--pistachio)" }}>{l.speaker}</span>
                <span className="text-xs text-[color:var(--muted-2)]">{l.time}</span>
              </div>
              <p className="text-[14.5px] text-charcoal leading-relaxed">{l.text}</p>
            </div>
          ))}
          {/* Waveform */}
          <div className="pt-4 flex items-end gap-1 h-12">
            {Array.from({ length: 48 }).map((_, i) => (
              <span
                key={i}
                className="wave-bar flex-1 rounded-full"
                style={{
                  background: "var(--pistachio)",
                  height: `${20 + Math.abs(Math.sin(i * 0.7)) * 80}%`,
                  animationDelay: `${i * 0.04}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* AI Summary sidebar */}
        <div className="border-l p-5" style={{ borderColor: "var(--border)", background: "#FAFAFA" }}>
          <div className="flex gap-2 mb-4">
            <button className="px-3 py-1.5 rounded-full text-xs font-semibold text-white" style={{ background: "var(--charcoal)" }}>AI Summary</button>
            <button className="px-3 py-1.5 rounded-full text-xs font-semibold text-[color:var(--muted-2)]">Actions</button>
          </div>
          <ul className="space-y-3">
            {summary.map((s, i) => (
              <li key={i} className="flex gap-2.5 text-[13.5px] text-charcoal leading-relaxed">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--pistachio)" }} />
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
