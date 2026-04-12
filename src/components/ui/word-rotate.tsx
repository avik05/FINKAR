"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface WordRotateProps {
  words: string[];
  duration?: number;
  framerProps?: HTMLMotionProps<"span">;
  className?: string;
}

export default function WordRotate({
  words,
  duration = 2500,
  framerProps = {
    initial: { opacity: 0, y: 10, filter: "blur(4px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    exit: { opacity: 0, y: -10, filter: "blur(4px)" },
    transition: { duration: 0.3, ease: "easeOut" },
  },
  className,
}: WordRotateProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, duration);

    return () => clearInterval(interval);
  }, [words, duration]);

  return (
    <div className="inline-flex py-4 px-2 shrink-0 relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={words[index]}
          className={cn("flex whitespace-nowrap", className)}
        >
          {words[index].split("").map((char, i) => (
            <motion.span
              key={i}
              {...framerProps}
              transition={{
                ...framerProps.transition,
                delay: i * 0.03,
              }}
              className="inline-block"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
