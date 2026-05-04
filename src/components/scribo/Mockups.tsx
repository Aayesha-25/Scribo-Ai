import { Mic } from "lucide-react";

export function MockTranscript() {
  const lines = [
    { s: "Alex", t: "Welcome everyone. Let's start with weekly updates." },
    { s: "Maya", t: "Onboarding flow shipped — conversion is up 12%." },
    { s: "Jay", t: "Backend migration is on track for Thursday." },
  ];
  return (
    <div className="bg-white rounded-3xl shadow-card p-5 border" style={{ borderColor: "var(--border)" }}>
      <div className="flex items-center gap-2 mb-4">
        <span className="w-2.5 h-2.5 rounded-full pulse-dot" style={{ background: "#ef4444" }} />
        <span className="text-sm font-semibold" style={{ color: "var(--pistachio)" }}>Live transcript · 02:18</span>
      </div>
      <div className="space-y-3">
        {lines.map((l, i) => (
          <div key={i} className="flex gap-3">
            <span className="font-semibold text-sm w-12 shrink-0" style={{ color: "var(--pistachio)" }}>{l.s}</span>
            <p className="text-[14px] text-charcoal">{l.t}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 flex items-end gap-1 h-10">
        {Array.from({ length: 36 }).map((_, i) => (
          <span key={i} className="wave-bar flex-1 rounded-full" style={{ background: "var(--pistachio)", height: `${30 + Math.abs(Math.sin(i * 0.8)) * 70}%`, animationDelay: `${i * 0.05}s` }} />
        ))}
      </div>
    </div>
  );
}

export function MockSummary() {
  return (
    <div className="bg-white rounded-3xl shadow-card p-5 border" style={{ borderColor: "var(--border)" }}>
      <div className="flex gap-2 mb-5 text-xs font-semibold">
        <span className="px-3 py-1.5 rounded-full text-white" style={{ background: "var(--charcoal)" }}>Summary</span>
        <span className="px-3 py-1.5 rounded-full text-[color:var(--muted-2)] bg-[color:var(--muted)]">Actions</span>
        <span className="px-3 py-1.5 rounded-full text-[color:var(--muted-2)] bg-[color:var(--muted)]">Transcript</span>
      </div>
      <h4 className="font-display font-bold mb-3 text-charcoal">TLDR</h4>
      <ul className="space-y-2.5">
        {["Team aligned on Q3 launch plan", "Marcus owns design handoff (Fri)", "Analytics module slated for next sprint", "Launch confirmed — Oct 15"].map((s, i) => (
          <li key={i} className="flex gap-2.5 text-sm text-charcoal">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--pistachio)" }} />
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MockHistory() {
  const items = [
    { title: "Q3 Roadmap Review", date: "Oct 2", duration: "32 min" },
    { title: "Customer Discovery — Acme", date: "Oct 1", duration: "48 min" },
    { title: "Design Critique", date: "Sep 28", duration: "26 min" },
    { title: "All-Hands Meeting", date: "Sep 25", duration: "55 min" },
  ];
  return (
    <div className="bg-white rounded-3xl shadow-card p-5 border" style={{ borderColor: "var(--border)" }}>
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-full mb-4" style={{ background: "var(--muted)" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[color:var(--muted-2)]"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
        <span className="text-sm text-[color:var(--muted-2)]">Search meetings...</span>
      </div>
      <div className="space-y-2">
        {items.map((m, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-2xl hover:bg-[color:var(--muted)] transition-colors">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "color-mix(in oklab, var(--pistachio) 18%, white)" }}>
                <Mic size={14} style={{ color: "var(--pistachio)" }} />
              </span>
              <div>
                <div className="font-semibold text-sm text-charcoal">{m.title}</div>
                <div className="text-xs text-[color:var(--muted-2)]">{m.date} · {m.duration}</div>
              </div>
            </div>
            <span className="text-xs text-[color:var(--muted-2)]">→</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MockExport() {
  const exports = [
    { name: "Notion", color: "#000" },
    { name: "Google Docs", color: "#4285F4" },
    { name: "Slack", color: "#4A154B" },
    { name: "PDF", color: "#E53935" },
  ];
  return (
    <div className="bg-white rounded-3xl shadow-card p-6 border" style={{ borderColor: "var(--border)" }}>
      <h4 className="font-display font-bold mb-4 text-charcoal">Export to...</h4>
      <div className="grid grid-cols-2 gap-3">
        {exports.map((e) => (
          <div key={e.name} className="flex items-center gap-3 p-3.5 rounded-2xl border" style={{ borderColor: "var(--border)" }}>
            <span className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ background: e.color }}>
              {e.name[0]}
            </span>
            <div>
              <div className="text-sm font-semibold text-charcoal">{e.name}</div>
              <div className="text-xs text-[color:var(--muted-2)]">One click</div>
            </div>
          </div>
        ))}
      </div>
      <button className="btn-primary mt-5 w-full !py-3 text-sm">Send summary →</button>
    </div>
  );
}

export function MockTranslate() {
  return (
    <div className="bg-white rounded-3xl shadow-card p-6 border" style={{ borderColor: "var(--border)" }}>
      <div className="flex items-center gap-2 mb-4 text-xs font-semibold">
        <span className="px-3 py-1.5 rounded-full" style={{ background: "var(--muted)" }}>EN</span>
        <span className="text-[color:var(--muted-2)]">→</span>
        <span className="px-3 py-1.5 rounded-full text-white" style={{ background: "var(--pistachio)" }}>ES</span>
      </div>
      <div className="space-y-3 text-sm">
        <div className="p-3 rounded-2xl" style={{ background: "var(--muted)" }}>
          <div className="text-xs text-[color:var(--muted-2)] mb-1">English</div>
          <p className="text-charcoal">Let's finalize the launch plan by Friday.</p>
        </div>
        <div className="p-3 rounded-2xl" style={{ background: "var(--green-tint)" }}>
          <div className="text-xs font-semibold mb-1" style={{ color: "var(--pistachio)" }}>Español</div>
          <p className="text-charcoal">Finalicemos el plan de lanzamiento para el viernes.</p>
        </div>
      </div>
      <div className="mt-4 text-xs text-[color:var(--muted-2)]">+ 30 more languages supported</div>
    </div>
  );
}

export function MockCoach() {
  return (
    <div className="bg-white rounded-3xl shadow-card p-5 border grid grid-cols-[1.2fr_1fr] gap-4" style={{ borderColor: "var(--border)" }}>
      <div className="space-y-2.5">
        <div className="text-xs font-semibold" style={{ color: "var(--pistachio)" }}>Live meeting</div>
        <p className="text-sm text-charcoal"><b>Sarah:</b> The pricing page conversion has dropped 8%.</p>
        <p className="text-sm text-charcoal"><b>Marcus:</b> We changed the hero copy last week...</p>
        <div className="flex items-end gap-0.5 h-8 mt-2">
          {Array.from({ length: 24 }).map((_, i) => (
            <span key={i} className="wave-bar flex-1 rounded-full" style={{ background: "var(--pistachio)", height: `${30 + Math.abs(Math.sin(i)) * 70}%`, animationDelay: `${i * 0.05}s` }} />
          ))}
        </div>
      </div>
      <div className="rounded-2xl p-4" style={{ background: "var(--green-tint)" }}>
        <div className="flex items-center gap-1.5 mb-2.5">
          <span className="text-xs font-bold" style={{ color: "var(--pistachio)" }}>✦ AI Coach</span>
        </div>
        <div className="space-y-2 text-xs text-charcoal">
          <div className="bg-white rounded-xl p-2.5 shadow-soft">💡 Ask: did pricing also change?</div>
          <div className="bg-white rounded-xl p-2.5 shadow-soft">📊 Compare bounce rate week-over-week</div>
          <div className="bg-white rounded-xl p-2.5 shadow-soft">⏰ Reminder: keep to 30 min</div>
        </div>
      </div>
    </div>
  );
}
