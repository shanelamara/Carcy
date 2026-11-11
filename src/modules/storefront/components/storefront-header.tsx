"use client";

import { motion, useScroll } from "framer-motion";
import { ArrowUpRight, Menu } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import logo from "@/assets/logos/logo.png";
import { MotionReveal } from "@/components/shared/motion-effects";
import { FacebookLink } from "@/components/shared/facebook-link";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FACEBOOK_URL } from "@/config/site";
import { useStorefrontMotion } from "./storefront-motion-provider";
import { storefrontLinks } from "../config/navigation";

export function StorefrontHeader() {
  const { canAnimate } = useStorefrontMotion();
  const { scrollYProgress } = useScroll();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = (event: MediaQueryListEvent) => { if (event.matches) setIsMenuOpen(false); };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);
  return (
    <header className="storefront-nav nav fixed inset-x-0 top-0 z-30 border-b border-border bg-background">
      <div className="shop-container wrap flex h-full items-center justify-between gap-6">
        <a className="skip-link" href="#shop">Skip to product gallery</a>
        <a href="#home" className="storefront-brand flex items-center gap-3 no-underline">
          <Image src={logo} alt="CarCy 3D Shop official logo" width={64} height={64} className="h-16 w-16 rounded-full object-cover" />
          <span className="brand-name">CarCy<small className="brand-category">3D Shop</small></span>
        </a>
        <nav aria-label="Main navigation" className="hidden items-center gap-8 text-base lg:flex">
          {storefrontLinks.map((link) => <a key={link.href} href={link.href} className="navigation-link">{link.label}</a>)}
        </nav>
        <div className="flex items-center gap-5 max-sm:gap-3.5">
          <FacebookLink className="nav-contact hidden sm:inline-flex" />
          <Dialog open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DialogTrigger render={<Button variant="outline" size="icon" className="mobile-menu-trigger lg:hidden" />} aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}><Menu className="size-6" /></DialogTrigger>
            <DialogContent className="mobile-navigation translate-none! lg:hidden" showCloseButton>
              <DialogTitle className="sr-only">Navigation</DialogTitle>
              <DialogDescription className="sr-only">Explore the shop or contact CarCy on Facebook.</DialogDescription>
              <nav aria-label="Mobile navigation"><MotionReveal effect="stagger" className="flex flex-col gap-6">
                {storefrontLinks.map((link, index) => <a key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between border-b border-border py-4 font-heading text-2xl leading-tight font-medium">{link.label}<span className="font-sans text-sm font-normal">0{index + 1}</span></a>)}
                <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 py-4 font-heading text-2xl">Contact on Facebook <ArrowUpRight className="size-5" aria-hidden="true" /></a>
              </MotionReveal></nav>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <motion.div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] origin-left bg-primary" style={{ scaleX: canAnimate ? scrollYProgress : 0 }} />
    </header>
  );
}
