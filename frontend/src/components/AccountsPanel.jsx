import { useCallback, useEffect, useMemo, useState } from "react";
import { Wallet, Plus, RefreshCw, Users, TrendingUp, Loader2 } from "lucide-react";
import { api } from "../lib/api";
import { moneyKZT, toneFor } from "../lib/format";
import { useToast } from "./toast";
import { useLogs } from "../lib/logger";
import { Modal } from "./ui";
import { MetricCard, Badge } from "./ui";
import { CreateAccountForm } from "./CreateAccountForm";

function AccountCard({ account, onTransfer }) {
  const tone = toneFor(account.status, "ACCOUNT");
  return (
    <div className="glass group animate-fade-up overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-500/30 hover:shadow-glow">
      <div className="relative h-24 bg-carbon px-5 pt-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
              Счёт № {account.id}
            </p>
            <p className="mt-1 font-mono text-xs tracking-wider text-slate-400">
              {account.accountnumber}
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-ink-950/60 px-2.5 py-1 text-[11px] font-semibold ${tone.text}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
            {tone.label}
          </span>
        </div>
        <span className="pointer-events-none absolute inset-0 bg-brand-gradient opacity-[0.12] transition-opacity duration-300 group-hover:opacity-[0.2]" />
      </div>

      <div className="relative px-5 pb-5 pt-4">
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 text-brand-400" />
          <p className="text-sm font-medium text-slate-300">{account.ownerName}</p>
        </div>
        <p className="tabular mt-3 text-3xl font-black tracking-tight text-white">
          {moneyKZT(account.balance)}
        </p>

        <button
          onClick={() => onTransfer(account)}
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-300 transition-colors hover:text-brand-200"
        >
          Отправить перевод
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

const METRICS = {
  total: { label: "Суммарный баланс", icon: TrendingUp, accent: "brand", key: "total" },
  count: { label: "Активных счетов", icon: Users, accent: "sky", key: "count" },
  avg: { label: "Средний баланс", icon: Wallet, accent: "gold", key: "avg" },
};

export default function AccountsPanel({ onTransfer, refreshSignal }) {
  const toast = useToast();
  const logs = useLogs();
  const [accounts, setAccounts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);

  const load = useCallback(
    async (signal) => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.listAccounts();
        setAccounts(res.data ?? []);
        return res.data ?? [];
      } catch (e) {
        setError(e.message);
        toast.error("Не удалось загрузить счета", e.message);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  useEffect(() => {
    load();
  }, [load, refreshSignal]);

  const summary = useMemo(() => {
    if (!accounts) return { total: "—", count: "—", avg: "—" };
    const total = accounts.reduce((s, a) => s + Number(a.balance || 0), 0);
    const active = accounts.length;
    const avg = active ? total / active : 0;
    return { total: moneyKZT(total), count: active, avg: moneyKZT(avg) };
  }, [accounts]);

  const handleCreated = (account) => {
    setCreateOpen(false);
    setAccounts((prev) => [account, ...(prev ?? [])]);
    logs.success(`Счёт #${account.id} создан на балансе ${moneyKZT(account.balance)}`, "UI");
  };

  return (
    <div>
      <header className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">Счета</h1>
          <p className="mt-1 text-sm text-slate-400">
            Мониторинг банковских счетов и балансов
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-ghost" onClick={() => load()} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Обновить
          </button>
          <button className="btn-primary" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            Создать счёт
          </button>
        </div>
      </header>

      {error && (
        <div className="mb-5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          {error}
        </div>
      )}

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Object.entries(METRICS).map(([key, m], i) => (
          <div key={key} className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
            <MetricCard icon={m.icon} label={m.label} value={summary[key]} accent={m.accent} />
          </div>
        ))}
      </div>

      {loading && !accounts ? (
        <div className="flex items-center justify-center gap-3 py-24 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin text-brand-400" />
          Загрузка счетов...
        </div>
      ) : !accounts || accounts.length === 0 ? (
        <div className="glass flex flex-col items-center gap-3 rounded-2xl py-20 text-center">
          <Wallet className="h-10 w-10 text-slate-600" />
          <p className="text-sm font-medium text-slate-400">Счетов пока нет</p>
          <button className="btn-primary mt-2" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            Создать первый счёт
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {accounts.map((a, i) => (
            <div key={a.id} style={{ animationDelay: `${i * 40}ms` }}>
              <AccountCard account={a} onTransfer={onTransfer} />
            </div>
          ))}
        </div>
      )}

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Создать счёт"
        subtitle="Новый банковский счёт будет создан в статусе ACTIVE"
      >
        <CreateAccountForm onCreated={handleCreated} onCancel={() => setCreateOpen(false)} />
      </Modal>
    </div>
  );
}