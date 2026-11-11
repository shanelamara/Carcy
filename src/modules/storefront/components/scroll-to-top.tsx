"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const update = () => setIsVisible(window.scrollY > 600);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <Button
      variant="inverse"
      size="icon"
      className="scroll-to-top"
      data-visible={isVisible}
      aria-hidden={!isVisible}
      tabIndex={isVisible ? undefined : -1}
      aria-label="Scroll to top"
      // Smoothness comes from the html scroll-behavior rule, which reduced motion turns off.
      onClick={() => window.scrollTo({ top: 0 })}
    >
      <ArrowUp className="size-5" aria-hidden="true" />
    </Button>
  );
}
