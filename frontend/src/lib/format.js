export function uniqId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID().slice(0, 8);
  }
  return Math.random().toString(36).slice(2, 10);
}

const pad = (n) => String(n).padStart(2, "0");

export function timeHHMMSS(d = new Date()) {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

const MONEY_FMT = new Intl.NumberFormat("ru-RU", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
});

export function money(n) {
  const v = Number(n ?? 0);
  if (Number.isNaN(v)) return "0.00";
  return MONEY_FMT.format(v);
}

export function moneyKZT(n) {
  const v = Number(n ?? 0);
  if (Number.isNaN(v)) return "₸ 0.00";
  if (Math.abs(v) >= 1_000_000) {
    return `₸ ${(v / 1_000_000).toFixed(2).replace(".", ",")}M`;
  }
  return `₸ ${MONEY_FMT.format(v)}`;
}

const ACCOUNT_TONES = {
  ACTIVE: { dot: "bg-emerald-400", text: "text-emerald-300", label: "Активен" },
  BLOCKED: { dot: "bg-rose-400", text: "text-rose-300", label: "Заблокирован" },
  CLOSED: { dot: "bg-slate-500", text: "text-slate-400", label: "Закрыт" },
};

export function toneFor(status, kind = "ACCOUNT") {
  if (kind === "TRANSACTION") return { dot: "bg-emerald-400", text: "text-emerald-300", label: status ?? "—" };
  return (
    ACCOUNT_TONES[status] ?? {
      dot: "bg-slate-500",
      text: "text-slate-400",
      label: status ?? "—",
    }
  );
}