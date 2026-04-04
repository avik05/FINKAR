"use client";

import { useEffect, useState } from "react";

export function CursorGlow() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Check if hovering over an interactive element
      const target = e.target as HTMLElement;
      const isInteractive = target.closest('button, a, input, select, [role="button"]');
      setIsHovering(!!isInteractive);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      {/* Large ambient glow that follows the cursor */}
      <div
        className="pointer-events-none fixed top-0 left-0 z-0 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px] transition-opacity duration-500"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) translate(-50%, -50%)`,
          opacity: isHovering ? 0.7 : 0.35,
          background: "radial-gradient(circle, rgba(0,199,123,0.25) 0%, transparent 70%)",
        }}
      />
      {/* Small cursor dot/ring */}
      <div
        className="pointer-events-none fixed top-0 left-0 z-50 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary/50 bg-primary/15 transition-all duration-200 ease-out hidden md:block"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) translate(-50%, -50%) scale(${isHovering ? 1.6 : 1})`,
        }}
      />
    </>
  );
}
