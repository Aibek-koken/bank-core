import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";
import { uniqId } from "../lib/format";

const ToastContext = createContext(null);

const STYLES = {
  success: {
    ring: "border-brand-500/40",
    icon: <CheckCircle2 className="h-5 w-5 text-brand-400" />,
    bar: "bg-brand-400",
  },
  error: {
    ring: "border-rose-500/40",
    icon: <XCircle className="h-5 w-5 text-rose-400" />,
    bar: "bg-rose-500",
  },
  warning: {
    ring: "border-gold-400/40",
    icon: <AlertTriangle className="h-5 w-5 text-gold-400" />,
    bar: "bg-gold-400",
  },
  info: {
    ring: "border-sky-500/40",
    icon: <Info className="h-5 w-5 text-sky-400" />,
    bar: "bg-sky-500",
  },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  }, []);

  const push = useCallback(
    (type, title, description) => {
      const id = uniqId();
      setToasts((prev) => [...prev.slice(-4), { id, type, title, description }]);
      timers.current[id] = setTimeout(() => dismiss(id), 5200);
    },
    [dismiss],
  );

  const api = useMemo(
    () => ({
      success: (title, description) => push("success", title, description),
      error: (title, description) => push("error", title, description),
      warning: (title, description) => push("warning", title, description),
      info: (title, description) => push("info", title, description),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed right-5 top-5 z-[100] flex w-[360px] max-w-[calc(100vw-40px)] flex-col gap-3">
        {toasts.map((t) => {
          const s = STYLES[t.type];
          return (
            <div
              key={t.id}
              className={`relative pointer-events-auto animate-slide-right overflow-hidden rounded-xl border ${s.ring} bg-ink-850/95 p-4 pr-10 shadow-panel backdrop-blur-md`}
            >
              <span className={`absolute inset-y-0 left-0 w-1 ${s.bar}`} />
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">{s.icon}</div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">{t.title}</p>
                  {t.description && (
                    <p className="mt-0.5 break-words text-xs leading-relaxed text-slate-400">
                      {t.description}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className="absolute right-2.5 top-2.5 rounded-md p-1 text-slate-500 transition-colors hover:bg-white/5 hover:text-white"
                aria-label="Закрыть"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}