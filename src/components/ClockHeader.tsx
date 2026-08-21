import React, { useState } from 'react';
import { 
  Globe, 
  Clock, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Palette, 
  ChevronDown, 
  Calendar, 
  Languages, 
  Check,
  Tv
} from 'lucide-react';
import { AVAILABLE_TIMEZONES, THEMES } from '../data/deepseekPrices';
import { ClockTheme, Language, PhaseInfo, TimezoneOption } from '../types';
import { formatTimeInZone, getLunarInfo } from '../utils/timeUtils';
import { TRANSLATIONS } from '../i18n/translations';
import appIconImg from '../assets/images/deepseek_clock_icon_1787300567789.jpg';

interface ClockHeaderProps {
  now: Date;
  currentTimezone: TimezoneOption;
  onTimezoneChange: (tz: TimezoneOption) => void;
  currentTheme: ClockTheme;
  onThemeChange: (theme: ClockTheme) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  use24h: boolean;
  onToggle24h: () => void;
  showMs: boolean;
  onToggleMs: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenFullscreen: () => void;
  onMinimizeToMini: () => void;
  phaseInfo: PhaseInfo;
}

const LANGUAGE_OPTIONS: { id: Language; label: string; flag: string; short: string }[] = [
  { id: 'zh', label: '中文 (简体)', flag: '🇨🇳', short: '中' },
  { id: 'en', label: 'English', flag: '🇺🇸', short: 'EN' },
  { id: 'ru', label: 'Русский', flag: '🇷🇺', short: 'RU' },
];

