import { useState, useEffect } from "react";

export function useAnimatedNumber(target, duration = 800) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (!target) { setCurrent(0); return; }
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setCurrent(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return current;
}

export function useLiveStats(api) {
  const [stats, setStats] = useState({ total_iocs: 0, member_count: 0, chain_id: "...", block_number: 0 });
  const [iocs,  setIocs]  = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const load = async () => {
    try {
      const s = await api.getStats();
      setStats(s);
      setLastUpdated(new Date());
      if (s.total_iocs > 0) {
        const count = Math.min(s.total_iocs, 10);
        const results = await Promise.all(
          Array.from({ length: count }, (_, i) => api.getIoC(s.total_iocs - i).catch(() => null))
        );
        setIocs(results.filter(Boolean));
      } else {
        setIocs([]);
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 10000);
    return () => clearInterval(t);
  }, []);

  return { stats, iocs, lastUpdated, refresh: load };
}
