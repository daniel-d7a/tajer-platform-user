"use client";
import { useEffect, useRef, useState } from "react";

export default function useOneTimeAnimation<
  T extends HTMLElement = HTMLElement
>(opts?: { threshold?: number }) {
  const ref = useRef<T | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || hasAnimated) return;

    let ticking = false;
    const threshold = opts?.threshold ?? 0.18;

    function handleScroll() {
      if (ticking || hasAnimated) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        if (!node) return;
        const rect = node.getBoundingClientRect();
        const windowHeight =
          window.innerHeight || document.documentElement.clientHeight;
        const visible =
          rect.top + rect.height * threshold < windowHeight && rect.bottom > 0;

        if (visible && !hasAnimated) {
          setInView(true);
          setHasAnimated(true);
        }
        ticking = false;
      });
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [opts?.threshold, hasAnimated]);

  return [ref, inView] as const;
}
