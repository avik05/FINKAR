"use client";

import React from "react";

export function BackgroundGlows() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* 
        ELITE PERFORMANCE STATIC GLOWS
        - ZERO CPU/GPU OVERHEAD (No Framer Motion/Animation)
        - STATIC radial gradients for depth
        - MULTIPLE blobs for "layered" luxury feel
      */}
      
      {/* Top Left - Primary Mint */}
      <div 
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full opacity-[0.05]" 
        style={{ 
          background: "radial-gradient(circle at center, rgba(0,255,156,0.8) 0%, transparent 70%)",
          filter: "blur(120px)",
        }} 
      />

      {/* Middle Right - Subtle Blue/Teal */}
      <div 
        className="absolute top-[20%] right-[-15%] w-[60vw] h-[60vw] rounded-full opacity-[0.03]" 
        style={{ 
          background: "radial-gradient(circle at center, rgba(0,180,216,0.6) 0%, transparent 70%)",
          filter: "blur(140px)",
        }} 
      />

      {/* Bottom Left - Deep Shadow Glow */}
      <div 
        className="absolute bottom-[-15%] left-[10%] w-[45vw] h-[45vw] rounded-full opacity-[0.04]" 
        style={{ 
          background: "radial-gradient(circle at center, rgba(0,255,156,0.4) 0%, transparent 70%)",
          filter: "blur(100px)",
        }} 
      />
    </div>
  );
}
