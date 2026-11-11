"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { FacebookLink } from "@/components/shared/facebook-link";
import { MotionReveal } from "@/components/shared/motion-effects";
import { useMotionPreferences } from "@/components/shared/motion-provider";
import { Button } from "@/components/ui/button";

const colors = [
  { name: "Orange", value: "orange", swatch: "bg-primary" },
  { name: "White", value: "white", swatch: "bg-white" },
  { name: "Black", value: "black", swatch: "bg-foreground" },
] as const;

const steps = [
  { title: "Choose your product", description: "Find a piece or share your own idea." },
  { title: "Add your details", description: "Send the name, color, and reference images." },
  { title: "Message us on Facebook", description: "We'll discuss your order and customization." },
];

export function PersonalizationSection() {
  const { canAnimate } = useMotionPreferences();
  const [color, setColor] = useState<(typeof colors)[number]["value"]>("orange");

  return (
    <section id="customize" className="shop-section personal-section" aria-labelledby="personal-heading">
      <div className="shop-container wrap personal-layout">
        <div className="personal-head">
          <p className="section-label">02 / Made personal</p>
          <MotionReveal effect="unmask">
            <h2 id="personal-heading" className="shop-heading">
              Your name.{" "}<br />
              Your color.{" "}<br />
              <span>Your kind of thing.</span>
            </h2>
          </MotionReveal>
        </div>
        <div className="personal-body">
          <div className="color-preview">
            <span className="color-type" aria-hidden="true">MAKE<br />IT YOURS.</span>
            <div className="color-preview-image">
              <AnimatePresence initial={false}>
                <motion.div
                  key={color}
                  className="absolute inset-0"
                  initial={canAnimate ? { opacity: 0, x: 28, scale: 0.96 } : false}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: canAnimate ? -28 : 0 }}
                  transition={{ duration: canAnimate ? 0.32 : 0 }}
                >
                  <Image
                    src={`/images/organizer-${color}.webp`}
                    width={700}
                    height={457}
                    alt={`${color} robot organizer concept preview`}
                    sizes="(max-width: 767px) 100vw, 50vw"
                    className="h-full w-full object-contain"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="color-options" role="group" aria-label="Preview concept colors">
              {colors.map((option) => (
                <Button
                  key={option.value}
                  variant="swatch"
                  onClick={() => setColor(option.value)}
                  aria-pressed={color === option.value}
                >
                  <span className={`size-4 rounded-full border border-foreground/30 ${option.swatch}`} aria-hidden="true" />
                  {option.name}
                </Button>
              ))}
            </div>
          </div>
          <div className="personal-copy">
            <p>A name, a favorite color, or an idea of your own. Talk to us about making it personal.</p>
            <ol className="personal-steps">
              {steps.map((step, index) => (
                <li key={step.title}>
                  <MotionReveal delay={index * 0.06} className="personal-step">
                    <span className="step-number">0{index + 1}</span>
                    <div><h3>{step.title}</h3><p>{step.description}</p></div>
                  </MotionReveal>
                </li>
              ))}
            </ol>
            <FacebookLink variant="textLink" className="personal-contact" />
            <p className="color-note">Color previews are concepts. Ask us about actual options.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
