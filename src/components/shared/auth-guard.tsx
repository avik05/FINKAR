"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";

// Routes that logged-in users should be redirected away from
const AUTH_ROUTES = ["/login"];

// Routes that guest users should be redirected away from
const PROTECTED_ROUTES = ["/settings", "/goals"];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 1. If already logged in and on an auth route, send them to dashboard
    if (isLoggedIn && AUTH_ROUTES.includes(pathname)) {
      router.replace("/dashboard");
    }

    // 2. If NOT logged in and on a protected route, send them to login
    if (!isLoggedIn && PROTECTED_ROUTES.some(route => pathname === route || pathname?.startsWith(`${route}/`))) {
      router.replace("/login");
    }
  }, [isLoggedIn, pathname, router]);

  // Hide protected content while redirecting
  const isProtected = PROTECTED_ROUTES.some(route => pathname === route || pathname?.startsWith(`${route}/`));
  if (!isLoggedIn && isProtected) return null;

  // Hide login page while redirecting already-logged-in users
  if (isLoggedIn && AUTH_ROUTES.includes(pathname)) return null;

  return <>{children}</>;
}
