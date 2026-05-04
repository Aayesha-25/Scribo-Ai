import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Features", href: "/#features" },
  { label: "How it Works", href: "/#how" },
  { label: "History", to: "/history" as const },
  { label: "Pricing", to: "/pricing" as const },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 bg-white border-b transition-shadow"
      style={{
        borderColor: "var(--border)",
        boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.06)" : "none",
      }}
    >
      <nav className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <Link to="/">
          <Logo />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) =>
            l.to ? (
              <Link
                key={l.label}
                to={l.to}
                className="text-[15px] text-[color:var(--muted-foreground)] hover:text-charcoal transition-colors"
                activeProps={{ style: { color: "var(--charcoal)", fontWeight: 600 } }}
              >
                {l.label}
              </Link>
            ) : (
              <a
                key={l.label}
                href={l.href}
                className="text-[15px] text-[color:var(--muted-foreground)] hover:text-charcoal transition-colors"
              >
                {l.label}
              </a>
            ),
          )}
        </div>

        <div className="hidden md:flex items-center gap-5">
          <a href="#" className="text-[15px] text-[color:var(--muted-2)] hover:text-charcoal">
            Sign in
          </a>
          <Link to="/app" className="btn-primary !py-2.5 !px-5 text-[14px]">
            Get started free
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-2 text-charcoal"
          aria-label="Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t bg-white px-5 py-4 flex flex-col gap-4" style={{ borderColor: "var(--border)" }}>
          {links.map((l) =>
            l.to ? (
              <Link key={l.label} to={l.to} onClick={() => setOpen(false)} className="text-charcoal">
                {l.label}
              </Link>
            ) : (
              <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="text-charcoal">
                {l.label}
              </a>
            ),
          )}
          <Link to="/app" className="btn-primary text-[14px] w-fit" onClick={() => setOpen(false)}>
            Get started free
          </Link>
        </div>
      )}
    </header>
  );
}
