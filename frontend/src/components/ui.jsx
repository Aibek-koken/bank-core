import { useEffect } from "react";
import { X } from "lucide-react";

export function Modal({ open, onClose, title, subtitle, children, maxWidth = "max-w-lg" }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 animate-fade-in bg-ink-950/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`glass relative w-full ${maxWidth} animate-scale-in rounded-2xl p-6 shadow-panel`}
        role="dialog"
        aria-modal="true"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">{title}</h3>
            {subtitle && <p className="mt-0.5 text-sm text-slate-400">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-white/5 hover:text-white"
            aria-label="Закрыть"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Switch({ checked, onChange, disabled, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-300 ${
        checked ? "bg-brand-500 shadow-glow-sm" : "bg-ink-700"
      } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-300 ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export function MetricCard({ icon: Icon, label, value, sub, accent = "brand" }) {
  const accents = {
    brand: "text-brand-300 bg-brand-500/10 border-brand-500/20",
    gold: "text-gold-300 bg-gold-500/10 border-gold-500/20",
    rose: "text-rose-300 bg-rose-500/10 border-rose-500/20",
    sky: "text-sky-300 bg-sky-500/10 border-sky-500/20",
    violet: "text-violet-300 bg-violet-500/10 border-violet-500/20",
  };
  return (
    <div className="glass animate-fade-up rounded-2xl p-5">
      <div className="flex items-center gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${accents[accent]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</p>
          <p className="tabular truncate text-2xl font-bold leading-tight text-white">{value}</p>
          {sub && <p className="mt-0.5 truncate text-xs text-slate-400">{sub}</p>}
        </div>
      </div>
    </div>
  );
}

export function Badge({ tone = "brand", children }) {
  const map = {
    brand: "border-brand-500/30 bg-brand-500/10 text-brand-300",
    gold: "border-gold-500/30 bg-gold-500/10 text-gold-300",
    rose: "border-rose-500/30 bg-rose-500/10 text-rose-300",
    slate: "border-white/10 bg-white/5 text-slate-400",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${map[tone]}`}>
      {children}
    </span>
  );
}

export function StatusPill({ online }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${
        online
          ? "border-brand-500/30 bg-brand-500/10 text-brand-300"
          : "border-rose-500/30 bg-rose-500/10 text-rose-300"
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${online ? "animate-pulse-glow bg-brand-400" : "bg-rose-500"}`}
      />
      {online ? "Core API online" : "Core API offline"}
    </span>
  );
}