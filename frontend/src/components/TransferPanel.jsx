import { useMemo, useState } from "react";
import {
  ArrowLeftRight,
  ArrowDownUp,
  Loader2,
  ShieldAlert,
  Wallet,
  Send,
} from "lucide-react";
import { api } from "../lib/api";
import { moneyKZT } from "../lib/format";
import { useToast } from "./toast";
import { useLogs } from "../lib/logger";
import { Badge } from "./ui";

const option = (a) => ({
  value: String(a.id),
  label: `#${a.id} · ${a.ownerName} (${moneyKZT(a.balance)})`,
  account: a,
});

export default function TransferPanel({ accounts, transfersEnabled, defaultFrom = "", onDone }) {
  const toast = useToast();
  const logs = useLogs();

  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const options = useMemo(() => (accounts ?? []).map(option), [accounts]);
  const fromAccount = options.find((o) => o.value === from)?.account;
  const toAccount = options.find((o) => o.value === to)?.account;

  const amountNum = Number(amount);
  const isValidAmount = amount !== "" && !Number.isNaN(amountNum) && amountNum > 0;

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const validate = () => {
    const e = {};
    if (!from) e.from = "Выберите счёт отправителя";
    if (!to) e.to = "Выберите счёт получателя";
    if (from && to && from === to) e.to = "Отправитель и получатель не могут совпадать";
    if (!isValidAmount) e.amount = "Укажите сумму больше нуля";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await api.transfer({
        fromAccountId: Number(from),
        toAccountId: Number(to),
        amount: Math.round(amountNum * 100) / 100,
        description: description.trim() || null,
      });
      const tx = res.data;
      toast.success("Перевод выполнен", res.message);
      logs.success(
        `TX#${tx.id} COMPLETED · ${moneyKZT(tx.amount)} · #${tx.from} → #${tx.to}`,
        "transfer",
      );
      setAmount("");
      setDescription("");
      onDone?.();
    } catch (err) {
      toast.error("Перевод не выполнен", err.message);
      logs.error(`TX FAILED · ${err.message}`, "transfer");
    } finally {
      setSubmitting(false);
    }
  };

  const fromBalanceOk = fromAccount && isValidAmount
    ? Number(fromAccount.balance) >= amountNum
    : true;

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-black tracking-tight text-white">Переводы</h1>
        <p className="mt-1 text-sm text-slate-400">
          Перевод средств между счетами с блокировкой и асинхронным аудитом
        </p>
      </header>

      {!transfersEnabled && (
        <div className="mb-6 flex animate-fade-in items-center gap-3 rounded-xl border border-gold-500/30 bg-gold-500/10 px-4 py-3 text-sm text-gold-300">
          <ShieldAlert className="h-5 w-5 shrink-0" />
          Переводы временно отключены администратором. Форма заблокирована.
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <form
          onSubmit={submit}
          className="glass rounded-2xl p-6 lg:col-span-3"
        >
          <div className="space-y-5">
            <div className="relative">
              <label className="label-base">Откуда (отправитель)</label>
              <select
                className="input-base cursor-pointer appearance-none pr-10"
                value={from}
                onChange={(e) => {
                  setFrom(e.target.value);
                  setErrors((p) => ({ ...p, from: undefined }));
                }}
              >
                <option value="">Выберите счёт...</option>
                {options.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ArrowDownUp
                className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 text-slate-500"
              />
              {errors.from && <p className="mt-1 text-xs text-rose-400">{errors.from}</p>}
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={swap}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-ink-900 text-slate-400 transition-all duration-200 hover:rotate-180 hover:border-brand-500/50 hover:text-brand-300"
                title="Поменять местами"
              >
                <ArrowLeftRight className="h-4 w-4" />
              </button>
            </div>

            <div>
              <label className="label-base">Куда (получатель)</label>
              <select
                className="input-base cursor-pointer appearance-none pr-10"
                value={to}
                onChange={(e) => {
                  setTo(e.target.value);
                  setErrors((p) => ({ ...p, to: undefined }));
                }}
              >
                <option value="">Выберите счёт...</option>
                {options.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              {errors.to && <p className="mt-1 text-xs text-rose-400">{errors.to}</p>}
            </div>

            <div>
              <label className="label-base">Сумма (₸)</label>
              <input
                className="input-base tabular text-lg font-bold"
                placeholder="0.00"
                inputMode="decimal"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value.replace(/[^\d.]/g, ""));
                  setErrors((p) => ({ ...p, amount: undefined }));
                }}
              />
              {errors.amount && <p className="mt-1 text-xs text-rose-400">{errors.amount}</p>}
              {fromAccount && isValidAmount && !fromBalanceOk && (
                <p className="mt-1 text-xs text-gold-400">
                  На счёте недостаточно средств ({moneyKZT(fromAccount.balance)})
                </p>
              )}
            </div>

            <div>
              <label className="label-base">Комментарий (необязательно)</label>
              <input
                className="input-base"
                placeholder="Назначение платежа"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={120}
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-3 text-base"
              disabled={submitting || !transfersEnabled}
            >
              {submitting ? (
                <> <Loader2 className="h-5 w-5 animate-spin" /> Перевод выполняется...</>
              ) : (
                <> <Send className="h-4 w-4" /> Выполнить перевод </>
              )}
            </button>
          </div>
        </form>

        <div className="lg:col-span-2">
          <div className="glass rounded-2xl p-6 lg:sticky lg:top-8">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500">
              <Wallet className="h-4 w-4 text-brand-400" />
              Сводка операции
            </h3>

            <div className="space-y-4">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Отправитель
                </p>
                <div className="rounded-xl border border-white/5 bg-ink-900/60 px-4 py-3">
                  {fromAccount ? (
                    <>
                      <p className="text-sm font-semibold text-white">{fromAccount.ownerName}</p>
                      <p className="mt-0.5 font-mono text-xs text-slate-500">{fromAccount.accountnumber}</p>
                      <p className="tabular mt-1 text-xs text-slate-400">
                        Баланс: <span className="text-brand-300">{moneyKZT(fromAccount.balance)}</span>
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-slate-500">Не выбран</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-center">
                <ArrowDownUp className="h-5 w-5 rounded-full border border-white/10 bg-ink-900 p-1 text-brand-400" />
              </div>

              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Получатель
                </p>
                <div className="rounded-xl border border-white/5 bg-ink-900/60 px-4 py-3">
                  {toAccount ? (
                    <>
                      <p className="text-sm font-semibold text-white">{toAccount.ownerName}</p>
                      <p className="mt-0.5 font-mono text-xs text-slate-500">{toAccount.accountnumber}</p>
                    </>
                  ) : (
                    <p className="text-sm text-slate-500">Не выбран</p>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-brand-500/20 bg-brand-500/5 px-4 py-3.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Сумма перевода</span>
                  <span className="tabular text-lg font-black text-gradient-brand">
                    {isValidAmount ? moneyKZT(amountNum) : "—"}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-white/5 pt-2 text-xs">
                  <span className="text-slate-500">Комиссия</span>
                  <span className="tabular text-slate-400">₸ 0.00</span>
                </div>
                <div className="mt-1 flex items-center justify-between border-t border-white/5 pt-2 text-xs">
                  <span className="text-slate-500">Итого к списанию</span>
                  <span className="tabular font-semibold text-slate-300">
                    {isValidAmount ? moneyKZT(amountNum) : "—"}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <Badge tone="slate">TRANSFER</Badge>
                <Badge tone={transfersEnabled ? "brand" : "gold"}>
                  {transfersEnabled ? "Переводы включены" : "Переводы отключены"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}