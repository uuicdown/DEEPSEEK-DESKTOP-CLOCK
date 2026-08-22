/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Helper interface for Tauri Window API
interface TauriWindow {
  setFullscreen: (fullscreen: boolean) => Promise<void>;
  setSize: (size: { width: number; height: number; type?: string }) => Promise<void>;
  setAlwaysOnTop: (alwaysOnTop: boolean) => Promise<void>;
  setResizable: (resizable: boolean) => Promise<void>;
  setPosition?: (pos: { x: number; y: number }) => Promise<void>;
  center: () => Promise<void>;
  minimize: () => Promise<void>;
  maximize?: () => Promise<void>;
  unmaximize?: () => Promise<void>;
  toggleMaximize?: () => Promise<void>;
  isMaximized?: () => Promise<boolean>;
  close: () => Promise<void>;
  startDragging?: () => Promise<void>;
  listen: (event: string, handler: (e: unknown) => void) => Promise<() => void>;
}

declare global {
  interface Window {
    __TAURI__?: {
      window?: {
        appWindow?: TauriWindow;
        getCurrentWindow?: () => TauriWindow;
        LogicalSize?: new (w: number, h: number) => { width: number; height: number };
      };
      event?: {
        listen: (event: string, handler: (e: unknown) => void) => Promise<() => void>;
      };
      process?: {
        exit: (code?: number) => Promise<void>;
      };
    };
    __TAURI_INTERNALS__?: unknown;
    documentPictureInPicture?: {
      requestWindow: (options?: { width?: number; height?: number }) => Promise<Window>;
    };
  }
}

/** Check if running inside Tauri desktop environment */
export function isTauriEnv(): boolean {
  return typeof window !== 'undefined' && Boolean(window.__TAURI__ || window.__TAURI_INTERNALS__);
}

/** Get Tauri current window handle safely */
export function getTauriWindow(): TauriWindow | null {
  if (typeof window === 'undefined' || !window.__TAURI__) return null;
  const tw = window.__TAURI__.window;
  if (!tw) return null;
  if (tw.getCurrentWindow) return tw.getCurrentWindow();
  if (tw.appWindow) return tw.appWindow;
  return null;
}

/** Request true immersive fullscreen */
export async function requestTrueFullscreen(): Promise<void> {
  // 1. Tauri desktop API
  const appWin = getTauriWindow();
  if (appWin) {
    try {
      await appWin.setFullscreen(true);
    } catch {
      // ignore
    }
  }

  // 2. Web Fullscreen API
  if (typeof document !== 'undefined') {
    document.body.classList.add('fullscreen-mode-active');
    if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
      try {
        await document.documentElement.requestFullscreen();
      } catch {
        // Fullscreen might require user interaction, fallback gracefully
      }
    }
  }
}

/** Exit true fullscreen */
export async function exitTrueFullscreen(): Promise<void> {
  // 1. Tauri desktop API
  const appWin = getTauriWindow();
  if (appWin) {
    try {
      await appWin.setFullscreen(false);
    } catch {
      // ignore
    }
  }

  // 2. Web Fullscreen API
  if (typeof document !== 'undefined') {
    document.body.classList.remove('fullscreen-mode-active');
    if (document.fullscreenElement && document.exitFullscreen) {
      try {
        await document.exitFullscreen();
      } catch {
        // ignore
      }
    }
  }
}

/** Switch Tauri window to Mini Clock widget mode (compact, always-on-top) */
export async function applyMiniClockWindow(): Promise<void> {
  const appWin = getTauriWindow();
  if (appWin) {
    try {
      await appWin.setAlwaysOnTop(true);
      await appWin.setResizable(false);
      await appWin.setSize({ width: 340, height: 180 });
    } catch {
      // fallback
    }
  }
}

/** Restore Tauri window to full main dashboard */
export async function restoreMainDashboardWindow(): Promise<void> {
  const appWin = getTauriWindow();
  if (appWin) {
    try {
      await appWin.setAlwaysOnTop(false);
      await appWin.setResizable(true);
      await appWin.setSize({ width: 1100, height: 820 });
      await appWin.center();
    } catch {
      // fallback
    }
  }
}

/** Exit entire application */
export async function exitApplication(): Promise<void> {
  const appWin = getTauriWindow();
  if (appWin) {
    try {
      await appWin.close();
      return;
    } catch {
      // fallback
    }
  }

  if (window.__TAURI__?.process?.exit) {
    try {
      await window.__TAURI__.process.exit(0);
      return;
    } catch {
      // fallback
    }
  }

  // If in browser tab
  window.close();
}

/** Minimize desktop window */
export async function minimizeDesktopWindow(): Promise<void> {
  const appWin = getTauriWindow();
  if (appWin) {
    try {
      await appWin.minimize();
    } catch {
      // fallback
    }
  }
}

/** Toggle Maximize desktop window */
export async function toggleMaximizeDesktopWindow(): Promise<void> {
  const appWin = getTauriWindow();
  if (appWin) {
    try {
      if (appWin.toggleMaximize) {
        await appWin.toggleMaximize();
      } else if (appWin.isMaximized && appWin.maximize && appWin.unmaximize) {
        const max = await appWin.isMaximized();
        if (max) {
          await appWin.unmaximize();
        } else {
          await appWin.maximize();
        }
      }
    } catch {
      // fallback
    }
  }
}

/** Close / Exit Desktop Window */
export async function closeDesktopWindow(): Promise<void> {
  await exitApplication();
}

/** Start window dragging on mousedown */
export async function startDesktopDragging(): Promise<void> {
  const appWin = getTauriWindow();
  if (appWin && appWin.startDragging) {
    try {
      await appWin.startDragging();
    } catch {
      // fallback
    }
  }
}

/** Setup tray events listener */
export function setupDesktopTrayListeners(handlers: {
  onShowMain: () => void;
  onShowFullscreen: () => void;
  onShowMini: () => void;
  onExit: () => void;
}): () => void {
  const unlistens: (() => void)[] = [];

  if (typeof window !== 'undefined' && window.__TAURI__?.event) {
    const { listen } = window.__TAURI__.event;

    listen('tray-show-main', () => {
      handlers.onShowMain();
      restoreMainDashboardWindow();
    }).then((u) => unlistens.push(u));

    listen('tray-show-fullscreen', () => {
      handlers.onShowFullscreen();
      requestTrueFullscreen();
    }).then((u) => unlistens.push(u));

    listen('tray-show-mini', () => {
      handlers.onShowMini();
      applyMiniClockWindow();
    }).then((u) => unlistens.push(u));

    listen('tray-exit', () => {
      handlers.onExit();
      exitApplication();
    }).then((u) => unlistens.push(u));
  }

  // Also support custom window custom events for debugging / testing
  const onCustomMain = () => handlers.onShowMain();
  const onCustomFull = () => handlers.onShowFullscreen();
  const onCustomMini = () => handlers.onShowMini();
  const onCustomExit = () => handlers.onExit();

  window.addEventListener('app-tray-main', onCustomMain);
  window.addEventListener('app-tray-fullscreen', onCustomFull);
  window.addEventListener('app-tray-mini', onCustomMini);
  window.addEventListener('app-tray-exit', onCustomExit);

  return () => {
    unlistens.forEach((fn) => fn());
    window.removeEventListener('app-tray-main', onCustomMain);
    window.removeEventListener('app-tray-fullscreen', onCustomFull);
    window.removeEventListener('app-tray-mini', onCustomMini);
    window.removeEventListener('app-tray-exit', onCustomExit);
  };
}
