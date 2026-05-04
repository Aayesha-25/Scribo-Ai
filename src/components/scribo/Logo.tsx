import { Mic } from "lucide-react";

export function Logo({ size = 28 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="inline-flex items-center justify-center rounded-full"
        style={{
          width: size + 8,
          height: size + 8,
          background: "color-mix(in oklab, var(--pistachio) 18%, white)",
        }}
      >
        <Mic size={size - 10} style={{ color: "var(--pistachio)" }} strokeWidth={2.5} />
      </span>
      <span className="font-display font-extrabold text-[20px] text-charcoal">Scribo AI</span>
    </div>
  );
}
