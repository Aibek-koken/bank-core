import { useEffect, useRef, useState } from "react";

export function useInterval(fn, delay, { enabled = true, immediate = false } = {}) {
  const fnRef = useRef(fn);

  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  useEffect(() => {
    if (!enabled || delay == null) return;
    if (immediate) fnRef.current();
    const id = setInterval(() => fnRef.current(), delay);
    return () => clearInterval(id);
  }, [delay, enabled, immediate]);
}

export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => new Date());
  useInterval(() => setNow(new Date()), intervalMs);
  return now;
}