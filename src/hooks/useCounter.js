import { useEffect, useState } from "react";

export function useCounter(end, duration = 2000, go = false) {
  const [c, setC] = useState(0);
  useEffect(() => {
    if (!go) return;
    const n = parseInt(end.replace(/[^0-9]/g, ""), 10);
    if (Number.isNaN(n)) return;
    let s = 0;
    const inc = n / (duration / 16);
    const t = setInterval(() => {
      s += inc;
      if (s >= n) {
        setC(n);
        clearInterval(t);
      } else {
        setC(Math.floor(s));
      }
    }, 16);
    return () => clearInterval(t);
  }, [end, duration, go]);
  return c + end.replace(/[0-9]/g, "");
}
