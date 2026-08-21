import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Maximize2, 
  Move, 
  Sun, 
  Moon, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  RotateCcw,
  ExternalLink,
  X
} from 'lucide-react';
import { ClockTheme, Language, PhaseInfo, TimezoneOption } from '../types';
import { formatTimeInZone } from '../utils/timeUtils';
import { TRANSLATIONS } from '../i18n/translations';
import { isTauriEnv, applyMiniClockWindow, restoreMainDashboardWindow } from '../utils/tauriWindow';
import appIconImg from '../assets/images/deepseek_clock_icon_1787300567789.jpg';

interface MiniFloatingClockProps {
  now: Date;
  currentTimezone: TimezoneOption;
  currentTheme: ClockTheme;
  language: Language;
  use24h: boolean;
  showMs: boolean;
  phaseInfo: PhaseInfo;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onRestoreMain: () => void;
  onCloseMini?: () => void;
}

export const MiniFloatingClock: React.FC<MiniFloatingClockProps> = ({
  now,
  currentTimezone,
  currentTheme,
  language,
  use24h,
  showMs,
  phaseInfo,
  soundEnabled,
  onToggleSound,
  onRestoreMain,
  onCloseMini,
}) => {
  const clockRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[language];
  const isTauri = isTauriEnv();

  // Position as left (x) and top (y) for web in-page floating
  const [position, setPosition] = useState<{ x: number; y: number }>(() => {
    const defaultWidth = 300;
    const defaultHeight = 160;
    const initialX = typeof window !== 'undefined' ? Math.max(16, window.innerWidth - defaultWidth - 24) : 100;
    const initialY = typeof window !== 'undefined' ? Math.max(16, window.innerHeight - defaultHeight - 24) : 100;
    return { x: initialX, y: initialY };
  });

  const [isDragging, setIsDragging] = useState(false);
  const [compactMode, setCompactMode] = useState<boolean>(false);

  // Apply Tauri mini window resizing on mount
  useEffect(() => {
    if (isTauri) {
      applyMiniClockWindow();
    }
  }, [isTauri]);

  const handleRestore = async () => {
    if (isTauri) {
      await restoreMainDashboardWindow();
    }
    onRestoreMain();
  };

  // Drag tracking refs for in-browser fallback
  const dragRef = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
    pointerId: number | null;
    rafId: number | null;
  }>({
    active: false,
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
    pointerId: null,
    rafId: null,
  });

  const { timeStr } = formatTimeInZone(now, currentTimezone.timeZone, use24h, language);
  const msString = String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0');
  const isGu = phaseInfo.currentPhase === 'gu';

  // Handle window resize to keep floating clock inside viewport
  useEffect(() => {
    const handleResize = () => {
      if (!clockRef.current) return;
      const rect = clockRef.current.getBoundingClientRect();
      setPosition((prev) => {
        const maxX = Math.max(8, window.innerWidth - rect.width - 8);
        const maxY = Math.max(8, window.innerHeight - rect.height - 8);
        return {
          x: Math.min(Math.max(8, prev.x), maxX),
          y: Math.min(Math.max(8, prev.y), maxY),
        };
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Pointer Down to start dragging with pointer capture (for web mode)
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return;
    if (isTauri) return; // In Tauri, handled by data-tauri-drag-region natively
    
    const targetEl = e.currentTarget;
    try {
      targetEl.setPointerCapture(e.pointerId);
    } catch {
      // Ignore fallback
    }

    dragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y,
      pointerId: e.pointerId,
      rafId: null,
    };

    setIsDragging(true);
    document.body.style.userSelect = 'none';
  }, [position.x, position.y, isTauri]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;

    const currentX = e.clientX;
    const currentY = e.clientY;

    if (dragRef.current.rafId) {
      cancelAnimationFrame(dragRef.current.rafId);
    }

    dragRef.current.rafId = requestAnimationFrame(() => {
      const clockEl = clockRef.current;
      const width = clockEl ? clockEl.offsetWidth : 280;
      const height = clockEl ? clockEl.offsetHeight : 140;

      const deltaX = currentX - dragRef.current.startX;
      const deltaY = currentY - dragRef.current.startY;

      const rawX = dragRef.current.initialX + deltaX;
      const rawY = dragRef.current.initialY + deltaY;

      const minX = 8;
      const maxX = Math.max(8, window.innerWidth - width - 8);
      const minY = 8;
      const maxY = Math.max(8, window.innerHeight - height - 8);

      const clampedX = Math.min(Math.max(minX, rawX), maxX);
      const clampedY = Math.min(Math.max(minY, rawY), maxY);

      setPosition({ x: clampedX, y: clampedY });
    });
  }, []);

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    
    if (dragRef.current.pointerId !== null) {
      try {
        e.currentTarget.releasePointerCapture(dragRef.current.pointerId);
      } catch {
        // Ignore fallback
      }
    }

    if (dragRef.current.rafId) {
      cancelAnimationFrame(dragRef.current.rafId);
    }

    dragRef.current.active = false;
    dragRef.current.pointerId = null;
    setIsDragging(false);
    document.body.style.userSelect = '';
  }, []);

  const handleResetPosition = () => {
    if (!clockRef.current) return;
    const rect = clockRef.current.getBoundingClientRect();
    setPosition({
      x: Math.max(16, window.innerWidth - rect.width - 24),
      y: Math.max(16, window.innerHeight - rect.height - 24),
    });
  };

  const isLight = currentTheme.id === 'porcelain-light';

  return (
    <div
      ref={clockRef}
      id="mini-floating-clock-container"
      data-tauri-drag-region
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        zIndex: 9999,
        touchAction: 'none',
        willChange: 'transform',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`select-none shadow-2xl rounded-2xl border backdrop-blur-2xl transition-all duration-300 ${
        isLight
          ? isGu
            ? 'bg-white/95 text-slate-800 border-emerald-400/60 shadow-[0_10px_35px_-5px_rgba(16,185,129,0.25)] ring-1 ring-emerald-400/30'
            : 'bg-white/95 text-slate-800 border-amber-400/60 shadow-[0_10px_35px_-5px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/30'
          : isGu
            ? `${currentTheme.cardBgClass} ${currentTheme.textColor} border-emerald-500/50 shadow-[0_10px_35px_-5px_rgba(16,185,129,0.35)] ring-1 ring-emerald-500/30`
            : `${currentTheme.cardBgClass} ${currentTheme.textColor} border-amber-500/50 shadow-[0_10px_35px_-5px_rgba(245,158,11,0.35)] ring-1 ring-amber-500/30`
      } ${isDragging ? 'cursor-grabbing scale-[1.02] ring-2 ring-blue-500 shadow-blue-500/40' : 'cursor-grab'} animate-in fade-in duration-200`}
    >
      {/* Mini Title Bar / Drag handle */}
      <div 
        id="mini-clock-drag-bar"
        data-tauri-drag-region
        className={`flex items-center justify-between px-3 py-1.5 border-b text-[10px] rounded-t-2xl gap-2 transition-colors ${
          isLight 
            ? 'border-slate-200 text-slate-600 bg-slate-100/90' 
            : 'border-slate-800/80 text-slate-400 bg-slate-900/90'
        }`}
      >
        <div className={`flex items-center gap-1.5 font-semibold pointer-events-none truncate ${
          isLight ? 'text-slate-800' : 'text-slate-200'
        }`}>
          <img 
            src={appIconImg} 
            alt="Icon" 
            className="w-3.5 h-3.5 rounded object-cover" 
          />
          <Move className={`w-3 h-3 flex-shrink-0 ${isDragging ? currentTheme.accentText : isLight ? 'text-slate-500' : 'text-slate-400'}`} />
          <span className="truncate">{t.miniClock}</span>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={handleResetPosition}
            title={language === 'zh' ? '靠右下停靠' : 'Dock Bottom-Right'}
            className={`p-1 rounded transition-colors cursor-pointer ${
              isLight ? 'hover:bg-slate-200 text-slate-500 hover:text-slate-900' : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <RotateCcw className="w-2.5 h-2.5" />
          </button>
          <button
            onClick={() => setCompactMode(!compactMode)}
            title={compactMode ? (language === 'zh' ? '展开模式' : 'Expand') : (language === 'zh' ? '极简超小模式' : 'Compact')}
            className={`p-1 rounded transition-colors cursor-pointer ${
              isLight ? 'hover:bg-slate-200 text-slate-500 hover:text-slate-900' : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-2.5 h-2.5" />
          </button>
          <button
            onClick={onToggleSound}
            title={soundEnabled ? t.soundEnabledTitle : t.soundDisabledTitle}
            className={`p-1 rounded transition-colors cursor-pointer ${
              isLight ? 'hover:bg-slate-200 text-slate-500 hover:text-slate-900' : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {soundEnabled ? <Volume2 className={`w-2.5 h-2.5 ${currentTheme.accentText}`} /> : <VolumeX className="w-2.5 h-2.5" />}
          </button>
          <button
            id="restore-main-view-button"
            onClick={handleRestore}
            title={t.expandMainBtn}
            className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all cursor-pointer shadow whitespace-nowrap"
          >
            <Maximize2 className="w-2.5 h-2.5 flex-shrink-0" />
            <span className="text-[10px] font-semibold">{t.expandMainBtn}</span>
          </button>
        </div>
      </div>

      {/* Content Body: Only Time & 梁文峰/梁文谷 Status */}
      <div className={`p-3 sm:p-4 flex flex-col items-center justify-center ${compactMode ? 'min-w-[210px]' : 'min-w-[280px]'}`}>
        {/* Status Pill */}
        <div className="flex items-center gap-2 mb-1.5 pointer-events-none max-w-full">
          <span
            className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black border tracking-wide truncate ${
              isGu
                ? 'bg-emerald-500/20 text-emerald-500 dark:text-emerald-300 border-emerald-500/50 animate-pulse'
                : 'bg-amber-500/20 text-amber-600 dark:text-amber-300 border-amber-500/50'
            }`}
          >
            {isGu ? <Moon className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 flex-shrink-0" /> : <Sun className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 flex-shrink-0" />}
            <span className="truncate">{phaseInfo.characterName}</span>
            <span className="text-[10px] font-normal opacity-90 whitespace-nowrap">
              ({isGu ? (language === 'zh' ? '5折' : '50%') : (language === 'zh' ? '原价' : '100%')})
            </span>
          </span>
          {!compactMode && (
            <span className={`text-[10px] font-mono whitespace-nowrap ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              {phaseInfo.beijingWeekdayName}
            </span>
          )}
        </div>

        {/* Large Crisp Digital Time Display */}
        <div className={`flex items-baseline justify-center font-mono font-black tracking-wider my-1 drop-shadow-md pointer-events-none ${
          isLight ? 'text-slate-900' : currentTheme.textColor
        }`}>
          <span className={`${compactMode ? 'text-2xl' : 'text-3xl sm:text-4xl'} font-bold tabular-nums`}>
            {timeStr}
          </span>
          {showMs && (
            <span className={`text-xs ml-1 font-mono ${currentTheme.accentText}`}>
              .{msString}
            </span>
          )}
        </div>

        {/* Next Switch Target & Countdown */}
        <div className={`flex items-center justify-between w-full mt-1 pt-1.5 border-t text-[10px] pointer-events-none gap-2 ${
          isLight ? 'border-slate-200 text-slate-500' : 'border-slate-800/80 text-slate-400'
        }`}>
          <span className="min-w-0 flex-1 truncate pr-1">
            {t.targetNext}: {phaseInfo.nextCharacterName}
          </span>
          <span className={`font-mono font-bold px-1.5 py-0.5 rounded border flex-shrink-0 whitespace-nowrap ${
            isLight 
              ? 'text-amber-700 bg-amber-50 border-amber-200' 
              : 'text-amber-300/90 bg-slate-900 border-slate-800'
          }`}>
            {phaseInfo.countdownFormatted}
          </span>
        </div>
      </div>
    </div>
  );
};