export const ClockHeader: React.FC<ClockHeaderProps> = ({
  now,
  currentTimezone,
  onTimezoneChange,
  currentTheme,
  onThemeChange,
  language,
  onLanguageChange,
  use24h,
  onToggle24h,
  showMs,
  onToggleMs,
  soundEnabled,
  onToggleSound,
  onOpenFullscreen,
  onMinimizeToMini,
  phaseInfo,
}) => {
  const [showTzDropdown, setShowTzDropdown] = useState(false);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const t = TRANSLATIONS[language];
  const { timeStr, dateStr, offsetPart } = formatTimeInZone(now, currentTimezone.timeZone, use24h, language);
  const lunar = getLunarInfo(now);

  const msString = String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0');

  // Split time parts for enhanced digit rendering
  const is12Hour = !use24h;
  let mainTime = timeStr;
  let ampm = '';
  if (is12Hour) {
    if (timeStr.includes('AM') || timeStr.includes('PM')) {
      const parts = timeStr.split(' ');
      mainTime = parts[0];
      ampm = parts[1] || '';
    } else if (timeStr.startsWith('上午') || timeStr.startsWith('下午')) {
      ampm = timeStr.slice(0, 2);
      mainTime = timeStr.slice(2).trim();
    }
  }

  const isGu = phaseInfo.currentPhase === 'gu';
  const currentLangMeta = LANGUAGE_OPTIONS.find((l) => l.id === language) || LANGUAGE_OPTIONS[0];

  const tzDisplayName = currentTimezone.names?.[language] || currentTimezone.name;
  const tzDisplayCity = currentTimezone.cities?.[language] || currentTimezone.city;
  const themeDisplayName = currentTheme.names?.[language] || currentTheme.name;

  return (
    <header className="relative w-full mb-6">
      {/* Top Utility Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/60">
        {/* Left: Brand with App Icon + Timezone + Language Switcher */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-900/90 border border-blue-500/30 text-blue-400 text-xs font-semibold whitespace-nowrap shadow-md">
            <img 
              src={appIconImg} 
              alt="DeepSeek Clock Logo" 
              className="w-5 h-5 rounded-lg object-cover ring-1 ring-cyan-400/40 shadow"
            />
            <span className="font-bold text-slate-100">{t.appName}</span>
          </div>

          {/* Timezone Switcher Dropdown */}
          <div className="relative">
            <button
              id="timezone-select-button"
              onClick={() => {
                setShowTzDropdown(!showTzDropdown);
                setShowThemeDropdown(false);
                setShowLangDropdown(false);
              }}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs text-slate-200 transition-all font-medium cursor-pointer shadow-sm"
            >
              <Globe className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
              <span className="max-w-[100px] sm:max-w-none truncate">{tzDisplayCity}</span>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-900/60 px-1.5 py-0.5 rounded flex-shrink-0">
                {offsetPart || currentTimezone.offsetLabel}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400 flex-shrink-0" />
            </button>

            {showTzDropdown && (
              <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700 shadow-2xl p-2 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-2 py-1.5 text-[11px] font-medium text-slate-400 border-b border-slate-800">
                  {t.selectTimezoneHint}
                </div>
                <div className="max-h-60 overflow-y-auto py-1 space-y-1">
                  {AVAILABLE_TIMEZONES.map((tz) => {
                    const itemCity = tz.cities?.[language] || tz.city;
                    const itemName = tz.names?.[language] || tz.name;
                    return (
                      <button
                        key={tz.id}
                        onClick={() => {
                          onTimezoneChange(tz);
                          setShowTzDropdown(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                          currentTimezone.id === tz.id
                            ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                            : 'hover:bg-slate-800/60 text-slate-300'
                        }`}
                      >
                        <div className="flex flex-col min-w-0 pr-2">
                          <span className="font-semibold truncate">{itemCity}</span>
                          <span className="text-[10px] text-slate-400 truncate">{itemName}</span>
                        </div>
                        <span className="text-[10px] font-mono bg-slate-800/80 px-1.5 py-0.5 rounded text-slate-400 flex-shrink-0">
                          {tz.offsetLabel}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Language Switcher Dropdown */}
          <div className="relative">
            <button
              id="language-select-button"
              onClick={() => {
                setShowLangDropdown(!showLangDropdown);
                setShowTzDropdown(false);
                setShowThemeDropdown(false);
              }}
              title={t.language}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-blue-500/30 hover:border-blue-400 text-xs font-semibold text-white transition-all cursor-pointer shadow-sm whitespace-nowrap"
            >
              <Languages className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
              <span>{currentLangMeta.flag}</span>
              <span className="hidden sm:inline">{currentLangMeta.label}</span>
              <span className="inline sm:hidden">{currentLangMeta.short}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 flex-shrink-0" />
            </button>

            {showLangDropdown && (
              <div className="absolute left-0 sm:left-auto sm:right-auto mt-2 w-48 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700 shadow-2xl p-1.5 z-50 text-xs animate-in fade-in duration-150">
                <div className="px-2 py-1 text-[11px] font-medium text-slate-400 border-b border-slate-800 mb-1">
                  {t.language}
                </div>
                {LANGUAGE_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      onLanguageChange(opt.id);
                      setShowLangDropdown(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                      language === opt.id
                        ? 'bg-blue-600/20 text-blue-400 font-bold border border-blue-500/30'
                        : 'hover:bg-slate-800/70 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{opt.flag}</span>
                      <span>{opt.label}</span>
                    </div>
                    {language === opt.id && <Check className="w-3.5 h-3.5 text-blue-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* 12h / 24h toggle */}
          <button
            id="toggle-24h-button"
            onClick={onToggle24h}
            title={t.toggle24hTitle}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800/70 hover:bg-slate-700 border border-slate-700 text-xs font-mono font-medium text-slate-300 transition-colors cursor-pointer"
          >
            {use24h ? '24H' : '12H'}
          </button>

          {/* Milliseconds toggle */}
          <button
            id="toggle-ms-button"
            onClick={onToggleMs}
            title={t.toggleMsTitle}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-mono font-medium transition-colors cursor-pointer ${
              showMs
                ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                : 'bg-slate-800/70 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
            }`}
          >
            .MS
          </button>

          {/* Sound Chime toggle */}
          <button
            id="toggle-sound-button"
            onClick={onToggleSound}
            title={soundEnabled ? t.soundEnabledTitle : t.soundDisabledTitle}
            className={`p-2 rounded-xl border text-xs transition-colors cursor-pointer ${
              soundEnabled
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-800/70 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Theme Selector Dropdown */}
          <div className="relative">
            <button
              id="theme-select-button"
              onClick={() => {
                setShowThemeDropdown(!showThemeDropdown);
                setShowTzDropdown(false);
                setShowLangDropdown(false);
              }}
              title={t.selectTheme}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/70 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 transition-colors cursor-pointer"
            >
              <Palette className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden md:inline max-w-[80px] truncate">{themeDisplayName}</span>
            </button>

            {showThemeDropdown && (
              <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700 shadow-2xl p-2 z-50 text-xs animate-in fade-in duration-150">
                <div className="px-2 py-1 text-[11px] font-medium text-slate-400 border-b border-slate-800 mb-1">
                  {t.selectTheme}
                </div>
                {THEMES.map((theme) => {
                  const tName = theme.names?.[language] || theme.name;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => {
                        onThemeChange(theme);
                        setShowThemeDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-left transition-colors cursor-pointer ${
                        currentTheme.id === theme.id
                          ? 'bg-blue-600/20 text-blue-400 font-semibold border border-blue-500/30'
                          : 'hover:bg-slate-800/60 text-slate-300'
                      }`}
                    >
                      <span>{tName}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Fullscreen Zen Mode */}
          <button
            id="fullscreen-clock-button"
            onClick={onOpenFullscreen}
            title={t.fullscreenTitle}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/25 transition-all cursor-pointer whitespace-nowrap hover:scale-105"
          >
            <Maximize2 className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="hidden sm:inline">{t.fullscreenBtn}</span>
          </button>

          {/* Minimize to Floating Mini Clock */}
          <button
            id="minimize-to-mini-button"
            onClick={onMinimizeToMini}
            title={t.minimizeTitle}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-300 hover:text-white text-xs font-semibold shadow transition-all cursor-pointer whitespace-nowrap hover:scale-105"
          >
            <Minimize2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span className="hidden sm:inline">{t.minimizeBtn}</span>
          </button>
        </div>
      </div>

      {/* Main Clock Card */}
      <div className={`mt-4 rounded-3xl p-6 sm:p-8 border transition-all duration-300 ${currentTheme.cardBgClass} ${currentTheme.borderClass} ${currentTheme.glowClass}`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left / Center: Giant Digital Clock */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            {/* Date & Calendar Row */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mb-3 text-xs sm:text-sm font-medium">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/70 border border-slate-700/60 text-slate-300">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-semibold">{dateStr}</span>
              </div>
              {language === 'zh' && (
                <div className="px-2.5 py-1 rounded-lg bg-slate-800/50 border border-slate-700/40 text-slate-400">
                  <span>{lunar.lunarStr}</span>
                  {lunar.solarTerm && <span className="ml-1 text-blue-400 font-semibold">· {lunar.solarTerm}</span>}
                </div>
              )}
            </div>

            {/* Big Digital Numbers */}
            <div className="flex items-baseline tracking-tight select-none">
              {ampm && (
                <span className="text-xl sm:text-3xl font-bold font-mono mr-2 text-slate-400">
                  {ampm}
                </span>
              )}
              <span className={`font-mono text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight ${currentTheme.accentText} drop-shadow-sm`}>
                {mainTime}
              </span>
              {showMs && (
                <span className="font-mono text-2xl sm:text-4xl lg:text-5xl font-bold ml-1.5 text-slate-400/80">
                  .{msString}
                </span>
              )}
            </div>

            {/* Timezone Details Note */}
            <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>{t.selectTimezone}: {tzDisplayName} ({offsetPart || currentTimezone.offsetLabel})</span>
            </div>
          </div>

          {/* Right: DeepSeek Server Time / Beijing Reference Mini Widget */}
          <div className="w-full md:w-auto flex flex-col items-center md:items-end justify-center">
            <div className="w-full sm:w-auto p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col gap-2.5">
              <div className="flex items-center justify-between gap-4 text-xs">
                <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  {language === 'zh' ? '北京时间 (DeepSeek 基准)' : language === 'en' ? 'Beijing Time (DeepSeek Ref)' : 'Пекинское время (База DeepSeek)'}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-blue-300 border border-slate-700">
                  UTC+8
                </span>
              </div>
              
              <div className="flex items-baseline justify-between sm:justify-end gap-3 font-mono">
                <span className="text-2xl font-bold text-slate-100">
                  {phaseInfo.beijingTimeString}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${
                  isGu 
                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' 
                    : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                }`}>
                  {isGu 
                    ? (language === 'zh' ? '🌙 谷时段 (5折)' : language === 'en' ? '🌙 Valley (50% Off)' : '🌙 Скидка (50%)') 
                    : (language === 'zh' ? '☀️ 峰时段 (原价)' : language === 'en' ? '☀️ Peak (100%)' : '☀️ Пик (100%)')}
                </span>
              </div>

              <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 flex items-center justify-between gap-2">
                <span>{language === 'zh' ? '时段判定人物：' : language === 'en' ? 'Phase Character:' : 'Текущий персонаж:'}</span>
                <span className="font-bold text-slate-200">
                  {phaseInfo.characterName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
