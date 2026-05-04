import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Mic, FileText, Sparkles, Search, Download, Languages, MessageSquare, ShieldCheck, Lock, Users, Database, Server, Bookmark, FolderOpen, BarChart3, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/scribo/Navbar";
import { Footer } from "@/components/scribo/Footer";
import { RecordingMockup } from "@/components/scribo/RecordingMockup";
import { MockTranscript, MockSummary, MockHistory, MockExport, MockTranslate, MockCoach } from "@/components/scribo/Mockups";
import { useReveal } from "@/hooks/use-reveal";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Scribo AI — Never miss a word from any meeting" },
      { name: "description", content: "Scribo AI records, transcribes, and summarizes your meetings and lectures instantly. AI-powered note taker with speaker detection, summaries, and 30+ languages." },
      { property: "og:title", content: "Scribo AI — AI meeting & lecture note taker" },
      { property: "og:description", content: "Record, transcribe, and summarize meetings instantly with AI." },
    ],
  }),
  component: Index,
});

function Index() {
  useReveal();
  useEffect(() => { document.documentElement.classList.remove("dark"); }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#FFF0F5" }}>
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <Security />
      <MoreCapabilities />
      <Testimonials />
      <CTAFooter />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="px-5 md:px-8 pt-12 md:pt-20 pb-16" style={{ background: "#FFF0F5" }}>
      <div className="max-w-6xl mx-auto text-center">
        <div className="reveal inline-flex"><span className="pill-badge">✦ AI Note Taker</span></div>
        <h1 className="reveal mt-6 font-display font-extrabold text-[44px] sm:text-[56px] md:text-[68px] leading-[1.05] text-charcoal tracking-tight">
          Never miss a word<br />from any meeting.
        </h1>
        <p className="reveal mt-6 text-[17px] md:text-[18px] max-w-2xl mx-auto text-[color:var(--muted-foreground)] leading-relaxed">
          Scribo AI records, transcribes, and summarizes your meetings and lectures instantly — so you can focus on the conversation.
        </p>
        <div className="reveal mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/app" className="btn-primary">Start recording free →</Link>
          <a href="#how" className="btn-secondary">See how it works</a>
        </div>
      </div>

      <div className="reveal max-w-6xl mx-auto mt-14 md:mt-20">
        <RecordingMockup />
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { icon: Mic, title: "Record or Upload", body: "Hit record for live meetings or upload an audio/video file. Supports MP3, MP4, WAV, M4A." },
    { icon: FileText, title: "Get Your Transcript", body: "Scribo AI transcribes everything with speaker labels and precise timestamps." },
    { icon: Sparkles, title: "AI Summary & Actions", body: "Get a clean TLDR, key decisions, and action items extracted automatically." },
  ];
  return (
    <section id="how" className="px-5 md:px-8 py-20 md:py-28 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="reveal text-center font-display text-4xl md:text-5xl">From recording to insights in seconds</h2>
        <p className="reveal text-center mt-4 text-[color:var(--muted-foreground)] max-w-xl mx-auto">Three steps. No setup. No friction.</p>

        <div className="grid md:grid-cols-3 gap-6 mt-14">
          {steps.map((s, i) => (
            <div key={i} className="reveal bg-white rounded-3xl p-7 shadow-soft border" style={{ borderColor: "var(--border)" }}>
              <span className="w-14 h-14 rounded-full flex items-center justify-center mb-5" style={{ background: "color-mix(in oklab, var(--pistachio) 18%, white)" }}>
                <s.icon size={24} style={{ color: "var(--pistachio)" }} strokeWidth={2.4} />
              </span>
              <div className="text-xs font-bold mb-2" style={{ color: "var(--pistachio)" }}>STEP {i + 1}</div>
              <h3 className="font-display text-xl mb-2">{s.title}</h3>
              <p className="text-[15px] leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureRow({ bg, reverse, badge, title, body, mockup }: { bg: string; reverse?: boolean; badge?: string; title: string; body: string; mockup: React.ReactNode }) {
  return (
    <div className="px-5 md:px-8 py-20 md:py-24" style={{ background: bg }}>
      <div className={`max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-center ${reverse ? "md:[&>div:first-child]:order-2" : ""}`}>
        <div className="reveal">
          {badge && <span className="pill-badge mb-5">{badge}</span>}
          <h3 className="font-display text-3xl md:text-[40px] leading-tight mb-5">{title}</h3>
          <p className="text-[16px] leading-relaxed max-w-md">{body}</p>
        </div>
        <div className="reveal">{mockup}</div>
      </div>
    </div>
  );
}

function Features() {
  return (
    <section id="features">
      <div className="text-center pt-20 md:pt-28 px-5" style={{ background: "#FFF0F5" }}>
        <span className="pill-badge">Features</span>
        <h2 className="font-display text-4xl md:text-5xl mt-5 max-w-3xl mx-auto">Everything you need from a meeting</h2>
      </div>

      <FeatureRow bg="#FFF0F5" title="Live recording with real-time transcript"
        body="Start recording with one click. Watch your words appear on screen as you speak, with automatic speaker detection and timestamps."
        mockup={<MockTranscript />} />

      <FeatureRow bg="#FFFFFF" reverse title="AI-powered summaries & action items"
        body="Scribo AI reads your entire transcript and pulls out the TLDR, key decisions made, and every action item with owner names and deadlines."
        mockup={<MockSummary />} />

      <FeatureRow bg="#F0FAF2" title="Meeting history with search"
        body="Every meeting is saved automatically. Search across all your transcripts and summaries to find any moment from any meeting."
        mockup={<MockHistory />} />

      <FeatureRow bg="#FFFFFF" reverse title="Export to Notion & Google Docs"
        body="Send your summary and transcript anywhere with one click. Notion, Google Docs, or download as PDF."
        mockup={<MockExport />} />

      <FeatureRow bg="#FFF0F5" title="Translate transcripts instantly"
        body="Scribo AI can translate your transcript into 30+ languages in seconds — perfect for global teams and multilingual meetings."
        mockup={<MockTranslate />} />

      <FeatureRow bg="#FFFFFF" reverse title="Real-time coaching & suggestions"
        body="Get live suggestions during your meeting — talking points, follow-up questions, and smart reminders based on what's being discussed."
        mockup={<MockCoach />} />
    </section>
  );
}

function Security() {
  const main = [
    { icon: ShieldCheck, title: "SOC 2 Type II", body: "Industry standard for data security and confidentiality" },
    { icon: Lock, title: "GDPR Compliant", body: "Privacy standards aligned with European regulations" },
    { icon: ShieldCheck, title: "HIPAA Compliant", body: "Full protection for healthcare organizations" },
    { icon: Database, title: "Zero Data Retention", body: "Your data is never used for AI training or shared" },
  ];
  const extra = [
    { icon: Server, title: "Private Cloud Storage", body: "Dedicated secure storage for your organization" },
    { icon: Users, title: "You Own Your Data", body: "Full control and ownership of everything you record" },
  ];
  return (
    <section className="px-5 md:px-8 py-20 md:py-28" style={{ background: "#1C1C1C" }}>
      <div className="max-w-6xl mx-auto">
        <h2 className="reveal text-center font-display text-4xl md:text-5xl text-white">Enterprise-grade security you can trust</h2>
        <p className="reveal text-center mt-4 text-white/60 max-w-xl mx-auto">Your meetings are private. We never use your data for AI training.</p>

        <div className="grid sm:grid-cols-2 gap-5 mt-14">
          {main.map((s, i) => (
            <div key={i} className="reveal bg-white rounded-3xl p-7 shadow-card">
              <span className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ background: "color-mix(in oklab, var(--pistachio) 18%, white)" }}>
                <s.icon size={22} style={{ color: "var(--pistachio)" }} strokeWidth={2.4} />
              </span>
              <h3 className="font-display text-lg mb-1.5">{s.title}</h3>
              <p className="text-sm">{s.body}</p>
            </div>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 gap-5 mt-5">
          {extra.map((s, i) => (
            <div key={i} className="reveal bg-white rounded-3xl p-7 shadow-card">
              <span className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ background: "color-mix(in oklab, var(--pistachio) 18%, white)" }}>
                <s.icon size={22} style={{ color: "var(--pistachio)" }} strokeWidth={2.4} />
              </span>
              <h3 className="font-display text-lg mb-1.5">{s.title}</h3>
              <p className="text-sm">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MoreCapabilities() {
  const items = [
    { icon: Bookmark, title: "Soundbites", body: "Clip key moments into shareable snippets" },
    { icon: Download, title: "Download Meetings", body: "Export audio, video, or transcript" },
    { icon: MessageCircle, title: "Comments & Bookmarks", body: "Leave timestamped notes on any moment" },
    { icon: FolderOpen, title: "Channels", body: "Organize meetings by team or project" },
    { icon: Users, title: "User Groups", body: "Share meetings across different teams" },
    { icon: BarChart3, title: "Analytics", body: "Track talk time, topics, and engagement" },
  ];
  return (
    <section className="px-5 md:px-8 py-20 md:py-28 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="reveal text-center font-display text-4xl md:text-5xl">…and many more capabilities</h2>
        <p className="reveal text-center mt-4 text-[color:var(--muted-foreground)]">Built for power users and growing teams.</p>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 mt-14">
          {items.map((s, i) => (
            <div key={i} className="reveal rounded-3xl p-6 border bg-white shadow-soft" style={{ borderColor: "var(--border)" }}>
              <span className="w-11 h-11 rounded-full flex items-center justify-center mb-4" style={{ background: "color-mix(in oklab, var(--pistachio) 18%, white)" }}>
                <s.icon size={20} style={{ color: "var(--pistachio)" }} strokeWidth={2.4} />
              </span>
              <h3 className="font-display text-lg mb-1.5">{s.title}</h3>
              <p className="text-sm">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    { q: "Scribo AI saved our team hours every week. The action items are always spot on.", who: "Priya M.", role: "Product Manager" },
    { q: "I use it for every lecture now. The summaries are better than my own notes.", who: "Arjun K.", role: "Computer Science Student" },
    { q: "The translation feature is a game changer for our global sales calls.", who: "Sofia L.", role: "Sales Director" },
  ];
  return (
    <section className="px-5 md:px-8 py-20 md:py-28" style={{ background: "#FFF0F5" }}>
      <div className="max-w-6xl mx-auto">
        <h2 className="reveal text-center font-display text-4xl md:text-5xl">Don't just take our word for it</h2>
        <div className="grid md:grid-cols-3 gap-6 mt-14">
          {items.map((t, i) => (
            <div key={i} className="reveal bg-white rounded-3xl p-7 shadow-card">
              <MessageSquare size={22} style={{ color: "var(--pistachio)" }} className="mb-4" />
              <p className="text-charcoal text-[16px] leading-relaxed font-medium">"{t.q}"</p>
              <div className="mt-6 pt-5 border-t" style={{ borderColor: "var(--border)" }}>
                <div className="font-semibold text-charcoal">{t.who}</div>
                <div className="text-sm text-[color:var(--muted-2)]">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTAFooter() {
  return (
    <section className="px-5 md:px-8 py-24 md:py-32 text-center" style={{ background: "#1C1C1C" }}>
      <div className="max-w-3xl mx-auto">
        <h2 className="reveal font-display text-4xl md:text-6xl text-white leading-[1.05]">Start capturing your meetings today.</h2>
        <p className="reveal mt-5 text-white/60 text-lg">Free forever for individuals. No credit card needed.</p>
        <div className="reveal mt-8">
          <Link to="/app" className="btn-green">Get started free →</Link>
        </div>
      </div>
    </section>
  );
}
