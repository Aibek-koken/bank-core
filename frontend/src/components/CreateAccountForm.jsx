import { useState } from "react";
import { Loader2, UserRoundPlus } from "lucide-react";
import { api } from "../lib/api";
import { useToast } from "./toast";
import { moneyKZT } from "../lib/format";

export function CreateAccountForm({ onCreated, onCancel }) {
  const toast = useToast();
  const [ownerName, setOwnerName] = useState("");
  const [balance, setBalance] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [fieldError, setFieldError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setFieldError("");

    if (!ownerName.trim()) {
      setFieldError("Укажите имя владельца счёта");
      return;
    }
    const amount = Number(balance);
    if (balance === "" || Number.isNaN(amount) || amount < 0) {
      setFieldError("Начальный баланс должен быть неотрицательным числом");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.createAccount({
        ownerName: ownerName.trim(),
        initialBalance: Math.round(amount * 100) / 100,
      });
      toast.success("Счёт создан", res.message);
      onCreated?.(res.data);
      setOwnerName("");
      setBalance("");
    } catch (e) {
      toast.error("Ошибка создания счёта", e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      {fieldError && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-sm text-rose-300">
          {fieldError}
        </div>
      )}

      <div>
        <label className="label-base" htmlFor="ownerName">
          Владелец счёта
        </label>
        <input
          id="ownerName"
          className="input-base"
          placeholder="Например: Айбек Касенов"
          value={ownerName}
          onChange={(e) => setOwnerName(e.target.value)}
          autoFocus
          maxLength={80}
        />
      </div>

      <div>
        <label className="label-base" htmlFor="balance">
          Начальный баланс (₸)
        </label>
        <input
          id="balance"
          className="input-base tabular"
          placeholder="0.00"
          inputMode="decimal"
          value={balance}
          onChange={(e) => setBalance(e.target.value.replace(/[^\d.]/g, ""))}
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button type="button" className="btn-ghost" onClick={onCancel} disabled={submitting}>
          Отмена
        </button>
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <UserRoundPlus className="h-4 w-4" />
          )}
          {submitting ? "Создание..." : "Создать счёт"}
        </button>
      </div>

      {balance !== "" && !Number.isNaN(Number(balance)) && Number(balance) >= 0 && (
        <p className="text-right text-xs text-slate-500">
          Будет зачислено:{" "}
          <span className="font-semibold text-brand-300">{moneyKZT(balance)}</span>
        </p>
      )}
    </form>
  );
}