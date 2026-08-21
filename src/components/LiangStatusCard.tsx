import React, { useState } from 'react';
import { 
  Zap, 
  Moon, 
  Sun, 
  Sparkles, 
  Info, 
  Clock, 
  ArrowRight, 
  TrendingDown, 
  ShieldCheck, 
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ClockTheme, PhaseInfo } from '../types';

interface LiangStatusCardProps {
  phaseInfo: PhaseInfo;
  currentTheme: ClockTheme;
}

export const LiangStatusCard: React.FC<LiangStatusCardProps> = ({
  phaseInfo,
  currentTheme,
}) => {
  const [showMemeInfo, setShowMemeInfo] = useState(false);
  const isGu = phaseInfo.currentPhase === 'gu';
  const isWeekend = phaseInfo.isWeekend;

  // Calculate timeline percentages for 24-hour visualization
  // 00:00 - 09:00 = 9h (37.5%) [谷时]
  // 09:00 - 12:00 = 3h (12.5%) [峰时]
  // 12:00 - 14:00 = 2h (8.333%) [谷时]
  // 14:00 - 18:00 = 4h (16.667%) [峰时]
  // 18:00 - 24:00 = 6h (25.0%) [谷时]
  const guNightMorningPercent = (9 / 24) * 100;
  const fengMorningPercent = (3 / 24) * 100;
  const guNoonPercent = (2 / 24) * 100;
  const fengAfternoonPercent = (4 / 24) * 100;
  const guNightPercent = (6 / 24) * 100;

  return (
    <section className="relative w-full mb-6">
      {/* Main Status Hero Card */}
      <div 
        className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 border transition-all duration-300 ${
          isGu 
            ? 'bg-gradient-to-br from-emerald-950/40 via-slate-900/90 to-cyan-950/40 border-emerald-500/40 shadow-[0_0_40px_-15px_rgba(16,185,129,0.3)]'
            : 'bg-gradient-to-br from-amber-950/30 via-slate-900/90 to-orange-950/30 border-amber-500/40 shadow-[0_0_40px_-15px_rgba(245,158,11,0.3)]'
        }`}
      >
        {/* Background Ambient Glow */}
        <div className={`absolute -right-16 -top-16 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-25 ${
          isGu ? 'bg-emerald-500' : 'bg-amber-500'
        }`} />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Left: Character Avatar & Big Name Display */}
          <div className="flex items-center gap-5 sm:gap-6">
            {/* Dynamic Avatar / Character Badge */}
            <div className={`relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-3xl p-0.5 shadow-xl flex items-center justify-center ${
              isGu 
                ? 'bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400' 
                : 'bg-gradient-to-tr from-amber-500 via-orange-400 to-yellow-300'
            }`}>
              <div className="w-full h-full rounded-[22px] bg-slate-950 flex flex-col items-center justify-center p-2 text-center">
                {isGu ? (
                  <>
                    <Moon className="w-8 h-8 text-emerald-400 mb-1 animate-pulse" />
                    <span className="text-[10px] font-bold text-emerald-300 tracking-wider">谷时特惠</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-8 h-8 text-amber-400 mb-1 animate-spin-slow" />
                    <span className="text-[10px] font-bold text-amber-300 tracking-wider">高峰原价</span>
                  </>
                )}
              </div>

              {/* Status Dot */}
              <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-950 ${
                isGu ? 'bg-emerald-400 animate-ping' : 'bg-amber-400 animate-ping'
              }`} />
              <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-950 ${
                isGu ? 'bg-emerald-400' : 'bg-amber-400'
              }`} />
            </div>

            {/* Names & Taglines */}
            <div>
              <div className="flex items-center gap-3 mb-1 flex-wrap">
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-2">
                  <span>{phaseInfo.characterName}</span>
                </h2>
                <span className={`px-2.5 py-1 rounded-xl text-xs font-bold border tracking-wide uppercase ${
                  isGu
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}>
                  {phaseInfo.phaseName}
                </span>
                {isWeekend && (
                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    {phaseInfo.beijingWeekdayName} · 周末全天 5 折
                  </span>
                )}
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

          {/* Right: Countdown to Next Transition */}
          <div className="w-full lg:w-auto flex flex-col items-start lg:items-end justify-center pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800/80">
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/90 w-full lg:min-w-[280px]">
              <div className="flex items-center justify-between gap-2 text-xs text-slate-400 mb-2">
                <span className="flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  切换目标：{phaseInfo.nextPhaseName}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                  倒计时
                </span>
              </div>

              <div className="font-mono text-3xl font-extrabold tracking-tight text-white mb-1">
                {phaseInfo.countdownFormatted}
              </div>

              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>当前阶段：</span>
                <span className="font-mono font-semibold text-slate-300">
                  {phaseInfo.currentPeriodName}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 24-Hour Visual Day Timeline */}
        <div className="mt-6 pt-5 border-t border-slate-800/60">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              24小时峰谷时间轴 (北京时间 {phaseInfo.beijingWeekdayName})
            </span>
            <span className="font-mono text-slate-400">
              当前指针：{phaseInfo.beijingTimeString} ({phaseInfo.dayProgressPercent.toFixed(1)}%)
            </span>
          </div>

          {/* Multi-segment Timeline Bar */}
          <div className="relative w-full h-8 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center">
            {isWeekend ? (
              // Weekend: 100% Gu (50% discount)
              <div className="w-full h-full bg-emerald-950/70 flex items-center justify-center relative">
                <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <Moon className="w-3.5 h-3.5" />
                  周末全天空闲特惠时段 (梁文谷 · 50% 半价)
                </span>
              </div>
            ) : (
              // Weekday: 5 segments
              <>
                {/* 00:00 - 09:00: 梁文谷 (凌晨夜间 5折) */}
                <div 
                  style={{ width: `${guNightMorningPercent}%` }} 
                  className="h-full bg-emerald-950/60 border-r border-slate-800/80 flex items-center justify-center relative group"
                  title="00:00 - 09:00 梁文谷 (夜间 5折)"
                >
                  <span className="text-[10px] font-bold text-emerald-400/80 truncate px-1 flex items-center gap-1">
                    <Moon className="w-2.5 h-2.5" />
                    谷时 0-9h (5折)
                  </span>
                </div>

                {/* 09:00 - 12:00: 梁文峰 (上午高峰 原价) */}
                <div 
                  style={{ width: `${fengMorningPercent}%` }} 
                  className="h-full bg-amber-950/60 border-r border-slate-800/80 flex items-center justify-center relative group"
                  title="09:00 - 12:00 梁文峰 (上午高峰 原价)"
                >
                  <span className="text-[10px] font-bold text-amber-300 truncate px-1 flex items-center gap-1">
                    <Sun className="w-2.5 h-2.5" />
                    9-12h 峰时
                  </span>
                </div>

                {/* 12:00 - 14:00: 梁文谷 (午间空闲 5折) */}
                <div 
                  style={{ width: `${guNoonPercent}%` }} 
                  className="h-full bg-emerald-950/60 border-r border-slate-800/80 flex items-center justify-center relative group"
                  title="12:00 - 14:00 梁文谷 (午间 5折)"
                >
                  <span className="text-[10px] font-bold text-emerald-400/80 truncate px-0.5 flex items-center gap-1">
                    <Moon className="w-2.5 h-2.5" />
                    12-14h 谷
                  </span>
                </div>

                {/* 14:00 - 18:00: 梁文峰 (下午高峰 原价) */}
                <div 
                  style={{ width: `${fengAfternoonPercent}%` }} 
                  className="h-full bg-amber-950/60 border-r border-slate-800/80 flex items-center justify-center relative group"
                  title="14:00 - 18:00 梁文峰 (下午高峰 原价)"
                >
                  <span className="text-[10px] font-bold text-amber-300 truncate px-1 flex items-center gap-1">
                    <Sun className="w-2.5 h-2.5" />
                    14-18h 峰时
                  </span>
                </div>

                {/* 18:00 - 24:00: 梁文谷 (晚间夜间 5折) */}
                <div 
                  style={{ width: `${guNightPercent}%` }} 
                  className="h-full bg-emerald-950/60 flex items-center justify-center relative group"
                  title="18:00 - 24:00 梁文谷 (晚间 5折)"
                >
                  <span className="text-[10px] font-bold text-emerald-400/80 truncate px-1 flex items-center gap-1">
                    <Moon className="w-2.5 h-2.5" />
                    18-24h 谷时 (5折)
                  </span>
                </div>
              </>
            )}

            {/* Current Position Marker Needle */}
            <div 
              style={{ left: `${phaseInfo.dayProgressPercent}%` }}
              className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_12px_#ffffff] z-20 transition-all duration-300 pointer-events-none"
            >
              <div className="absolute -top-1.5 -left-1.5 w-4 h-4 rounded-full bg-white border-2 border-blue-600 shadow-md"></div>
            </div>
          </div>

          {/* Time markers */}
          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1.5 px-0.5 flex-wrap gap-1">
            <span>00:00</span>
            <span className="text-amber-400/90 font-bold">09:00 (上午高峰)</span>
            <span className="text-emerald-400/90 font-bold">12:00 (午间谷时)</span>
            <span className="text-amber-400/90 font-bold">14:00 (下午高峰)</span>
            <span className="text-emerald-400/90 font-bold">18:00 (夜间谷时)</span>
            <span>24:00</span>
          </div>
        </div>

        {/* Origin & Meme explanation toggle */}
        <div className="mt-4 pt-3 border-t border-slate-800/50">
          <button
            id="toggle-meme-info-button"
            onClick={() => setShowMemeInfo(!showMemeInfo)}
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <Info className="w-3.5 h-3.5 text-blue-400" />
            <span>为什么叫「梁文峰」和「梁文谷」？点击查看官方峰谷规则与省钱指南</span>
            {showMemeInfo ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showMemeInfo && (
            <div className="mt-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-2.5 animate-in fade-in duration-200">
              <div className="font-semibold text-blue-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                官方峰谷时间段划分与计费规则
              </div>
              <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-200 space-y-1">
                <p className="font-bold flex items-center gap-1 text-amber-300">
                  <Sun className="w-3.5 h-3.5" /> 高峰时段（梁文峰 · 原价 100%）：
                </p>
                <p className="text-[11px] leading-relaxed text-amber-200/90">
                  北京时间工作日 <strong>09:00 - 12:00</strong> 以及 <strong>14:00 - 18:00</strong>。此期间为 API 调用的繁忙时段，按标准费率计费。
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-emerald-200 space-y-1">
                <p className="font-bold flex items-center gap-1 text-emerald-300">
                  <Moon className="w-3.5 h-3.5" /> 空闲时段 / 谷时（梁文谷 · 半价 50% 特惠）：
                </p>
                <p className="text-[11px] leading-relaxed text-emerald-200/90">
                  除上述高峰外的所有时间，包括<strong>午间 (12:00-14:00)、晚间夜间 (18:00-次日 09:00)、周末（周六、周日全天）及节假日</strong>。此期间 API 调用价格立减一半！
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-800/40 text-blue-200 flex items-center gap-2 text-[11px]">
                <TrendingDown className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span><strong>省钱攻略：</strong> 将非实时的批量评测、离线翻译、数据清洗或微调任务调度在「梁文谷」空闲时段或周末运行，成本直接腰斩 50%！</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
