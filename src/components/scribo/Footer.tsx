import { Link } from "@tanstack/react-router";
import { Mic } from "lucide-react";

export function Footer() {
  return (
    <footer style={{ background: "#1C1C1C" }} className="text-white">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/10">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center rounded-full w-9 h-9" style={{ background: "rgba(142,201,154,0.15)" }}>
            <Mic size={18} style={{ color: "var(--pistachio)" }} strokeWidth={2.5} />
          </span>
          <span className="font-display font-extrabold text-[18px]">Scribo AI</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-white/70">
          <a href="/#features" className="hover:text-white">Features</a>
          <Link to="/pricing" className="hover:text-white">Pricing</Link>
          <a href="#" className="hover:text-white">Privacy</a>
          <a href="#" className="hover:text-white">Terms</a>
        </div>
        <p className="text-sm text-white/60">Made with ♥ for teams everywhere</p>
      </div>
      <div className="text-center text-xs text-white/40 pb-6">© 2025 Scribo AI. All rights reserved.</div>
    </footer>
  );
}
