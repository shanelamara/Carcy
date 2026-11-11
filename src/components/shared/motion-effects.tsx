"use client";

import { motion, stagger, useAnimate, useInView, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";
import { useMotionPreferences } from "./motion-provider";

type MotionContentProps = { children: ReactNode; className?: string };

// Server output stays visible; entrances only start after hydration and intersection.
export function MotionReveal({ children, className, delay = 0, effect = "rise" }: MotionContentProps & { delay?: number; effect?: "rise" | "unmask" | "stagger" }) {
  const [scope, animateContent] = useAnimate<HTMLDivElement>();
  const isInView = useInView(scope, { once: true, amount: 0.12 });
  const hasPlayed = useRef(false);
  const { canAnimate } = useMotionPreferences();

  useEffect(() => {
    if (!canAnimate || !isInView || hasPlayed.current) return;
    hasPlayed.current = true;
    const target = effect === "stagger" && scope.current.children.length ? Array.from(scope.current.children) : scope.current;
    const controls = animateContent(target,
      effect === "unmask"
        ? { clipPath: ["inset(0 0 100% 0)", "inset(0 0 0% 0)"], y: [24, 0] }
        : { opacity: [0.2, 1], y: [effect === "stagger" ? 32 : 44, 0] },
      { duration: effect === "unmask" ? 0.8 : 0.65, delay: effect === "stagger" ? stagger(0.09, { startDelay: delay }) : delay, ease: [0.16, 1, 0.3, 1] });
    return () => {
      controls.stop();
      // Interruption must never leave readable content cropped or translucent.
      const elements = Array.isArray(target) ? target : [target];
      for (const element of elements) {
        if (element instanceof HTMLElement) {
          element.style.opacity = "1";
          element.style.transform = "none";
          element.style.clipPath = "none";
        }
      }
    };
  }, [animateContent, canAnimate, delay, effect, isInView, scope]);

  return <div ref={scope} className={className}>{children}</div>;
}

export function MotionParallax({ children, className, distance = 50 }: MotionContentProps & { distance?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { canAnimate } = useMotionPreferences();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  return <motion.div ref={ref} className={className} style={{ y: canAnimate ? y : 0 }}>{children}</motion.div>;
}
