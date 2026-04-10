"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";

/**
 * CursorGlow — 'Emerald Silence' System (V11 - Synchronized)
 * 
 * Final Refinements:
 * 1. Synchronized Liquid Motion: Both the Dot and Ring now share the same 'smooth' 
 *    interpolated position. They stay perfectly locked together with the signature liquid lag.
 * 2. Ultra-Low Intensity Glow: Maintains the soothing emerald whisper for eye comfort.
 * 3. Interactive Grid: Background dots illuminate softly as the cursor passes.
 */
export function CursorGlow() {
  const [mounted, setMounted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  
  // Coordinate streams (using MotionValues for zero React re-renders)
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Performance Spring: The shared 'liquid' coordinate for both Dot and Ring
  const springConfig = { damping: 30, stiffness: 180, mass: 0.8 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Dynamic mask position for the grid reaction (linked to smooth position)
  const gridMask = useTransform(
    [smoothX, smoothY],
    ([x, y]) => `radial-gradient(400px circle at ${x}px ${y}px, black 0%, transparent 100%)`
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Desktop Guard: Only mount if hover is supported
    const isDesktop = window.matchMedia("(hover: hover)").matches;
    if (!isDesktop) return;

    setMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target as HTMLElement;
      if (target) {
        setIsHovering(!!target.closest('button, a, input, [role="button"]'));
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  if (!mounted) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[1000] overflow-hidden">
      {/* 1. SOOTHING EMERALD GLOW */}
      <motion.div
        className="absolute h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.04] blur-[100px]"
        style={{
          x: smoothX,
          y: smoothY,
          background: "radial-gradient(circle, rgba(0, 255, 156, 0.4) 0%, rgba(0, 199, 123, 0.1) 50%, transparent 80%)",
          scale: isHovering ? 1.2 : 1,
        }}
      />

      {/* 2. LIQUID RING (Synchronized) */}
      <motion.div
        className="absolute h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/20 bg-primary/[0.02]"
        style={{
          x: smoothX,
          y: smoothY,
          scale: isHovering ? 1.5 : 1,
        }}
      />

      {/* 3. LIQUID DOT (Synchronized - Now follows the Smooth position) */}
      <motion.div
        className="absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/80 shadow-[0_0_8px_rgba(0,255,156,0.3)]"
        style={{
          x: smoothX,
          y: smoothY,
        }}
      />

      {/* 4. GHOST GRID REACTION */}
      <motion.div 
        className="absolute inset-0 z-[-1]"
        style={{ 
          WebkitMaskImage: gridMask,
          maskImage: gridMask
        }}
      >
        <div 
          className="h-full w-full opacity-[0.15] dark:opacity-[0.08]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, var(--primary) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </motion.div>
    </div>
  );
}
