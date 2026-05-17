import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { Menu, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const links = [
  { label: "Features", href: "/#features" },
  { label: "How it Works", href: "/#how" },
  { label: "History", to: "/history" as const },
  { label: "Pricing", to: "/pricing" as const },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Check if user is logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sign out
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully!");
  };

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
          {user ? (
            <>
              <span className="text-[13px] text-gray-500 truncate max-w-[160px]">
                {user.email}
              </span>
              <Link to="/app" className="btn-secondary !py-2 !px-4 text-[14px]">
                Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                className="text-[14px] text-[color:var(--muted-2)] hover:text-charcoal transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-[15px] text-[color:var(--muted-2)] hover:text-charcoal transition-colors"
              >
                Sign in
              </Link>
              <Link to="/login" className="btn-primary !py-2.5 !px-5 text-[14px]">
                Get started free
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-2 text-charcoal"
          aria-label="Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden border-t bg-white px-5 py-4 flex flex-col gap-4"
          style={{ borderColor: "var(--border)" }}
        >
          {links.map((l) =>
            l.to ? (
              <Link
                key={l.label}
                to={l.to}
                onClick={() => setOpen(false)}
                className="text-charcoal"
              >
                {l.label}
              </Link>
            ) : (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-charcoal"
              >
                {l.label}
              </a>
            ),
          )}
          {user ? (
            <>
              <Link
                to="/app"
                className="btn-primary text-[14px] w-fit"
                onClick={() => setOpen(false)}
              >
                Dashboard
              </Link>
              <button
                onClick={() => { handleSignOut(); setOpen(false); }}
                className="text-[14px] text-left text-red-400"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="btn-primary text-[14px] w-fit"
              onClick={() => setOpen(false)}
            >
              Get started free
            </Link>
          )}
        </div>
      )}
    </header>
  );
}