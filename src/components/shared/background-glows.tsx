"use client";

import React from "react";
import { motion } from "framer-motion";

export function BackgroundGlows() {
  return (
    <>
      {/* Ambient Background Glows — optimized for performance */}
      <motion.div 
        animate={{ 
          x: [0, 400, -100, 0], 
          y: [0, -200, 100, 0],
          scale: [1, 1.2, 0.9, 1],
          opacity: [0.1, 0.25, 0.15, 0.1],
        }} 
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full pointer-events-none z-0 blur-[80px]" 
        style={{ background: "radial-gradient(circle, rgba(0,255,156,0.15) 0%, transparent 70%)" }} 
      />
      <motion.div 
        animate={{ 
          x: [0, -300, 300, 0], 
          y: [0, 100, -200, 0],
          scale: [1, 0.8, 1.1, 1],
          opacity: [0.05, 0.15, 0.1, 0.05],
        }} 
        transition={{ duration: 45, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[-15%] right-[-10%] w-[70vw] h-[70vw] rounded-full pointer-events-none z-0 blur-[100px]" 
        style={{ background: "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 75%)" }} 
      />
    </>
  );
}
