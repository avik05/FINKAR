"use client";

import { useState, useEffect } from "react";

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed (standalone mode)
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    const handler = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      setIsInstallable(true);
      console.log("[PWA] Captured beforeinstallprompt event");
    };

    window.addEventListener("beforeinstallprompt", handler);

    window.addEventListener("appinstalled", () => {
      setDeferredPrompt(null);
      setIsInstallable(false);
      setIsInstalled(true);
      console.log("[PWA] App successfully installed");
    });

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;

    console.log("[PWA] Prompting user for installation");
    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;
    console.log(`[PWA] User choice outcome: ${outcome}`);

    // We used the prompt, clear it
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  return { isInstallable, isInstalled, installApp };
}
