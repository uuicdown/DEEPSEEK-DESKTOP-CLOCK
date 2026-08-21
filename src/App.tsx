/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { AVAILABLE_TIMEZONES, THEMES } from './data/deepseekPrices';
import { ClockTheme, DeepSeekPhase, TimezoneOption } from './types';
import { getPhaseInfo } from './utils/timeUtils';
import { playChime } from './utils/sound';
import { ClockHeader } from './components/ClockHeader';
import { LiangStatusCard } from './components/LiangStatusCard';
import { TokenPriceBoard } from './components/TokenPriceBoard';
import { FullscreenClockModal } from './components/FullscreenClockModal';
import { MiniFloatingClock } from './components/MiniFloatingClock';
import { ExePackagingModal } from './components/ExePackagingModal';

export default function App() {
  const [now, setNow] = useState<Date>(new Date());
  const [currentTimezone, setCurrentTimezone] = useState<TimezoneOption>(AVAILABLE_TIMEZONES[0]);
  const [currentTheme, setCurrentTheme] = useState<ClockTheme>(THEMES[0]);
  const [use24h, setUse24h] = useState<boolean>(true);
  const [showMs, setShowMs] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [isExeModalOpen, setIsExeModalOpen] = useState<boolean>(false);

  const prevPhaseRef = useRef<DeepSeekPhase | null>(null);
  const prevHourRef = useRef<number | null>(null);

  // Real-time ticking interval
  useEffect(() => {
    const updateTick = () => {
      const currentDate = new Date();
      setNow(currentDate);

      // Phase calculation for sound alerts
      const currentPhase = getPhaseInfo(currentDate).currentPhase;
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
  }, [showMs, soundEnabled]);

  const phaseInfo = getPhaseInfo(now);

  const handleToggleSound = () => {
    const nextSound = !soundEnabled;
    setSoundEnabled(nextSound);
    if (nextSound) {
      playChime('switch');
    }
  };

  return (
    <div className={`min-h-screen w-full bg-gradient-to-b ${currentTheme.bgClass} flex flex-col items-center justify-start p-4 sm:p-6 md:p-8 font-sans selection:bg-blue-600 selection:text-white transition-colors duration-500`}>
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
        {/* Top Section: Timezone + Date + Time Clock Header */}
        <ClockHeader
          now={now}
          currentTimezone={currentTimezone}
          onTimezoneChange={setCurrentTimezone}
          currentTheme={currentTheme}
          onThemeChange={setCurrentTheme}
          use24h={use24h}
          onToggle24h={() => setUse24h(!use24h)}
          showMs={showMs}
          onToggleMs={() => setShowMs(!showMs)}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          onOpenFullscreen={() => setIsFullscreen(true)}
          onMinimizeToMini={() => setIsMinimized(true)}
          onOpenExeModal={() => setIsExeModalOpen(true)}
          phaseInfo={phaseInfo}
        />

        {/* Middle Section: 梁文峰 (峰时) / 梁文谷 (谷时) Real-time Status Card */}
        <LiangStatusCard
          phaseInfo={phaseInfo}
          currentTheme={currentTheme}
        />

        {/* Bottom Section: DeepSeek Token Price Board & Calculator */}
        <TokenPriceBoard
          phaseInfo={phaseInfo}
          currentTheme={currentTheme}
        />

        {/* Footer info */}
        <footer className="w-full mt-10 py-4 border-t border-slate-800/60 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span>DeepSeek 桌面时钟 · 高峰时段 (梁文峰 · 原价) / 谷时与周末 (梁文谷 · 5折特惠)</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <button
              onClick={() => setIsExeModalOpen(true)}
              className="text-cyan-400 hover:text-cyan-300 underline cursor-pointer text-xs"
            >
              打包为 Windows .exe 桌面独立程序指南
            </button>
            <span>官方计费基准：中国标准时间 (UTC+8)</span>
          </div>
        </footer>
      </div>

      {/* When Minimized: Floating Mini Clock Gadget */}
      {isMinimized && (
        <MiniFloatingClock
          now={now}
          currentTimezone={currentTimezone}
          currentTheme={currentTheme}
          use24h={use24h}
          showMs={showMs}
          phaseInfo={phaseInfo}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          onRestoreMain={() => setIsMinimized(false)}
        />
      )}

      {/* Fullscreen Zen Clock Modal */}
      <FullscreenClockModal
        isOpen={isFullscreen}
        onClose={() => setIsFullscreen(false)}
        now={now}
        currentTimezone={currentTimezone}
        currentTheme={currentTheme}
        use24h={use24h}
        showMs={showMs}
        phaseInfo={phaseInfo}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Windows .exe Packaging Guide Modal */}
      <ExePackagingModal
        isOpen={isExeModalOpen}
        onClose={() => setIsExeModalOpen(false)}
      />
    </div>
  );
}
