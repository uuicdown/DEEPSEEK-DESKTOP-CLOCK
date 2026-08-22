/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getCurrentWindow, LogicalSize } from '@tauri-apps/api/window';
import { listen as tauriListen } from '@tauri-apps/api/event';

declare global {
  interface Window {
    __TAURI__?: unknown;
    __TAURI_INTERNALS__?: unknown;
  }
}

/** Check if running inside Tauri desktop environment */
export function isTauriEnv(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean(
    window.__TAURI_INTERNALS__ || 
    window.__TAURI__ || 
    (window as unknown as { isTauri?: boolean }).isTauri
  );
}

/** Request true immersive fullscreen */
export async function requestTrueFullscreen(): Promise<void> {
  if (isTauriEnv()) {
    try {
      const appWin = getCurrentWindow();
      await appWin.setFullscreen(true);
    } catch {
      // fallback
    }
  }

  // Web Fullscreen API
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
  if (isTauriEnv()) {
    try {
      const appWin = getCurrentWindow();
      await appWin.setFullscreen(false);
    } catch {
      // fallback
    }
  }

  // Web Fullscreen API
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

/** Switch Tauri window to Mini Clock widget mode (compact 310x135, always-on-top) */
export async function applyMiniClockWindow(): Promise<void> {
  if (isTauriEnv()) {
    try {
      const appWin = getCurrentWindow();
      await appWin.setAlwaysOnTop(true);
      await appWin.setResizable(false);
      await appWin.setSize(new LogicalSize(310, 135));
    } catch (err) {
      console.warn('Error resizing to mini clock:', err);
    }
  }
}

/** Restore Tauri window to full main dashboard (1000x760, centered, resizable) */
export async function restoreMainDashboardWindow(): Promise<void> {
  if (isTauriEnv()) {
    try {
      const appWin = getCurrentWindow();
      await appWin.setAlwaysOnTop(false);
      await appWin.setResizable(true);
      await appWin.setSize(new LogicalSize(1000, 760));
      await appWin.center();
    } catch (err) {
      console.warn('Error restoring main dashboard:', err);
    }
  }
}

/** Minimize desktop window */
export async function minimizeDesktopWindow(): Promise<void> {
  if (isTauriEnv()) {
    try {
      const appWin = getCurrentWindow();
      await appWin.minimize();
      return;
    } catch (err) {
      console.warn('Failed to minimize via Tauri API:', err);
    }
  }
}

/** Toggle Maximize / Restore desktop window */
export async function toggleMaximizeDesktopWindow(): Promise<void> {
  if (isTauriEnv()) {
    try {
      const appWin = getCurrentWindow();
      await appWin.toggleMaximize();
      return;
    } catch (err) {
      console.warn('Failed to toggle maximize via Tauri API:', err);
    }
  }
}

/** Close / Exit Desktop Window */
export async function closeDesktopWindow(): Promise<void> {
  if (isTauriEnv()) {
    try {
      const appWin = getCurrentWindow();
      await appWin.close();
      return;
    } catch (err) {
      console.warn('Failed to close via Tauri API:', err);
    }
  }
  window.close();
}

/** Exit entire application */
export async function exitApplication(): Promise<void> {
  await closeDesktopWindow();
}

/** Start window dragging on mousedown */
export async function startDesktopDragging(): Promise<void> {
  if (isTauriEnv()) {
    try {
      const appWin = getCurrentWindow();
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

  if (isTauriEnv()) {
    tauriListen('tray-show-main', () => {
      handlers.onShowMain();
      restoreMainDashboardWindow();
    }).then((u) => unlistens.push(u)).catch(() => {});

    tauriListen('tray-show-fullscreen', () => {
      handlers.onShowFullscreen();
      requestTrueFullscreen();
    }).then((u) => unlistens.push(u)).catch(() => {});

    tauriListen('tray-show-mini', () => {
      handlers.onShowMini();
      applyMiniClockWindow();
    }).then((u) => unlistens.push(u)).catch(() => {});

    tauriListen('tray-exit', () => {
      handlers.onExit();
      exitApplication();
    }).then((u) => unlistens.push(u)).catch(() => {});
  }

  // Also support custom window events for debugging / browser simulation
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

