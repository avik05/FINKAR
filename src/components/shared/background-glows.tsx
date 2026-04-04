"use client";

import React from "react";
import { motion } from "framer-motion";

export function BackgroundGlows() {
  return (
    <>
      {/* Ambient Background Glows — visible in both light and dark */}
      <motion.div 
        animate={{ 
          x: [0, 600, -200, 0], 
          y: [0, -400, 200, 0],
          scale: [1, 1.5, 0.8, 1],
          opacity: [0.3, 0.6, 0.4, 0.3],
        }} 
        transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-200px] left-[-200px] w-[800px] h-[800px] rounded-full pointer-events-none ambient-blob z-0" 
        style={{ background: "radial-gradient(circle, rgba(0,255,156,0.2) 0%, transparent 75%)" }} 
      />
      <motion.div 
        animate={{ 
          x: [0, -400, 400, 0], 
          y: [0, 200, -400, 0],
          scale: [1, 0.7, 1.3, 1],
          opacity: [0.1, 0.3, 0.2, 0.1],
        }} 
        transition={{ duration: 55, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[-300px] right-[-300px] w-[1000px] h-[1000px] rounded-full pointer-events-none ambient-blob z-0" 
        style={{ background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 80%)" }} 
      />
    </>
  );
}
