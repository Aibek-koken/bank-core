import { useEffect, useMemo, useRef, useState } from "react";
import {
  Terminal as TerminalIcon,
  Trash2,
  Pause,
  Play,
  Fingerprint,
} from "lucide-react";
import { useLogs } from "../lib/logger";
import { api } from "../lib/api";
import { moneyKZT } from "../lib/format";
import { useInterval } from "../lib/hooks";

const LEVEL_STYLE = {
  INFO: { text: "text-sky-300", chip: "bg-sky-500/15 text-sky-300 border-sky-500/30" },
  SUCCESS: { text: "text-emerald-300", chip: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  WARN: { text: "text-amber-300", chip: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
  ERROR: { text: "text-rose-300", chip: "bg-rose-500/15 text-rose-300 border-rose-500/30" },
  AUDIT: { text: "text-violet-300", chip: "bg-violet-500/15 text-violet-300 border-violet-500/30" },
  SYS: { text: "text-cyan-300", chip: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30" },
};

const FILTERS = ["ALL", "INFO", "SUCCESS", "WARN", "ERROR", "AUDIT", "SYS"];

export default function Terminal({ accounts }) {
  const logs = useLogs();
  const [paused, setPaused] = useState(false);
  const [filter, setFilter] = useState("ALL");
  const [auditTarget, setAuditTarget] = useState("");
  const boxRef = useRef(null);
  const stickBottom = useRef(true);

  const autoScroll = () => {
    if (stickBottom.current && boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  };

  useEffect(autoScroll, [logs.logs.length]);

  const onScroll = () => {
    const el = boxRef.current;
    if (!el) return;
    const bottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
    stickBottom.current = bottom;
  };

  useInterval(
    () => {
      logs.sys("core ∷ status poll tick · kernel responsive", "terminal");
    },
    10000,
    { enabled: !paused },
  );

  useInterval(
    () => {
      if (!auditTarget) return;
      logs.audit(`audit ∷ polling summary #${auditTarget}...`, "terminal");
      api
        .auditSummary(auditTarget)
        .then((res) => logs.audit(`audit ∷ #${auditTarget} → ${res.data ?? res.message}`, "admin"))
        .catch((e) => logs.error(`audit ∷ poll #${auditTarget} failed · ${e.message}`, "terminal"));
    },
    6000,
    { enabled: !paused && !!auditTarget },
  );

  const visible = useMemo(
    () =>
      logs.logs.filter((l) => filter === "ALL" || l.level === filter),
    [logs.logs, filter],
  );

  return (
    <div>
      <header className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight text-white">
            <TerminalIcon className="h-6 w-6 text-brand-400" />
            Live-терминал
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Поток событий ядра: операции, аудит, статусы в реальном времени
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="input-base w-56 cursor-pointer py-2"
            value={auditTarget}
            onChange={(e) => setAuditTarget(e.target.value)}
            title="Отслеживать сводку аудита счёта"
          >
            <option value="">Аудит: выкл</option>
            {(accounts ?? []).map((a) => (
              <option key={a.id} value={a.id}>
                #{a.id} · {a.ownerName} ({moneyKZT(a.balance)})
              </option>
            ))}
          </select>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-3 py-1 text-[11px] font-semibold transition-all ${
              filter === f
                ? "border-brand-500/50 bg-brand-500/15 text-brand-300 shadow-glow-sm"
                : "border-white/10 bg-ink-900/60 text-slate-500 hover:text-slate-300"
            }`}
          >
            {f}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <button className="btn-ghost py-1.5 text-xs" onClick={() => setPaused((p) => !p)}>
            {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
            {paused ? "Продолжить" : "Пауза"}
          </button>
          <button className="btn-ghost py-1.5 text-xs" onClick={logs.clear}>
            <Trash2 className="h-3.5 w-3.5" />
            Очистить
          </button>
        </div>
      </div>

      <div className="glass mt-4 overflow-hidden rounded-2xl bg-ink-950 font-mono text-xs leading-relaxed shadow-panel">
        <div className="flex items-center gap-2 border-b border-white/5 bg-ink-900/80 px-4 py-2.5">
          <span className="h-3 w-3 rounded-full bg-rose-500/80" />
          <span className="h-3 w-3 rounded-full bg-amber-400/80" />
          <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
          <span className="ml-3 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
            bankcore :: core-log-stream
          </span>
          <span className="ml-auto flex items-center gap-1.5 text-[11px] text-slate-600">
            <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-brand-400" />
            {visible.length} строк · {new Date().toLocaleTimeString("ru-RU", { hour12: false })}
          </span>
        </div>

        <div
          ref={boxRef}
          onScroll={onScroll}
          className="terminal-scroll relative h-[480px] overflow-y-auto bg-ink-950 px-4 py-3"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-10 overflow-hidden">
            <div className="h-10 w-full animate-scan bg-gradient-to-b from-transparent via-brand-500/[0.06] to-transparent" />
          </div>

          {visible.map((l) => {
            const style = LEVEL_STYLE[l.level] ?? LEVEL_STYLE.INFO;
            return (
              <div key={l.id} className="animate-fade-in whitespace-pre-wrap px-1 py-[3px]">
                <span className="text-slate-600">#{String(l.seq).padStart(4, "0")}</span>
                <span className="mx-2 text-slate-500">{l.time}</span>
                <span className={`inline-block rounded px-1 font-bold ${style.chip}`}>
                  {l.level}
                </span>
                <span className="mx-2 text-teal-500/70">{l.source}›</span>
                <span className={style.text}>{l.text}</span>
              </div>
            );
          })}

          <div className="flex items-center gap-1 px-1 pt-1 text-brand-300">
            <Fingerprint className="h-3 w-3" />
            <span className="inline-block h-3.5 w-[7px] animate-caret bg-brand-400" />
          </div>
        </div>
      </div>
    </div>
  );
}