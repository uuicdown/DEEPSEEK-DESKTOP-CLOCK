import React, { useEffect } from 'react';
import { 
  Minimize2, 
  Moon, 
  Sun, 
  Globe, 
  Calendar, 
  Coins, 
  Volume2, 
  VolumeX 
} from 'lucide-react';
import { ClockTheme, Language, PhaseInfo, TimezoneOption } from '../types';
import { formatTimeInZone, getLunarInfo } from '../utils/timeUtils';
import { DEEPSEEK_MODELS } from '../data/deepseekPrices';
import { TRANSLATIONS } from '../i18n/translations';
import { requestTrueFullscreen, exitTrueFullscreen } from '../utils/tauriWindow';
import appIconImg from '../assets/images/deepseek_clock_icon_1787300567789.jpg';

interface FullscreenClockModalProps {
  isOpen: boolean;
  onClose: () => void;
  now: Date;
  currentTimezone: TimezoneOption;
  currentTheme: ClockTheme;
  language: Language;
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
  language,
  use24h,
  showMs,
  phaseInfo,
  soundEnabled,
  onToggleSound,
}) => {
  const t = TRANSLATIONS[language];

  useEffect(() => {
    if (isOpen) {
      requestTrueFullscreen();
    } else {
      exitTrueFullscreen();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
        exitTrueFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleExit = () => {
    exitTrueFullscreen();
    onClose();
  };

  const { timeStr, dateStr, offsetPart } = formatTimeInZone(now, currentTimezone.timeZone, use24h, language);
  const lunar = getLunarInfo(now);
  const msString = String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0');
  const isGu = phaseInfo.currentPhase === 'gu';
  const tzName = currentTimezone.names?.[language] || currentTimezone.name;

  const isLight = currentTheme.id === 'porcelain-light';

  return (
    <div className={`fixed inset-0 z-[99999] w-screen h-screen overflow-hidden bg-gradient-to-b ${currentTheme.bgClass} backdrop-blur-3xl flex flex-col justify-between p-6 sm:p-10 select-none animate-in fade-in duration-300 transition-colors`}>
      {/* Top Bar */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl ${
            isLight ? 'bg-white/90 border-blue-500/30 text-blue-600 shadow-md' : 'bg-slate-900/90 border border-blue-500/30 text-blue-400 shadow-lg'
          } text-xs font-bold tracking-wider`}>
            <img 
              src={appIconImg} 
              alt="DeepSeek Clock Icon" 
              className="w-5 h-5 rounded-lg object-cover ring-1 ring-cyan-400/40"
            />
            <span className={isLight ? 'text-slate-900' : 'text-white'}>{t.appName}</span>
          </div>

          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border text-xs shadow-md ${
            isLight ? 'bg-white/90 border-slate-200 text-slate-700' : 'bg-slate-900/90 border-slate-800 text-slate-300'
          }`}>
            <Globe className={`w-3.5 h-3.5 ${currentTheme.accentText}`} />
            <span>{tzName} ({offsetPart || currentTimezone.offsetLabel})</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onToggleSound}
            className={`p-2.5 rounded-2xl border transition-colors cursor-pointer shadow-md ${
              isLight ? 'bg-white/90 hover:bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-900/90 hover:bg-slate-800 border-slate-800 text-slate-300'
            }`}
            title={soundEnabled ? t.soundEnabledTitle : t.soundDisabledTitle}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          <button
            id="exit-fullscreen-button"
            onClick={handleExit}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-semibold border shadow-xl transition-all hover:scale-105 cursor-pointer ${
              isLight ? 'bg-slate-900 hover:bg-slate-800 text-white border-slate-800' : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
            }`}
          >
            <Minimize2 className="w-4 h-4" />
            <span>{t.exitFullscreen}</span>
          </button>
        </div>
      </div>

      {/* Center Main Huge Clock & Liang Status */}
      <div className="flex flex-col items-center justify-center my-auto text-center space-y-6 sm:space-y-8">
        {/* Date Row */}
        <div className={`flex flex-wrap items-center justify-center gap-3 text-sm sm:text-base font-medium ${
          isLight ? 'text-slate-700' : 'text-slate-300'
        }`}>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border shadow-md ${
            isLight ? 'bg-white/90 border-slate-200' : 'bg-slate-900/80 border-slate-800'
          }`}>
            <Calendar className={`w-4 h-4 ${currentTheme.accentText}`} />
            <span>{dateStr}</span>
          </div>
          {language === 'zh' && (
            <div className={`px-3.5 py-2 rounded-2xl border shadow-md ${
              isLight ? 'bg-white/70 border-slate-200 text-slate-600' : 'bg-slate-900/60 border-slate-800/80 text-slate-400'
            }`}>
              <span>{lunar.lunarStr}</span>
              {lunar.solarTerm && <span className={`ml-1.5 font-semibold ${currentTheme.accentText}`}>· {lunar.solarTerm}</span>}
            </div>
          )}
        </div>

        {/* Giant Digits */}
        <div className="flex items-baseline justify-center tracking-tighter">
          <span className={`font-mono text-7xl sm:text-9xl md:text-[13rem] lg:text-[15rem] font-black ${
            isLight ? 'text-slate-900 drop-shadow-[0_10px_30px_rgba(0,0,0,0.08)]' : `${currentTheme.textColor} drop-shadow-[0_0_60px_rgba(59,130,246,0.35)]`
          }`}>
            {timeStr}
          </span>
          {showMs && (
            <span className={`font-mono text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold ml-3 ${currentTheme.accentText}`}>
              .{msString}
            </span>
          )}
        </div>

        {/* Liang Status Banner */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className={`px-7 py-3.5 rounded-3xl border flex items-center gap-4 shadow-2xl backdrop-blur-md ${
            isLight
              ? isGu
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-emerald-100 ring-1 ring-emerald-300/60'
                : 'bg-amber-50 border-amber-300 text-amber-900 shadow-amber-100 ring-1 ring-amber-300/60'
              : isGu
                ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300 shadow-emerald-950/50 ring-1 ring-emerald-500/30'
                : 'bg-amber-950/70 border-amber-500/50 text-amber-300 shadow-amber-950/50 ring-1 ring-amber-500/30'
          }`}>
            {isGu ? (
              <Moon className="w-7 h-7 text-emerald-500 dark:text-emerald-400 animate-pulse" />
            ) : (
              <Sun className="w-7 h-7 text-amber-500 dark:text-amber-400 animate-spin-slow" />
            )}
            <div className="text-left">
              <div className={`text-xl font-black tracking-tight flex items-center gap-2.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                <span>{language === 'zh' ? '当前时段：' : language === 'en' ? 'Current Phase: ' : 'Текущая фаза: '}{phaseInfo.characterName}</span>
                <span className={`text-xs px-2.5 py-0.5 rounded-lg border font-mono ${
                  isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-950/80 border-slate-800 text-slate-200'
                }`}>
                  {phaseInfo.discountRate}
                </span>
              </div>
              <div className={`text-xs mt-0.5 font-medium ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                {isGu ? (language === 'zh' ? '50% 折扣半价特惠中' : language === 'en' ? '50% Off Discount active' : 'Скидка 50% активна') : (language === 'zh' ? '峰值标准费率运行中' : language === 'en' ? 'Standard peak pricing' : 'Стандартный пиковый тариф')} · {t.countdownLabel} {phaseInfo.countdownFormatted}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Live Price Ticker */}
      <div className={`flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl border text-xs shadow-xl ${
        isLight ? 'bg-white/85 border-slate-200 text-slate-700' : 'bg-slate-900/70 border-slate-800/80 text-slate-300'
      }`}>
        <div className="flex items-center gap-2 font-semibold">
          <Coins className={`w-4 h-4 ${currentTheme.accentText}`} />
          <span>{t.priceBoardTitle} (/ 1M Tokens)：</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {DEEPSEEK_MODELS.map((m) => {
            const pricing = isGu ? m.cny.gu : m.cny.feng;
            return (
              <div key={m.modelId} className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl border shadow-sm ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'
              }`}>
                <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{m.modelName}:</span>
                <span className={`font-mono ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  ¥{pricing.inputMiss.toFixed(2)} (Hit: ¥{pricing.inputHit.toFixed(2)}) / Out: ¥{pricing.output.toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
