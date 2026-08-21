import React, { useState, useEffect, useRef } from 'react';
import { 
  Maximize2, 
  Move, 
  Sun, 
  Moon, 
  Volume2, 
  VolumeX, 
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { ClockTheme, PhaseInfo, TimezoneOption } from '../types';
import { formatTimeInZone } from '../utils/timeUtils';

interface MiniFloatingClockProps {
  now: Date;
  currentTimezone: TimezoneOption;
  currentTheme: ClockTheme;
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
  use24h,
  showMs,
  phaseInfo,
  soundEnabled,
  onToggleSound,
  onRestoreMain,
}) => {
  const clockRef = useRef<HTMLDivElement>(null);
  
  // Position as left (x) and top (y)
  const [position, setPosition] = useState<{ x: number; y: number }>(() => {
    const defaultWidth = 290;
    const defaultHeight = 160;
    const initialX = typeof window !== 'undefined' ? Math.max(16, window.innerWidth - defaultWidth - 24) : 100;
    const initialY = typeof window !== 'undefined' ? Math.max(16, window.innerHeight - defaultHeight - 24) : 100;
    return { x: initialX, y: initialY };
  });

  const [isDragging, setIsDragging] = useState(false);
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [compactMode, setCompactMode] = useState<boolean>(false);

  const { timeStr } = formatTimeInZone(now, currentTimezone.timeZone, use24h);
  const msString = String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0');
  const isGu = phaseInfo.currentPhase === 'gu';

  // Handle window resize to keep floating clock inside viewport
  useEffect(() => {
    const handleResize = () => {
      if (!clockRef.current) return;
      const rect = clockRef.current.getBoundingClientRect();
      setPosition((prev) => {
        const maxX = Math.max(10, window.innerWidth - rect.width - 10);
        const maxY = Math.max(10, window.innerHeight - rect.height - 10);
        return {
          x: Math.min(Math.max(10, prev.x), maxX),
          y: Math.min(Math.max(10, prev.y), maxY),
        };
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Pointer Down to start dragging
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Ignore clicks on buttons or interactive controls
    if ((e.target as HTMLElement).closest('button')) return;

    const targetEl = clockRef.current;
    if (!targetEl) return;

    setIsDragging(true);
    const rect = targetEl.getBoundingClientRect();
    dragOffsetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  // Pointer Move for smooth 1:1 dragging
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const clockEl = clockRef.current;
    const width = clockEl ? clockEl.offsetWidth : 280;
    const height = clockEl ? clockEl.offsetHeight : 140;

    const minX = 8;
    const maxX = Math.max(8, window.innerWidth - width - 8);
    const minY = 8;
    const maxY = Math.max(8, window.innerHeight - height - 8);

    const nextX = Math.min(Math.max(minX, e.clientX - dragOffsetRef.current.x), maxX);
    const nextY = Math.min(Math.max(minY, e.clientY - dragOffsetRef.current.y), maxY);

    setPosition({ x: nextX, y: nextY });
  };

  // Pointer Up/Cancel to stop dragging
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      } catch {
        // ignore
      }
    }
  };

  const handleResetPosition = () => {
    if (!clockRef.current) return;
    const rect = clockRef.current.getBoundingClientRect();
    setPosition({
      x: Math.max(16, window.innerWidth - rect.width - 24),
      y: Math.max(16, window.innerHeight - rect.height - 24),
    });
  };

  return (
    <div
      ref={clockRef}
      id="mini-floating-clock-container"
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 9999,
        touchAction: 'none',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`select-none shadow-2xl rounded-2xl border backdrop-blur-2xl transition-all duration-75 ${
        isGu
          ? 'bg-slate-950/92 border-emerald-500/50 shadow-emerald-950/50 ring-1 ring-emerald-500/30'
          : 'bg-slate-950/92 border-amber-500/50 shadow-amber-950/50 ring-1 ring-amber-500/30'
      } ${isDragging ? 'cursor-grabbing opacity-90 scale-[1.02] shadow-blue-900/40' : 'cursor-grab'} animate-in fade-in duration-200`}
    >
      {/* Mini Title Bar / Drag handle */}
      <div 
        id="mini-clock-drag-bar"
        className="flex items-center justify-between px-3 py-1.5 border-b border-slate-800/80 text-[10px] text-slate-400 bg-slate-900/70 rounded-t-2xl"
      >
        <div className="flex items-center gap-1.5 font-semibold text-slate-300 pointer-events-none">
          <Move className="w-3 h-3 text-slate-400" />
          <span>DeepSeek 小时钟</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleResetPosition}
            title="靠右下停靠"
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-2.5 h-2.5" />
          </button>
          <button
            onClick={() => setCompactMode(!compactMode)}
            title={compactMode ? '展开模式' : '极简超小模式'}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <Sparkles className="w-2.5 h-2.5" />
          </button>
          <button
            onClick={onToggleSound}
            title={soundEnabled ? '静音' : '开启报时'}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-2.5 h-2.5 text-blue-400" /> : <VolumeX className="w-2.5 h-2.5" />}
          </button>
          <button
            id="restore-main-view-button"
            onClick={onRestoreMain}
            title="还原到完整大看板"
            className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all cursor-pointer shadow"
          >
            <Maximize2 className="w-2.5 h-2.5" />
            <span className="text-[9px]">展开主界面</span>
          </button>
        </div>
      </div>

      {/* Content Body: Only Time & 梁文峰/梁文谷 Status */}
      <div className={`p-3 sm:p-4 flex flex-col items-center justify-center ${compactMode ? 'min-w-[200px]' : 'min-w-[280px]'}`}>
        {/* Status Pill */}
        <div className="flex items-center gap-2 mb-1.5 pointer-events-none">
          <span
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black border tracking-wide ${
              isGu
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 animate-pulse'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/50'
            }`}
          >
            {isGu ? <Moon className="w-3.5 h-3.5 text-emerald-400" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
            <span>【{phaseInfo.characterName}】</span>
            <span className="text-[10px] font-normal opacity-90">({isGu ? '5折特惠' : '高峰原价'})</span>
          </span>
          {!compactMode && (
            <span className="text-[10px] font-mono text-slate-400">
              {phaseInfo.beijingWeekdayName}
            </span>
          )}
        </div>

        {/* Large Crisp Digital Time Display */}
        <div className="flex items-baseline justify-center font-mono font-black text-white tracking-wider my-1 drop-shadow-md pointer-events-none">
          <span className={`${compactMode ? 'text-2xl' : 'text-3xl sm:text-4xl'} font-bold tabular-nums`}>
            {timeStr}
          </span>
          {showMs && (
            <span className="text-xs text-blue-400/90 ml-1 font-mono">
              .{msString}
            </span>
          )}
        </div>

        {/* Next Switch Target & Countdown */}
        <div className="flex items-center justify-between w-full mt-1 pt-1.5 border-t border-slate-800/80 text-[10px] text-slate-400 pointer-events-none">
          <span className="truncate max-w-[150px]">
            目标: {phaseInfo.nextCharacterName} ({isGu ? '峰时' : '谷时5折'})
          </span>
          <span className="font-mono font-bold text-amber-300/90 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
            {phaseInfo.countdownFormatted}
          </span>
        </div>
      </div>
    </div>
  );
};
