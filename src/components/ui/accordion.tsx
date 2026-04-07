"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionProps {
  items: {
    title: string;
    content: React.ReactNode;
  }[];
  className?: string;
}

export function Accordion({ items, className }: AccordionProps) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  return (
    <div className={cn("space-y-4", className)}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div 
            key={index} 
            className={cn(
              "rounded-2xl border border-border/40 bg-card/40 backdrop-blur-md overflow-hidden transition-all duration-500",
              isOpen ? "ring-1 ring-primary/20 bg-card/60 shadow-[0_8px_32px_rgba(0,255,156,0.05)]" : "hover:border-primary/20"
            )}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full flex items-center justify-between p-6 text-left focus:outline-none group"
            >
              <span className={cn(
                "text-sm font-semibold tracking-wide transition-colors duration-300",
                isOpen ? "text-primary" : "text-foreground group-hover:text-primary/80"
              )}>
                {item.title}
              </span>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={cn(
                  "p-1 rounded-full bg-foreground/5",
                  isOpen ? "text-primary bg-primary/10" : "text-muted-foreground"
                )}
              >
                <ChevronDown size={16} />
              </motion.div>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                >
                  <div className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed">
                    <div className="pt-2 border-t border-border/20">
                      {item.content}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
