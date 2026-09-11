import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { uniqId, timeHHMMSS } from "./format";

const LogContext = createContext(null);
export const MAX_LOGS = 350;

export const LEVELS = {
  INFO: "INFO",
  SUCCESS: "SUCCESS",
  WARN: "WARN",
  ERROR: "ERROR",
  AUDIT: "AUDIT",
  SYS: "SYS",
};

export function LoggerProvider({ children }) {
  const [logs, setLogs] = useState([]);
  const seqRef = useRef(0);

  const push = useCallback((level, text, source = "core") => {
    seqRef.current += 1;
    const entry = {
      id: uniqId(),
      seq: seqRef.current,
      time: timeHHMMSS(new Date()),
      level,
      text,
      source,
    };
    setLogs((prev) =>
      prev.length >= MAX_LOGS ? [...prev.slice(1), entry] : [...prev, entry],
    );
    return entry;
  }, []);

  const info = useCallback((t, s) => push(LEVELS.INFO, t, s), [push]);
  const success = useCallback((t, s) => push(LEVELS.SUCCESS, t, s), [push]);
  const warn = useCallback((t, s) => push(LEVELS.WARN, t, s), [push]);
  const error = useCallback((t, s) => push(LEVELS.ERROR, t, s), [push]);
  const audit = useCallback((t, s) => push(LEVELS.AUDIT, t, s), [push]);
  const sys = useCallback((t, s) => push(LEVELS.SYS, t, s), [push]);
  const clear = useCallback(() => setLogs([]), []);

  const value = useMemo(
    () => ({ logs, push, info, success, warn, error, audit, sys, clear }),
    [logs, push, info, success, warn, error, audit, sys, clear],
  );

  return <LogContext.Provider value={value}>{children}</LogContext.Provider>;
}

export function useLogs() {
  const ctx = useContext(LogContext);
  if (!ctx) throw new Error("useLogs must be used inside <LoggerProvider>");
  return ctx;
}
