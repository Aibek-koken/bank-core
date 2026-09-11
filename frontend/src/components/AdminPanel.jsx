import { useCallback, useEffect, useRef, useState } from "react";
import {
  ShieldCheck,
  Power,
  LockKeyhole,
  History,
  Loader2,
  FileSearch,
  Activity,
} from "lucide-react";
import { api } from "../lib/api";
import { moneyKZT } from "../lib/format";
import { useToast } from "./toast";
import { useLogs } from "../lib/logger";
import { useInterval } from "../lib/hooks";
import { MetricCard, Switch, Badge } from "./ui";

export default function AdminPanel({ accounts }) {
  const toast = useToast();
  const logs = useLogs();

  const [status, setStatus] = useState({ transferEnable: true, activeLocksCount: 0, totalLocksCreated: 0 });
  const [toggling, setToggling] = useState(false);
  const [auditAccount, setAuditAccount] = useState("");
  const [auditResult, setAuditResult] = useState("");
  const [auditLoading, setAuditLoading] = useState(false);

  const poll = useCallback(async () => {
    try {
      const res = await api.systemStatus();
      setStatus(res.data ?? {});
    } catch {
      /* ядро офлайн — тумблер остаётся */
    }
  }, []);

  useInterval(poll, 3000, { enabled: true, immediate: true });

  const prevEnableRef = useRef(status.transferEnable);

  useEffect(() => {
    if (!toggling && prevEnableRef.current !== status.transferEnable) {
      prevEnableRef.current = status.transferEnable;
      logs.sys(
        `СИСТЕМА backend ∷ transfer=${status.transferEnable ? "ENABLED" : "DISABLED"} · activeLocks=${status.activeLocksCount}`,
        "admin",
      );
    }
  });

  const toggle = async (enable) => {
    setToggling(true);
    try {
      const res = await api.toggleTransfers(enable);
      setStatus((s) => ({ ...s, transferEnable: enable }));
      toast[enable ? "success" : "warning"](
        enable ? "Переводы включены" : "Переводы отключены",
        res.message,
      );
      logs[enable ? "success" : "warn"](
        `FEATURE FLAG · transfers=${enable ? "ENABLED" : "DISABLED"} set by admin`,
        "admin",
      );
    } catch (e) {
      toast.error("Не удалось изменить флаг", e.message);
    } finally {
      setToggling(false);
    }
  };

  const runAudit = async (e) => {
    e.preventDefault();
    if (!auditAccount) return;
    setAuditLoading(true);
    setAuditResult("");
    try {
      const res = await api.auditSummary(auditAccount);
      setAuditResult(res.data ?? res.message);
      logs.audit(`AUDIT SUMMARY #${auditAccount} · ${res.data ?? res.message}`, "admin");
      toast.success("Сводка аудита получена", `Счёт #${auditAccount}`);
    } catch (err) {
      toast.error("Ошибка аудита", err.message);
      logs.error(`AUDIT #${auditAccount} failed · ${err.message}`, "admin");
    } finally {
      setAuditLoading(false);
    }
  };

  return (
    <div>
      <header className="mb-6">
        <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight text-white">
          <ShieldCheck className="h-6 w-6 text-brand-400" />
          Админ-панель
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Управление флагом переводов и мониторинг ядра в реальном времени
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="glass animate-fade-up rounded-2xl p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-gold-500/20 bg-gold-500/10 text-gold-300">
                  <Power className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Переводы</p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    Глобальный флаг на бэкенде (volatile)
                  </p>
                </div>
              </div>
              <div>
                <Switch
                  checked={status.transferEnable}
                  onChange={toggle}
                  disabled={toggling}
                  label="Переключатель переводов"
                />
                <p className="mt-1.5 text-right text-xs">
                  <Badge tone={status.transferEnable ? "brand" : "gold"}>
                    {status.transferEnable ? "Включены" : "Отключены"}
                  </Badge>
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/5 bg-ink-900/60 px-4 py-3 text-xs text-slate-500">
              <Activity className="h-3.5 w-3.5 text-brand-400" />
              <span className="tabular">
                transfers={String(status.transferEnable)}
              </span>
              <span className="text-slate-700">|</span>
              <span className="tabular">
                last-poll={new Date().toLocaleTimeString("ru-RU", { hour12: false })}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              icon={LockKeyhole}
              label="Активных локов"
              value={status.activeLocksCount}
              accent="sky"
              sub="ReentrantLock в памяти"
            />
            <MetricCard
              icon={History}
              label="Создано локов"
              value={status.totalLocksCreated}
              accent="violet"
              sub="с момента старта"
            />
          </div>
        </div>

        <div className="glass animate-fade-up rounded-2xl p-6" style={{ animationDelay: "80ms" }}>
          <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500">
            <FileSearch className="h-4 w-4 text-brand-400" />
            Консоль аудита
          </h3>
          <form onSubmit={runAudit} className="space-y-4">
            <div>
              <label className="label-base">Счёт для сводки</label>
              <select
                className="input-base cursor-pointer"
                value={auditAccount}
                onChange={(e) => setAuditAccount(e.target.value)}
              >
                <option value="">Выберите счёт...</option>
                {(accounts ?? []).map((a) => (
                  <option key={a.id} value={a.id}>
                    #{a.id} · {a.ownerName} ({moneyKZT(a.balance)})
                  </option>
                ))}
              </select>
            </div>
            <button className="btn-primary w-full" disabled={auditLoading || !auditAccount}>
              {auditLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Формирование сводки...
                </>
              ) : (
                <>
                  <FileSearch className="h-4 w-4" /> Сгенерировать сводку
                </>
              )}
            </button>
          </form>

          {auditResult && (
            <div className="animate-fade-in mt-5 rounded-xl border border-brand-500/20 bg-brand-500/5 p-4">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-brand-300">
                ASYNC RESULT
              </p>
              <p className="break-words font-mono text-xs leading-relaxed text-slate-300">
                {auditResult}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}