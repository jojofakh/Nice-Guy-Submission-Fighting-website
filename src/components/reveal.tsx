import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * How long to wait before showing the content regardless of the observer.
 * Scroll reveals must fail open: if IntersectionObserver callbacks never
 * arrive — an un-painted background tab, a prerender, a browser quirk — the
 * page would otherwise be permanently blank.
 */
const FAILSAFE_MS = 1200;

type RevealProps = {
  children: ReactNode;
  /** Stagger in ms, for revealing a list of siblings in sequence. */
  delay?: number;
  className?: string;
};

/**
 * Fades its children in the first time they scroll into view. The CSS in
 * globals.css disables the effect entirely under `prefers-reduced-motion` and
 * when scripting is unavailable, so there is no motion-preference branch to
 * maintain here.
 */
export function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const failsafe = setTimeout(() => setVisible(true), FAILSAFE_MS);

    // Older browsers and jsdom have no observer; the failsafe covers them.
    if (typeof IntersectionObserver === "undefined") {
      return () => clearTimeout(failsafe);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );

    observer.observe(node);

    return () => {
      clearTimeout(failsafe);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      data-visible={visible}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
