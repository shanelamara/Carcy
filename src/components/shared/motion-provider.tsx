"use client";

import { MotionConfig } from "framer-motion";
import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";

const MotionContext = createContext<{ canAnimate: boolean } | null>(null);
const subscribeVisibility = (notify: () => void) => {
  document.addEventListener("visibilitychange", notify);
  return () => document.removeEventListener("visibilitychange", notify);
};
const getVisibility = () => document.visibilityState === "visible";
const getServerVisibility = () => false;
const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
const subscribeReducedMotion = (notify: () => void) => {
  const media = window.matchMedia(reducedMotionQuery);
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
};
const getReducedMotion = () => window.matchMedia(reducedMotionQuery).matches;

export function MotionProvider({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, getServerVisibility);
  const isVisible = useSyncExternalStore(subscribeVisibility, getVisibility, getServerVisibility);
  const canAnimate = isVisible && !prefersReducedMotion;

  return (
    <MotionContext value={{ canAnimate }}>
      <MotionConfig reducedMotion={prefersReducedMotion ? "always" : "never"} transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}>
        <div className="storefront" data-motion-paused={!canAnimate}>{children}</div>
      </MotionConfig>
    </MotionContext>
  );
}

export function useMotionPreferences() {
  const context = useContext(MotionContext);
  if (!context) throw new Error("Motion preferences require MotionProvider.");
  return context;
}
