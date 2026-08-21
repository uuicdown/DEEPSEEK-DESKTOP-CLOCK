import React, { useState } from 'react';
import { 
  Moon, 
  Sun, 
  Sparkles, 
  Info, 
  Layers, 
  ChevronDown, 
  ChevronUp, 
  TrendingDown, 
  Timer 
} from 'lucide-react';
import { ClockTheme, Language, PhaseInfo, TimezoneOption } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface LiangStatusCardProps {
  phaseInfo: PhaseInfo;
  currentTheme: ClockTheme;
  language: Language;
  currentTimezone?: TimezoneOption;
}

export const LiangStatusCard: React.FC<LiangStatusCardProps> = ({
  phaseInfo,
  language,
  currentTimezone,
}) => {
  const [showMemeInfo, setShowMemeInfo] = useState(false);
  const t = TRANSLATIONS[language];
  const isGu = phaseInfo.currentPhase === 'gu';
  const beijingHour = phaseInfo.beijingHour + phaseInfo.beijingMinute / 60;
  const currentTz = currentTimezone?.timeZone || 'Asia/Shanghai';

  // Helper to determine day/night status in the user's selected timezone for each Beijing time window
  const getSegmentDayNight = (midBeijingHour: number, type: 'feng' | 'gu') => {
    const utcHour = midBeijingHour - 8;
    const sampleDate = new Date(Date.UTC(2026, 7, 20, Math.floor(utcHour), Math.round((utcHour % 1) * 60)));
    
    let localHour = 0;
    try {
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: currentTz,
        hour: 'numeric',
        hourCycle: 'h23',
      }).formatToParts(sampleDate);
      const hourPart = parts.find((p) => p.type === 'hour')?.value;
      localHour = hourPart ? parseInt(hourPart, 10) : 0;
    } catch {
      localHour = Math.floor(midBeijingHour);
    }

    const isDay = localHour >= 6 && localHour < 18;
    
    let label = '';
    if (language === 'zh') {
      label = `${isDay ? '日' : '夜'}${type === 'feng' ? '峰' : '谷'}`;
    } else if (language === 'en') {
      label = `${isDay ? 'Day' : 'Night'} ${type === 'feng' ? 'Peak' : 'Valley'}`;
    } else {
      label = `${isDay ? 'День' : 'Ночь'} ${type === 'feng' ? 'Пик' : 'Скидка'}`;
    }

    return { isDay, label };
  };

  const seg1Dn = getSegmentDayNight(4.5, 'gu');
  const seg2Dn = getSegmentDayNight(10.5, 'feng');
  const seg3Dn = getSegmentDayNight(13.0, 'gu');
  const seg4Dn = getSegmentDayNight(16.0, 'feng');
  const seg5Dn = getSegmentDayNight(21.0, 'gu');

  // Single clean continuous 24-Hour Timeline Segments (UTC+8):
  const segments = [
    {
      id: 'gu-1',
      widthPercent: 37.5,
      type: 'gu' as const,
      isDay: seg1Dn.isDay,
      label: seg1Dn.label,
      isActive: beijingHour >= 0 && beijingHour < 9,
    },
    {
      id: 'feng-1',
      widthPercent: 12.5,
      type: 'feng' as const,
      isDay: seg2Dn.isDay,
      label: seg2Dn.label,
      isActive: beijingHour >= 9 && beijingHour < 12,
    },
    {
      id: 'gu-2',
      widthPercent: 8.333,
      type: 'gu' as const,
      isDay: seg3Dn.isDay,
      label: seg3Dn.label,
      isActive: beijingHour >= 12 && beijingHour < 14,
    },
    {
      id: 'feng-2',
      widthPercent: 16.667,
      type: 'feng' as const,
      isDay: seg4Dn.isDay,
      label: seg4Dn.label,
      isActive: beijingHour >= 14 && beijingHour < 18,
    },
    {
      id: 'gu-3',
      widthPercent: 25.0,
      type: 'gu' as const,
      isDay: seg5Dn.isDay,
      label: seg5Dn.label,
      isActive: beijingHour >= 18 && beijingHour < 24,
    },
  ];

  // Ruler timestamp markings below the single timeline
  const rulerTicks = [
    { label: t.tick0, percent: 0, type: 'default' },
    { label: t.tick9, percent: 37.5, type: 'feng' },
    { label: t.tick12, percent: 50.0, type: 'gu' },
    { label: t.tick14, percent: 58.333, type: 'feng' },
    { label: t.tick18, percent: 75.0, type: 'gu' },
    { label: t.tick24, percent: 100, type: 'default' },
  ];

  // Current Needle Position
  const needlePercent = Math.min(100, Math.max(0, phaseInfo.dayProgressPercent));
  let tagTranslate = '-translate-x-1/2';
  if (needlePercent < 12) {
    tagTranslate = 'translate-x-0';
  } else if (needlePercent > 88) {
    tagTranslate = '-translate-x-full';
  }

  return (
    <section className="relative w-full mb-6">
      {/* Main Status Card */}
      <div 
        className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 border transition-all duration-300 ${
          isGu 
            ? 'bg-gradient-to-br from-emerald-950/40 via-slate-900/90 to-cyan-950/40 border-emerald-500/40 shadow-[0_0_40px_-15px_rgba(16,185,129,0.3)]'
            : 'bg-gradient-to-br from-amber-950/30 via-slate-900/90 to-orange-950/30 border-amber-500/40 shadow-[0_0_40px_-15px_rgba(245,158,11,0.3)]'
        }`}
      >
        {/* Ambient Glow */}
        <div className={`absolute -right-16 -top-16 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-25 ${
          isGu ? 'bg-emerald-500' : 'bg-amber-500'
        }`} />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Left: Avatar & Character Status */}
          <div className="flex items-center gap-5 sm:gap-6">
            <div className={`relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-3xl p-0.5 shadow-xl flex items-center justify-center ${
              isGu 
                ? 'bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400' 
                : 'bg-gradient-to-tr from-amber-500 via-orange-400 to-yellow-300'
            }`}>
              <div className="w-full h-full rounded-[22px] bg-slate-950 flex flex-col items-center justify-center p-2 text-center">
                {isGu ? (
                  <>
                    <Moon className="w-8 h-8 text-emerald-400 mb-1 animate-pulse" />
                    <span className="text-[10px] font-bold text-emerald-300 tracking-wider">
                      {language === 'zh' ? '谷时 5折' : language === 'en' ? '50% Off' : 'Скидка 50%'}
                    </span>
                  </>
                ) : (
                  <>
                    <Sun className="w-8 h-8 text-amber-400 mb-1 animate-spin-slow" />
                    <span className="text-[10px] font-bold text-amber-300 tracking-wider">
                      {language === 'zh' ? '高峰原价' : language === 'en' ? 'Standard' : 'Пик 100%'}
                    </span>
                  </>
                )}
              </div>

              {/* Status Ping */}
              <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-950 ${
                isGu ? 'bg-emerald-400 animate-ping' : 'bg-amber-400 animate-ping'
              }`} />
              <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-950 ${
                isGu ? 'bg-emerald-400' : 'bg-amber-400'
              }`} />
            </div>

            {/* Title, Badge & Tagline */}
            <div>
              <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-2">
                  <span>{phaseInfo.characterName}</span>
                </h2>
                <span className={`px-2.5 py-1 rounded-xl text-xs font-bold border tracking-wide uppercase ${
                  isGu
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}>
                  {phaseInfo.phaseName}
                </span>
                <span className="text-xs font-mono text-slate-400 px-2 py-0.5 rounded-lg bg-slate-800/80 border border-slate-700">
                  {phaseInfo.beijingWeekdayName}
                </span>
              </div>

              <p className="text-sm sm:text-base font-medium text-slate-300 flex items-center gap-2">
                <span>{phaseInfo.tagline}</span>
                <span className="text-slate-500">·</span>
                <span className={`font-semibold ${isGu ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {phaseInfo.discountRate}
                </span>
              </p>

              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                {phaseInfo.description}
              </p>
            </div>
          </div>

          {/* Right: Countdown Widget */}
          <div className="w-full lg:w-auto flex flex-col items-start lg:items-end justify-center pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800/80">
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/90 w-full lg:min-w-[280px]">
              <div className="flex items-center justify-between gap-2 text-xs text-slate-400 mb-1.5">
                <span className="flex items-center gap-1.5 font-medium min-w-0 flex-1 truncate pr-1">
                  <Timer className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                  <span className="truncate">{t.targetNext}：{phaseInfo.nextCharacterName}</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 flex-shrink-0">
                  {t.countdownLabel}
                </span>
              </div>

              <div className="font-mono text-3xl font-extrabold tracking-tight text-white mb-1">
                {phaseInfo.countdownFormatted}
              </div>

              <div className="text-[11px] text-slate-400 flex items-center justify-between gap-2">
                <span className="flex-shrink-0">{t.nextPhaseLabel}</span>
                <span className="font-mono font-semibold text-slate-300 min-w-0 flex-1 text-right truncate">
                  {phaseInfo.nextPhaseName}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Single 24-Hour Visual Timeline */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          {/* Header */}
          <div className="flex items-center justify-between text-xs text-slate-300 mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <span className="font-bold text-white text-sm whitespace-nowrap">{t.timelineTitle}</span>
              <span className="text-[11px] text-slate-400 whitespace-nowrap">{t.timelineBenchmark}</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 font-mono text-xs">
              <div className="flex items-center gap-1.5 text-amber-300 whitespace-nowrap">
                <div className="w-2.5 h-2.5 rounded bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.6)] flex-shrink-0" />
                <span>{t.legendPeak}</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-300 whitespace-nowrap">
                <div className="w-2.5 h-2.5 rounded bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)] flex-shrink-0" />
                <span>{t.legendValley}</span>
              </div>
            </div>
          </div>

          {/* Only Single Continuous Timeline Bar */}
          <div className="relative pt-7 pb-2 select-none">
            {/* Real-time Needle & Top Indicator Badge */}
            <div 
              style={{ left: `${needlePercent}%` }}
              className="absolute top-0 bottom-7 w-0.5 bg-blue-400 z-30 pointer-events-none transition-all duration-300"
            >
              {/* Floating current time tag */}
              <div 
                className={`absolute -top-7 ${tagTranslate} whitespace-nowrap bg-blue-600 text-white font-mono text-[10px] font-black px-2 py-0.5 rounded-md shadow-lg border border-blue-400 flex items-center gap-1 z-40`}
              >
                <span>{language === 'zh' ? '北京' : language === 'en' ? 'Beijing' : 'Пекин'} {phaseInfo.beijingTimeString}</span>
                <span className="text-[9px] px-1 rounded bg-blue-800 text-blue-200">
                  {isGu ? `${t.valleyName} 50%` : `${t.peakName} 100%`}
                </span>
              </div>

              {/* Pointer Triangle Marker */}
              <div className="absolute top-7 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-blue-400"></div>
            </div>

            {/* Single Continuous 24-Hour Bar */}
            <div className="relative w-full h-12 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center shadow-inner">
              {segments.map((seg) => {
                const isFengType = seg.type === 'feng';
                const isNarrow = seg.widthPercent < 15;

                return (
                  <div
                    key={seg.id}
                    style={{ width: `${seg.widthPercent}%` }}
                    className={`h-full relative flex flex-col justify-center items-center px-0.5 sm:px-1 border-r border-slate-950/80 transition-all duration-200 overflow-hidden ${
                      isFengType
                        ? seg.isActive
                          ? 'bg-amber-600/40 ring-2 ring-inset ring-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                          : 'bg-amber-950/40'
                        : seg.isActive
                          ? 'bg-emerald-600/40 ring-2 ring-inset ring-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                          : 'bg-emerald-950/40'
                    }`}
                  >
                    {/* Active pulsating shimmer */}
                    {seg.isActive && (
                      <div className={`absolute inset-0 opacity-20 animate-pulse ${
                        isFengType ? 'bg-amber-400' : 'bg-emerald-400'
                      }`} />
                    )}

                    {/* Segment Label Inside Bar: ONLY current timezone day/night + peak/valley */}
                    <div className="relative z-10 flex items-center justify-center text-center max-w-full px-1">
                      <span className={`text-[11px] sm:text-xs font-black truncate max-w-full flex items-center gap-1 ${
                        isFengType ? 'text-amber-300' : 'text-emerald-300'
                      }`}>
                        {seg.isDay ? (
                          <Sun className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
                        ) : (
                          <Moon className="w-3.5 h-3.5 flex-shrink-0 text-blue-300" />
                        )}
                        <span className="truncate tracking-wider">{seg.label}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Clear Non-overlapping Time Axis Ticks */}
            <div className="relative w-full h-7 mt-2 text-[10px] font-mono text-slate-400">
              {rulerTicks.map((tick) => {
                const isLeftEdge = tick.percent === 0;
                const isRightEdge = tick.percent === 100;
                const isFengTick = tick.type === 'feng';
                const isGuTick = tick.type === 'gu';

                let alignClass = '-translate-x-1/2 items-center';
                if (isLeftEdge) alignClass = 'translate-x-0 items-start';
                if (isRightEdge) alignClass = '-translate-x-full items-end';

                return (
                  <div
                    key={tick.label}
                    style={{ left: `${tick.percent}%` }}
                    className={`absolute flex flex-col ${alignClass}`}
                  >
                    <div className="w-0.5 h-1.5 mb-0.5 bg-slate-700" />
                    <span className={`whitespace-nowrap ${
                      isFengTick
                        ? 'text-amber-300 font-bold'
                        : isGuTick
                          ? 'text-emerald-300 font-bold'
                          : 'text-slate-500'
                    }`}>
                      {tick.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Collapsible Pricing Rule & Best Practice Guide */}
          <div className="mt-3 pt-3 border-t border-slate-800/50">
            <button
              id="toggle-meme-info-button"
              onClick={() => setShowMemeInfo(!showMemeInfo)}
              className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              <Info className="w-3.5 h-3.5 text-blue-400" />
              <span>{t.ruleGuideBtn}</span>
              {showMemeInfo ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showMemeInfo && (
              <div className="mt-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-2.5 animate-in fade-in duration-200">
                <div className="font-semibold text-blue-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  {t.ruleGuideTitle}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-200 space-y-1">
                    <p className="font-bold flex items-center gap-1 text-amber-300">
                      <Sun className="w-3.5 h-3.5" /> {t.rulePeakTitle}
                    </p>
                    <p className="text-[11px] leading-relaxed text-amber-200/90">
                      {t.rulePeakDesc}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-emerald-200 space-y-1">
                    <p className="font-bold flex items-center gap-1 text-emerald-300">
                      <Moon className="w-3.5 h-3.5" /> {t.ruleValleyTitle}
                    </p>
                    <p className="text-[11px] leading-relaxed text-emerald-200/90">
                      {t.ruleValleyDesc}
                    </p>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-800/40 text-blue-200 flex items-center gap-2 text-[11px]">
                  <TrendingDown className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span><strong>{t.ruleBestPractice}</strong></span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
