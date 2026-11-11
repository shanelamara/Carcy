"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useMotionPreferences } from "./motion-provider";
import { buttonVariants } from "@/components/ui/button";
import { FACEBOOK_URL } from "@/config/site";
import { cn } from "@/lib/utils";

type FacebookLinkProps = { className?: string; variant?: "default" | "inverse" | "textLink" };

export function FacebookLink({ className, variant = "default" }: FacebookLinkProps) {
  const { canAnimate } = useMotionPreferences();
  return (
    <motion.a whileHover={canAnimate ? { y: -1 } : undefined} whileTap={canAnimate ? { scale: 0.985 } : undefined} transition={{ duration: 0.15 }} href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({ variant }), className)}>
      Contact on Facebook <ArrowUpRight aria-hidden="true" className="size-4" />
    </motion.a>
  );
}
