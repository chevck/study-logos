import { useCallback, useEffect, useState } from 'react';

let deferredInstallPrompt = null;

/**
 * Captures the Chromium `beforeinstallprompt` event so we can offer a native install.
 */
export function useInstallPrompt() {
  const [canNativeInstall, setCanNativeInstall] = useState(Boolean(deferredInstallPrompt));

  useEffect(() => {
    function onBeforeInstall(event) {
      event.preventDefault();
      deferredInstallPrompt = event;
      setCanNativeInstall(true);
    }

    function onInstalled() {
      deferredInstallPrompt = null;
      setCanNativeInstall(false);
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const promptNativeInstall = useCallback(async () => {
    if (!deferredInstallPrompt) return 'unavailable';
    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    setCanNativeInstall(false);
    return outcome;
  }, []);

  return { canNativeInstall, promptNativeInstall };
}
