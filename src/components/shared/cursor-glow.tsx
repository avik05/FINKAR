"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export function CursorGlow() {
  const [isHovering, setIsHovering] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth springs for the cursor
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  // Velocity tracking for scale
  const [velocity, setVelocity] = useState(0);
  const lastPos = useRef({ x: 0, y: 0, time: Date.now() });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      mouseX.set(clientX);
      mouseY.set(clientY);
      
      // Calculate velocity
      const now = Date.now();
      const dt = now - lastPos.current.time;
      const dx = clientX - lastPos.current.x;
      const dy = clientY - lastPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const v = dt > 0 ? dist / dt : 0;
      
      setVelocity(prev => Math.min(v * 2, 8)); // Cap velocity multiplier
      
      lastPos.current = { x: clientX, y: clientY, time: now };
      
      // Check if hovering over an interactive element
      const target = e.target as HTMLElement;
      const isInteractive = target.closest('button, a, input, select, [role="button"]');
      setIsHovering(!!isInteractive);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <>
      {/* 1. Magnetic Background Grid (Subtle) */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-[0.25] dark:opacity-[0.1]">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)",
            backgroundSize: "40px 40px",
            color: "var(--primary)",
          }}
        />
      </div>

      {/* 2. Large Interactive Ambient Glow */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px] transition-opacity duration-1000"
        style={{
          x: cursorX,
          y: cursorY,
          opacity: isHovering ? 0.35 : 0.2,
          background: "radial-gradient(circle, rgba(0,255,156,0.15) 0%, rgba(0,199,123,0.05) 40%, transparent 70%)",
        }}
      />

      {/* 3. Outer Cursor Ring (Kinetic) */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-50 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/40 bg-primary/5 hidden md:block"
        style={{
          x: cursorX,
          y: cursorY,
          scale: (isHovering ? 2 : 1) + (velocity * 0.1),
          rotate: velocity * 5,
        }}
      />

      {/* 4. Center Dot (Precise) */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-50 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary hidden md:block"
        style={{
          x: cursorX,
          y: cursorY,
        }}
      />
    </>
  );
}
