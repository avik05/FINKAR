"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
}

export const BrandLogo = ({ className }: BrandLogoProps) => {
  const [displayText, setDisplayText] = useState("kar");
  const [isHindi, setIsHindi] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const typingSpeed = isDeleting ? 100 : 200;
    const waitTime = 4000;

    const timeout = setTimeout(() => {
      if (!isDeleting && !isHindi && displayText === "kar") {
        setIsDeleting(true);
      } else if (!isDeleting && isHindi && displayText === "कर") {
        setIsDeleting(true);
      } else if (isDeleting && displayText === "") {
        setIsDeleting(false);
        setIsHindi(!isHindi);
      } else {
        const target = isHindi ? "कर" : "kar";
        if (isDeleting) {
          setDisplayText(prev => prev.slice(0, -1));
        } else {
          setDisplayText(target.slice(0, displayText.length + 1));
        }
      }
    }, (!isDeleting && (displayText === "kar" || displayText === "कर")) ? waitTime : typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, isHindi]);

  return (
    <div className={cn(
      "relative inline-block cursor-default select-none",
      className
    )}>
      <span className={cn(
        "bg-clip-text text-transparent bg-gradient-to-r",
        "from-foreground via-foreground/90 to-foreground",
        "dark:from-white dark:via-white/90 dark:to-white",
        "bg-[length:200%_100%] animate-shimmer"
      )}>
        Fin{displayText}.
      </span>
    </div>
  );
};
