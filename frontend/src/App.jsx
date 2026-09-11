import { useCallback, useEffect, useRef, useState } from "react";
import Layout from "./components/Layout";
import AccountsPanel from "./components/AccountsPanel";
import TransferPanel from "./components/TransferPanel";
import AdminPanel from "./components/AdminPanel";
import Terminal from "./components/Terminal";
import { api } from "./lib/api";
import { useToast } from "./components/toast";
import { useLogs } from "./lib/logger";
import { useInterval } from "./lib/hooks";

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [accounts, setAccounts] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [apiOnline, setApiOnline] = useState(true);
  const [transfersEnabled, setTransfersEnabled] = useState(true);
  const [prefilledSender, setPrefilledSender] = useState("");
  const toast = useToast();
  const logs = useLogs();
  const busyRef = useRef(false);

  const loadAccounts = useCallback(
    async (silent = false) => {
      if (busyRef.current) return;
      busyRef.current = true;
      try {
        const res = await api.listAccounts();
        setAccounts(res.data ?? []);
        setApiOnline(true);
      } catch (e) {
        setApiOnline(false);
        if (!silent) toast.error("Ядро недоступно", e.message);
      } finally {
        busyRef.current = false;
      }
    },
    [toast],
  );

  useEffect(() => {
    loadAccounts(true);
  }, [refreshKey, loadAccounts]);

  const pollStatus = useCallback(async () => {
    try {
      const res = await api.systemStatus();
      setApiOnline(true);
      setTransfersEnabled(res.data?.transferEnable ?? true);
    } catch {
      setApiOnline(false);
    }
  }, []);

  useInterval(pollStatus, 3000, { enabled: true, immediate: true });

  const openTransfers = (account) => {
    setPrefilledSender(account ? String(account.id) : "");
    setTab("transfers");
    if (account) logs.info(`переводы открыты · отправитель #${account.id}`, "UI");
  };

  return (
    <Layout active={tab} onNav={setTab} apiOnline={apiOnline}>
      <div className="animate-fade-in">
        {tab === "dashboard" && (
          <AccountsPanel
            onTransfer={openTransfers}
            refreshSignal={refreshKey}
          />
        )}
        {tab === "transfers" && (
          <TransferPanel
            accounts={accounts}
            defaultFrom={prefilledSender}
            transfersEnabled={transfersEnabled}
            onDone={() => setRefreshKey((k) => k + 1)}
          />
        )}
        {tab === "admin" && <AdminPanel accounts={accounts} />}
        {tab === "terminal" && <Terminal accounts={accounts} />}
      </div>
    </Layout>
  );
}