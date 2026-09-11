import { Landmark, LayoutDashboard, ArrowLeftRight, ShieldCheck, TerminalSquare, Radio } from "lucide-react";
import { StatusPill } from "./ui";
import { useNow } from "../lib/hooks";

const NAV = [
  { id: "dashboard", label: "Счета", icon: LayoutDashboard },
  { id: "transfers", label: "Переводы", icon: ArrowLeftRight },
  { id: "admin", label: "Админ-панель", icon: ShieldCheck },
  { id: "terminal", label: "Live-терминал", icon: TerminalSquare },
];

export default function Layout({ active, onNav, apiOnline, children }) {
  const now = useNow(1000);

  return (
    <div className="flex min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-white/5 bg-ink-900/60 backdrop-blur-xl">
        <div className="flex items-center gap-3 px-5 py-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient shadow-glow-sm">
            <Landmark className="h-5 w-5 text-ink-950" />
          </div>
          <div>
            <p className="text-base font-black tracking-tight text-white">
              Bank<span className="text-gradient-brand">Core</span>
            </p>
            <p className="text-[10px] font-medium uppercase tracking-widest text-slate-500">
              Operations Terminal
            </p>
          </div>
        </div>

        <nav className="mt-2 flex-1 space-y-1 px-3">
          {NAV.map(({ id, label, icon: Icon }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                onClick={() => onNav(id)}
                className={`group relative flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-white/5 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-brand-gradient shadow-glow-sm" />
                )}
                <Icon
                  className={`h-[18px] w-[18px] transition-colors ${
                    isActive ? "text-brand-300" : "text-slate-500 group-hover:text-slate-300"
                  }`}
                />
                {label}
              </button>
            );
          })}
        </nav>

        <div className="space-y-4 px-5 py-6">
          <div className="glass rounded-xl p-3.5">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-slate-400">
                <Radio className="h-3.5 w-3.5 text-brand-400" />
                Ядро
              </span>
              <span className="tabular font-semibold text-slate-200">
                {now.toLocaleTimeString("ru-RU", { hour12: false })}
              </span>
            </div>
          </div>
          <StatusPill online={apiOnline} />
        </div>
      </aside>

      <main className="ml-60 flex-1 bg-radial-fade">
        <div className="mx-auto max-w-6xl px-8 py-8">{children}</div>
      </main>
    </div>
  );
}