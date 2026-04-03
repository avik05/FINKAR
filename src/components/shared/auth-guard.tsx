"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";

// Routes that logged-in users should be redirected away from
const AUTH_ROUTES = ["/login"];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If the user is already logged in and tries to visit /login, send them home
    if (isLoggedIn && AUTH_ROUTES.includes(pathname)) {
      router.replace("/");
    }
  }, [isLoggedIn, pathname, router]);

  // Hide login page while redirecting already-logged-in users
  if (isLoggedIn && AUTH_ROUTES.includes(pathname)) return null;

  return <>{children}</>;
}
