import { useEffect, useState } from "react";

/**
 * Reliable in-view detection: observes the node once it is mounted.
 * Returns [setNode, inView] — pass setNode as ref (callback ref).
 */
export function useInView(th = 0.2) {
  const [node, setNode] = useState(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!node) return;
    const o = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setInView(true);
      },
      { threshold: th }
    );
    o.observe(node);
    return () => o.disconnect();
  }, [node, th]);

  return [setNode, inView];
}
