/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { AVAILABLE_TIMEZONES, THEMES } from './data/deepseekPrices';
import { ClockTheme, DeepSeekPhase, Language, TimezoneOption } from './types';
import { getPhaseInfo } from './utils/timeUtils';
import { playChime } from './utils/sound';
import { ClockHeader } from './components/ClockHeader';
import { LiangStatusCard } from './components/LiangStatusCard';
import { TokenPriceBoard } from './components/TokenPriceBoard';
import { FullscreenClockModal } from './components/FullscreenClockModal';
import { MiniFloatingClock } from './components/MiniFloatingClock';
import { TRANSLATIONS } from './i18n/translations';
import { 
  isTauriEnv, 
  setupDesktopTrayListeners, 
  applyMiniClockWindow, 
  restoreMainDashboardWindow, 
  requestTrueFullscreen, 
  exitTrueFullscreen,
  exitApplication
} from './utils/tauriWindow';

export default function App() {
  const [now, setNow] = useState<Date>(new Date());
  const [language, setLanguage] = useState<Language>('zh');
  const [currentTimezone, setCurrentTimezone] = useState<TimezoneOption>(AVAILABLE_TIMEZONES[0]);
  const [currentTheme, setCurrentTheme] = useState<ClockTheme>(THEMES[0]);
  const [use24h, setUse24h] = useState<boolean>(true);
  const [showMs, setShowMs] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  const prevPhaseRef = useRef<DeepSeekPhase | null>(null);
  const prevHourRef = useRef<number | null>(null);

  // Setup Tauri Desktop Tray Event Listeners
  useEffect(() => {
    const unregister = setupDesktopTrayListeners({
      onShowMain: () => {
        setIsMinimized(false);
        setIsFullscreen(false);
        restoreMainDashboardWindow();
      },
      onShowFullscreen: () => {
        setIsMinimized(false);
        setIsFullscreen(true);
        requestTrueFullscreen();
      },
      onShowMini: () => {
        setIsFullscreen(false);
        setIsMinimized(true);
        applyMiniClockWindow();
      },
      onExit: () => {
        exitApplication();
      },
    });

    return () => unregister();
  }, []);

  // Real-time ticking interval
  useEffect(() => {
    const updateTick = () => {
      const currentDate = new Date();
      setNow(currentDate);

      // Phase calculation for sound alerts
      const currentPhase = getPhaseInfo(currentDate, language).currentPhase;
      if (prevPhaseRef.current !== null && prevPhaseRef.current !== currentPhase) {
        if (soundEnabled) {
          playChime('switch');
        }
      }
      prevPhaseRef.current = currentPhase;

      // Hour change chime
      const currentHour = currentDate.getHours();
      if (prevHourRef.current !== null && prevHourRef.current !== currentHour) {
        if (soundEnabled) {
          playChime('hour');
        }
      }
      prevHourRef.current = currentHour;
    };

    // Update more frequently if milliseconds are shown
    const intervalMs = showMs ? 40 : 500;
    const intervalId = setInterval(updateTick, intervalMs);

    return () => clearInterval(intervalId);
  }, [showMs, soundEnabled, language]);

  const phaseInfo = getPhaseInfo(now, language);
  const t = TRANSLATIONS[language];

  const handleToggleSound = () => {
    const nextSound = !soundEnabled;
    setSoundEnabled(nextSound);
    if (nextSound) {
      playChime('switch');
    }
  };

  const handleOpenFullscreen = () => {
    setIsMinimized(false);
    setIsFullscreen(true);
    requestTrueFullscreen();
  };

  const handleCloseFullscreen = () => {
    setIsFullscreen(false);
    exitTrueFullscreen();
  };

  const handleMinimizeToMini = () => {
    setIsFullscreen(false);
    exitTrueFullscreen();
    setIsMinimized(true);
    applyMiniClockWindow();
  };

  const handleRestoreMain = () => {
    setIsMinimized(false);
    restoreMainDashboardWindow();
  };

  return (
    <div className={`min-h-screen w-full bg-gradient-to-b ${currentTheme.bgClass} flex flex-col items-center justify-start p-4 sm:p-6 md:p-8 font-sans selection:bg-blue-600 selection:text-white transition-colors duration-500`}>
      {/* Main Big Dashboard - Hidden when Minimized into Floating Gadget */}
      {!isMinimized && (
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center animate-in fade-in duration-300">
          {/* Top Section: Timezone + Language + Date + Time Clock Header */}
          <ClockHeader
            now={now}
            currentTimezone={currentTimezone}
            onTimezoneChange={setCurrentTimezone}
            currentTheme={currentTheme}
            onThemeChange={setCurrentTheme}
            language={language}
            onLanguageChange={setLanguage}
            use24h={use24h}
            onToggle24h={() => setUse24h(!use24h)}
            showMs={showMs}
            onToggleMs={() => setShowMs(!showMs)}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
            onOpenFullscreen={handleOpenFullscreen}
            onMinimizeToMini={handleMinimizeToMini}
            phaseInfo={phaseInfo}
          />

          {/* Middle Section: 梁文峰 (峰时) / 梁文谷 (谷时) Real-time Status Card */}
          <LiangStatusCard
            phaseInfo={phaseInfo}
            currentTheme={currentTheme}
            language={language}
            currentTimezone={currentTimezone}
          />

          {/* Bottom Section: DeepSeek Token Price Board & Calculator */}
          <TokenPriceBoard
            phaseInfo={phaseInfo}
            currentTheme={currentTheme}
            language={language}
          />

          {/* Footer info */}
          <footer className="w-full mt-10 py-4 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              <span>{t.footerNote}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <span>{t.footerBenchmark}</span>
            </div>
          </footer>
        </div>
      )}

      {/* When Minimized: Floating Mini Clock Gadget */}
      {isMinimized && (
        <MiniFloatingClock
          now={now}
          currentTimezone={currentTimezone}
          currentTheme={currentTheme}
          language={language}
          use24h={use24h}
          showMs={showMs}
          phaseInfo={phaseInfo}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          onRestoreMain={handleRestoreMain}
        />
      )}

      {/* Fullscreen Zen Clock Modal */}
      <FullscreenClockModal
        isOpen={isFullscreen}
        onClose={handleCloseFullscreen}
        now={now}
        currentTimezone={currentTimezone}
        currentTheme={currentTheme}
        language={language}
        use24h={use24h}
        showMs={showMs}
        phaseInfo={phaseInfo}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />
    </div>
  );
}

