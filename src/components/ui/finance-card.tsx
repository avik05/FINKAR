import * as React from "react"
import { cn } from "@/lib/utils"
import { motion, HTMLMotionProps } from "framer-motion"

export interface FinanceCardProps extends HTMLMotionProps<"div"> {
  hoverEffect?: boolean;
}

export function FinanceCard({ className, hoverEffect = true, ...props }: FinanceCardProps) {
  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        "rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.2)] transition-all duration-500 ease-out gpu-accelerated no-select tap-highlight-none",
        hoverEffect && "hover:shadow-[0_8px_32px_rgba(0,255,156,0.1)] hover:-translate-y-1 hover:border-primary/30",
        className
      )}
      {...props}
    />
  )
}
