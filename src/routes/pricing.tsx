import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Navbar } from "@/components/scribo/Navbar";
import { Footer } from "@/components/scribo/Footer";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Scribo AI" },
      { name: "description", content: "Simple plans for individuals and teams. Free forever for personal use." },
    ],
  }),
  component: PricingPage,
});

const plans = [
  {
    name: "Free",
    price: "$0",
    blurb: "For individuals getting started",
    features: ["5 hours of transcription/mo", "AI summaries & action items", "Speaker detection", "Export to PDF"],
    cta: "Get started",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$15",
    blurb: "For power users and freelancers",
    features: ["Unlimited transcription", "Translate to 30+ languages", "Notion & Google Docs export", "Soundbites & bookmarks", "Real-time AI coaching"],
    cta: "Start free trial",
    highlight: true,
  },
  {
    name: "Team",
    price: "$29",
    blurb: "Per seat, for teams of any size",
    features: ["Everything in Pro", "Channels & user groups", "Admin controls & SSO", "Analytics dashboard", "Priority support"],
    cta: "Contact sales",
    highlight: false,
  },
];

function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#FFF0F5" }}>
      <Navbar />
      <main className="flex-1 px-5 md:px-8 py-16 md:py-24">
        <div className="max-w-6xl mx-auto text-center">
          <span className="pill-badge">Pricing</span>
          <h1 className="font-display text-4xl md:text-5xl mt-5">Simple plans for everyone</h1>
          <p className="mt-4 text-[color:var(--muted-foreground)]">Free forever for individuals. Upgrade when you're ready.</p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 mt-14">
          {plans.map((p) => (
            <div
              key={p.name}
              className="rounded-3xl p-8 border shadow-card flex flex-col"
              style={{
                borderColor: p.highlight ? "var(--pistachio)" : "var(--border)",
                background: p.highlight ? "#fff" : "#fff",
                transform: p.highlight ? "scale(1.02)" : "none",
              }}
            >
              {p.highlight && <span className="pill-badge mb-4 self-start">Most popular</span>}
              <h3 className="font-display text-2xl">{p.name}</h3>
              <p className="text-sm mt-1.5">{p.blurb}</p>
              <div className="mt-6 mb-6">
                <span className="font-display text-5xl text-charcoal">{p.price}</span>
                <span className="text-[color:var(--muted-2)] text-sm ml-1">/month</span>
              </div>
              <ul className="space-y-3 flex-1 mb-8">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-charcoal">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: "color-mix(in oklab, var(--pistachio) 18%, white)" }}>
                      <Check size={12} style={{ color: "var(--pistachio)" }} strokeWidth={3} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/app" className={p.highlight ? "btn-primary" : "btn-secondary"}>{p.cta}</Link>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
