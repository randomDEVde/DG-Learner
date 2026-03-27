import { useEffect, useState } from "react";

function detectStandalone() {
  return (
    window.matchMedia?.("(display-mode: standalone)")?.matches ||
    window.navigator.standalone === true
  );
}

function detectIos() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

export function usePwaInstall() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(() => detectStandalone());
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    setIsIos(detectIos());

    const onBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };

    const onAppInstalled = () => {
      setInstallPrompt(null);
      setIsInstalled(true);
    };

    const mediaQuery = window.matchMedia?.("(display-mode: standalone)");
    const onDisplayModeChange = (event) => {
      setIsInstalled(event.matches);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);
    mediaQuery?.addEventListener?.("change", onDisplayModeChange);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
      mediaQuery?.removeEventListener?.("change", onDisplayModeChange);
    };
  }, []);

  const install = async () => {
    if (!installPrompt) {
      return false;
    }

    await installPrompt.prompt();
    const result = await installPrompt.userChoice;
    if (result.outcome !== "accepted") {
      return false;
    }

    setInstallPrompt(null);
    setIsInstalled(true);
    return true;
  };

  return {
    canInstall: Boolean(installPrompt),
    install,
    isInstalled,
    isIos,
    showIosHint: isIos && !isInstalled && !installPrompt,
  };
}
