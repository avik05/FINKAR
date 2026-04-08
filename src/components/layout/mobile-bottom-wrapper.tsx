"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { BottomNav } from "./bottom-nav";

const HIDE_ROUTES = ["/login", "/auth/verify"];

export function MobileBottomWrapper() {
  const pathname = usePathname();
  
  if (HIDE_ROUTES.includes(pathname)) return null;

  return (
    <div className="md:hidden">
      <BottomNav />
    </div>
  );
}
