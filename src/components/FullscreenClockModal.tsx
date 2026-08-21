import React, { useEffect } from 'react';
import { 
  Minimize2, 
  Moon, 
  Sun, 
  Sparkles, 
  Globe, 
  Calendar, 
  Coins, 
  Clock,
  Volume2,
  VolumeX
} from 'lucide-react';
import { ClockTheme, PhaseInfo, TimezoneOption } from '../types';
import { formatTimeInZone, getLunarInfo } from '../utils/timeUtils';
import { DEEPSEEK_MODELS } from '../data/deepseekPrices';

interface FullscreenClockModalProps {
  isOpen: boolean;
  onClose: () => void;
  now: Date;
  currentTimezone: TimezoneOption;
  currentTheme: ClockTheme;
  use24h: boolean;
  showMs: boolean;
  phaseInfo: PhaseInfo;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const FullscreenClockModal: React.FC<FullscreenClockModalProps> = ({
  isOpen,
  onClose,
  now,
  currentTimezone,
  currentTheme,
  use24h,
  showMs,
  phaseInfo,
  soundEnabled,
  onToggleSound,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const { timeStr, dateStr, offsetPart } = formatTimeInZone(now, currentTimezone.timeZone, use24h);
  const lunar = getLunarInfo(now);
  const msString = String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0');
  const isGu = phaseInfo.currentPhase === 'gu';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl text-slate-100 flex flex-col justify-between p-6 sm:p-12 select-none animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold tracking-wider">
            <span>DEEPSEEK DESKTOP CLOCK</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span>{currentTimezone.name} ({offsetPart || currentTimezone.offsetLabel})</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSound}
            className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors cursor-pointer"
            title={soundEnabled ? '静音' : '开启提示音'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          <button
            id="exit-fullscreen-button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 shadow-lg transition-colors cursor-pointer"
          >
            <Minimize2 className="w-4 h-4" />
            <span>退出全屏 (ESC)</span>
          </button>
        </div>
      </div>

      {/* Center Main Huge Clock & Liang Status */}
      <div className="flex flex-col items-center justify-center my-auto text-center space-y-6">
        {/* Date Row */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm sm:text-base text-slate-300 font-medium">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span>{dateStr}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-900/50 border border-slate-800/60 text-slate-400">
            <span>{lunar.lunarStr}</span>
            {lunar.solarTerm && <span className="ml-1.5 text-blue-400">· {lunar.solarTerm}</span>}
          </div>
        </div>

        {/* Giant Digits */}
        <div className="flex items-baseline justify-center tracking-tighter">
          <span className="font-mono text-7xl sm:text-9xl md:text-[13rem] font-black text-white drop-shadow-[0_0_50px_rgba(59,130,246,0.3)]">
            {timeStr}
          </span>
          {showMs && (
            <span className="font-mono text-3xl sm:text-5xl md:text-7xl font-bold ml-2 text-slate-500">
              .{msString}
            </span>
          )}
        </div>

        {/* Liang Status Banner */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className={`px-6 py-3 rounded-2xl border flex items-center gap-3 shadow-xl ${
            isGu
              ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 shadow-emerald-950/40'
              : 'bg-amber-950/60 border-amber-500/50 text-amber-300 shadow-amber-950/40'
          }`}>
            {isGu ? (
              <Moon className="w-6 h-6 text-emerald-400 animate-pulse" />
            ) : (
              <Sun className="w-6 h-6 text-amber-400 animate-spin-slow" />
            )}
            <div className="text-left">
              <div className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                <span>当前时段：{phaseInfo.characterName}</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-slate-950/60 border border-slate-800">
                  {phaseInfo.discountRate}
                </span>
              </div>
              <div className="text-xs text-slate-300">
                {isGu ? '夜间 50% 折扣半价特惠中' : '峰值标准费率高能输出中'} · 距切换还剩 {phaseInfo.countdownFormatted}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Live Price Ticker */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs">
        <div className="flex items-center gap-2 font-semibold text-slate-300">
          <Coins className="w-4 h-4 text-blue-400" />
          <span>DeepSeek 当前实时生效价格 (每 1M Tokens)：</span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {DEEPSEEK_MODELS.map((m) => {
            const pricing = isGu ? m.cny.gu : m.cny.feng;
            return (
              <div key={m.modelId} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="font-bold text-white">{m.modelName}:</span>
                <span className="font-mono text-slate-300">
                  入 ¥{pricing.inputMiss.toFixed(2)} (命中 ¥{pricing.inputHit.toFixed(2)}) / 出 ¥{pricing.output.toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
