import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Maximize2, 
  Move, 
  Sun, 
  Moon, 
  Volume2, 
  VolumeX, 
  RotateCcw,
  X
} from 'lucide-react';
import { ClockTheme, Language, PhaseInfo, TimezoneOption } from '../types';
import { formatTimeInZone, isDaytimeInZone } from '../utils/timeUtils';
import { TRANSLATIONS } from '../i18n/translations';
import { 
  isTauriEnv, 
  applyMiniClockWindow, 
  restoreMainDashboardWindow, 
  closeDesktopWindow,
  startDesktopDragging 
} from '../utils/tauriWindow';
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
}) => {
  const clockRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[language];
  const isTauri = isTauriEnv();

  // Position as left (x) and top (y) for web in-page floating
  const [position, setPosition] = useState<{ x: number; y: number }>(() => {
    const defaultWidth = 310;
    const defaultHeight = 135;
    const initialX = typeof window !== 'undefined' ? Math.max(16, window.innerWidth - defaultWidth - 24) : 100;
    const initialY = typeof window !== 'undefined' ? Math.max(16, window.innerHeight - defaultHeight - 24) : 100;
    return { x: initialX, y: initialY };
  });

  const [isDragging, setIsDragging] = useState(false);

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

  const handleClose = async () => {
    if (isTauri) {
      await closeDesktopWindow();
    } else {
      onRestoreMain();
    }
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
  const isDaytime = isDaytimeInZone(now, currentTimezone.timeZone);

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
    if (isTauri) {
      startDesktopDragging();
      return;
    }
    
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
      const width = clockEl ? clockEl.offsetWidth : 310;
      const height = clockEl ? clockEl.offsetHeight : 135;

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
      onDoubleClick={handleRestore}
      style={
        isTauri
          ? {
              width: '100vw',
              height: '100vh',
              position: 'fixed',
              left: 0,
              top: 0,
              zIndex: 9999,
            }
          : {
              position: 'fixed',
              left: 0,
              top: 0,
              width: '310px',
              height: '135px',
              transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
              zIndex: 9999,
              touchAction: 'none',
              willChange: 'transform',
            }
      }
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`select-none overflow-hidden ${isTauri ? 'rounded-none h-full w-full' : 'rounded-2xl shadow-2xl'} backdrop-blur-2xl transition-all duration-200 border border-slate-700/60 ${
        isLight
          ? isGu
            ? 'bg-white/95 text-slate-800 shadow-[0_10px_30px_-5px_rgba(16,185,129,0.3)]'
            : 'bg-white/95 text-slate-800 shadow-[0_10px_30px_-5px_rgba(245,158,11,0.3)]'
          : isGu
            ? `${currentTheme.cardBgClass} ${currentTheme.textColor} shadow-[0_10px_30px_-5px_rgba(16,185,129,0.35)]`
            : `${currentTheme.cardBgClass} ${currentTheme.textColor} shadow-[0_10px_30px_-5px_rgba(245,158,11,0.35)]`
      } ${!isTauri && isDragging ? 'cursor-grabbing scale-[1.01]' : 'cursor-default'} animate-in fade-in duration-200`}
    >
      {/* Mini Title Bar / Drag handle */}
      <div 
        id="mini-clock-drag-bar"
        data-tauri-drag-region
        onMouseDown={(e) => {
          if (isTauri && !(e.target as HTMLElement).closest('button')) {
            startDesktopDragging();
          }
        }}
        className={`flex items-center justify-between px-2.5 py-1 text-[11px] gap-2 transition-colors cursor-move border-b border-slate-700/40 ${
          isLight 
            ? 'text-slate-700 bg-slate-100/90' 
            : 'text-slate-300 bg-slate-900/90'
        }`}
      >
        <div 
          data-tauri-drag-region
          className={`flex items-center gap-1.5 font-bold pointer-events-none truncate ${
            isLight ? 'text-slate-800' : 'text-slate-100'
          }`}
        >
          <img 
            src={appIconImg} 
            alt="Icon" 
            className="w-3.5 h-3.5 rounded object-cover flex-shrink-0" 
          />
          <span className="truncate text-[11px]">DeepSeek 桌面小时钟</span>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {!isTauri && (
            <button
              onClick={handleResetPosition}
              title={language === 'zh' ? '靠右下停靠' : 'Dock Bottom-Right'}
              className={`p-1 rounded-md transition-colors cursor-pointer ${
                isLight ? 'hover:bg-slate-200 text-slate-500 hover:text-slate-900' : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <RotateCcw className="w-2.5 h-2.5" />
            </button>
          )}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? t.soundEnabledTitle : t.soundDisabledTitle}
            className={`p-1 rounded-md transition-colors cursor-pointer ${
              isLight ? 'hover:bg-slate-200 text-slate-500 hover:text-slate-900' : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {soundEnabled ? <Volume2 className={`w-3 h-3 ${currentTheme.accentText}`} /> : <VolumeX className="w-3 h-3" />}
          </button>
          <button
            id="restore-main-view-button"
            onClick={handleRestore}
            title="还原至完整大看板 (双击任意处也可还原)"
            className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all cursor-pointer shadow whitespace-nowrap text-[10px]"
          >
            <Maximize2 className="w-2.5 h-2.5 flex-shrink-0" />
            <span>{t.expandMainBtn}</span>
          </button>
          <button
            id="mini-close-button"
            onClick={handleClose}
            title={language === 'zh' ? '关闭 / 退出' : 'Close'}
            className="p-1 rounded-md bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Content Body: Only Time & 梁文峰/梁文谷 Status */}
      <div 
        data-tauri-drag-region
        onMouseDown={(e) => {
          if (isTauri && !(e.target as HTMLElement).closest('button')) {
            startDesktopDragging();
          }
        }}
        className="p-2 px-3 flex flex-col items-center justify-between h-[calc(100%-28px)]"
      >
        {/* Status Pill */}
        <div 
          data-tauri-drag-region
          className="flex items-center justify-between w-full pointer-events-none"
        >
          <span
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-black tracking-wide truncate shadow-sm ${
              isGu
                ? 'bg-emerald-500/20 text-emerald-500 dark:text-emerald-300 animate-pulse'
                : 'bg-amber-500/20 text-amber-600 dark:text-amber-300'
            }`}
          >
            {isDaytime ? (
              <Sun className="w-3 h-3 text-amber-500 dark:text-amber-400 flex-shrink-0" />
            ) : (
              <Moon className="w-3 h-3 text-indigo-400 dark:text-indigo-300 flex-shrink-0" />
            )}
            <span className="truncate">{phaseInfo.characterName}</span>
            <span className="text-[10px] font-bold opacity-90 whitespace-nowrap">
              ({phaseInfo.isHoliday ? `${phaseInfo.holidayName} 5折` : phaseInfo.isWeekend ? (language === 'zh' ? '周末 5折' : 'Weekend 50%') : isGu ? (language === 'zh' ? '5折优惠' : '50% Off') : (language === 'zh' ? '原价' : '100%')})
            </span>
          </span>
          <span className={`text-[10px] font-mono whitespace-nowrap ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            {phaseInfo.beijingWeekdayName}
          </span>
        </div>

        {/* Large Crisp Digital Time Display */}
        <div 
          data-tauri-drag-region
          className={`flex items-baseline justify-center font-mono font-black tracking-wider drop-shadow-md pointer-events-none ${
            isLight ? 'text-slate-900' : currentTheme.textColor
          }`}
        >
          <span className="text-3xl font-black tabular-nums">
            {timeStr}
          </span>
          {showMs && (
            <span className={`text-xs ml-1 font-mono ${currentTheme.accentText}`}>
              .{msString}
            </span>
          )}
        </div>

        {/* Next Switch Target & Countdown */}
        <div 
          data-tauri-drag-region
          className={`flex items-center justify-between w-full text-[10px] pointer-events-none gap-2 ${
            isLight ? 'text-slate-600' : 'text-slate-400'
          }`}
        >
          <span className="min-w-0 flex-1 truncate pr-1">
            {t.targetNext}: <strong className="text-slate-200">{phaseInfo.nextCharacterName}</strong>
          </span>
          <span className={`font-mono font-bold px-1.5 py-0.5 rounded flex-shrink-0 whitespace-nowrap shadow-sm ${
            isLight 
              ? 'text-amber-700 bg-amber-50' 
              : 'text-amber-300 bg-slate-900 border border-amber-500/20'
          }`}>
            {phaseInfo.countdownFormatted}
          </span>
        </div>
      </div>
    </div>
  );
};


