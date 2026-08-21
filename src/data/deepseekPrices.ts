import { ModelPricing, TimezoneOption, ClockTheme } from '../types';

export const DEEPSEEK_MODELS: ModelPricing[] = [
  {
    modelId: 'deepseek-v4-flash',
    modelName: 'DeepSeek-V4 Flash',
    description: '新一代极速轻量旗舰，超高吞吐与极低延迟，针对高频业务与实时场景极致优化',
    contextWindow: '128K',
    maxOutput: '16K',
    cny: {
      feng: {
        inputMiss: 0.5, // 峰时 ¥0.50 / 1M
        inputHit: 0.05, // 峰时 ¥0.05 / 1M
        output: 1.0,    // 峰时 ¥1.00 / 1M
      },
      gu: {
        inputMiss: 0.25, // 谷时 50% 折扣 ¥0.25 / 1M
        inputHit: 0.025, // 谷时 50% 折扣 ¥0.025 / 1M
        output: 0.5,     // 谷时 50% 折扣 ¥0.50 / 1M
      },
    },
    usd: {
      feng: {
        inputMiss: 0.07,
        inputHit: 0.007,
        output: 0.14,
      },
      gu: {
        inputMiss: 0.035,
        inputHit: 0.0035,
        output: 0.07,
      },
    },
  },
  {
    modelId: 'deepseek-v4-pro',
    modelName: 'DeepSeek-V4 Pro',
    description: '新一代全能专业旗舰，兼具极致通用编程、多模态解析与深度逻辑推理',
    contextWindow: '128K',
    maxOutput: '16K',
    cny: {
      feng: {
        inputMiss: 2.0, // 峰时 ¥2.00 / 1M
        inputHit: 0.2,  // 峰时 ¥0.20 / 1M
        output: 6.0,    // 峰时 ¥6.00 / 1M
      },
      gu: {
        inputMiss: 1.0, // 谷时 50% 折扣 ¥1.00 / 1M
        inputHit: 0.1,  // 谷时 50% 折扣 ¥0.10 / 1M
        output: 3.0,    // 谷时 50% 折扣 ¥3.00 / 1M
      },
    },
    usd: {
      feng: {
        inputMiss: 0.28,
        inputHit: 0.028,
        output: 0.84,
      },
      gu: {
        inputMiss: 0.14,
        inputHit: 0.014,
        output: 0.42,
      },
    },
  },
];

export const AVAILABLE_TIMEZONES: TimezoneOption[] = [
  { id: 'local', name: '系统本地时区', city: '本地', timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Shanghai', offsetLabel: 'Local' },
  { id: 'beijing', name: '中国标准时间 (北京时间 / UTC+8)', city: '北京 / 上海', timeZone: 'Asia/Shanghai', offsetLabel: 'UTC+8' },
  { id: 'tokyo', name: '日本标准时间 (JST / UTC+9)', city: '东京', timeZone: 'Asia/Tokyo', offsetLabel: 'UTC+9' },
  { id: 'hongkong', name: '香港时间 (HKT / UTC+8)', city: '香港', timeZone: 'Asia/Hong_Kong', offsetLabel: 'UTC+8' },
  { id: 'singapore', name: '新加坡时间 (SGT / UTC+8)', city: '新加坡', timeZone: 'Asia/Singapore', offsetLabel: 'UTC+8' },
  { id: 'london', name: '英国格林威治时间 (GMT/BST)', city: '伦敦', timeZone: 'Europe/London', offsetLabel: 'UTC+0/1' },
  { id: 'paris', name: '中欧时间 (CET/CEST)', city: '巴黎 / 柏林', timeZone: 'Europe/Paris', offsetLabel: 'UTC+1/2' },
  { id: 'newyork', name: '美国东部时间 (ET / EST/EDT)', city: '纽约', timeZone: 'America/New_York', offsetLabel: 'UTC-5/4' },
  { id: 'sanfrancisco', name: '美国太平洋时间 (PT / PST/PDT)', city: '旧金山 / 硅谷', timeZone: 'America/Los_Angeles', offsetLabel: 'UTC-8/7' },
];

export const THEMES: ClockTheme[] = [
  {
    id: 'deepseek-dark',
    name: 'DeepSeek 深海夜空',
    bgClass: 'from-slate-950 via-slate-900 to-blue-950/40 text-slate-100',
    cardBgClass: 'bg-slate-900/80 backdrop-blur-md',
    borderClass: 'border-slate-800/80 hover:border-blue-500/40',
    accentText: 'text-blue-400',
    glowClass: 'shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)]',
    badgeBg: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
    textColor: 'text-white',
    secondaryText: 'text-slate-400',
  },
  {
    id: 'oled-black',
    name: 'OLED 极黑流光',
    bgClass: 'from-black via-zinc-950 to-black text-zinc-100',
    cardBgClass: 'bg-zinc-900/90 backdrop-blur-md',
    borderClass: 'border-zinc-800 hover:border-zinc-600',
    accentText: 'text-emerald-400',
    glowClass: 'shadow-[0_0_50px_-12px_rgba(16,185,129,0.25)]',
    badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    textColor: 'text-zinc-50',
    secondaryText: 'text-zinc-400',
  },
  {
    id: 'cyberpunk',
    name: '赛博霓虹',
    bgClass: 'from-slate-950 via-purple-950/30 to-indigo-950/40 text-purple-100',
    cardBgClass: 'bg-slate-900/85 backdrop-blur-md',
    borderClass: 'border-purple-800/50 hover:border-cyan-400/50',
    accentText: 'text-cyan-400',
    glowClass: 'shadow-[0_0_50px_-12px_rgba(168,85,247,0.35)]',
    badgeBg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    textColor: 'text-white',
    secondaryText: 'text-purple-300/70',
  },
  {
    id: 'amber-glow',
    name: '复古琥珀光',
    bgClass: 'from-zinc-950 via-amber-950/20 to-stone-950 text-amber-100',
    cardBgClass: 'bg-stone-900/85 backdrop-blur-md',
    borderClass: 'border-amber-900/40 hover:border-amber-500/40',
    accentText: 'text-amber-400',
    glowClass: 'shadow-[0_0_50px_-12px_rgba(245,158,11,0.25)]',
    badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    textColor: 'text-amber-50',
    secondaryText: 'text-amber-200/60',
  },
  {
    id: 'porcelain-light',
    name: '极简素雅白',
    bgClass: 'from-slate-100 via-slate-50 to-blue-50 text-slate-800',
    cardBgClass: 'bg-white/90 backdrop-blur-md shadow-lg shadow-slate-200/60',
    borderClass: 'border-slate-200 hover:border-blue-400',
    accentText: 'text-blue-600',
    glowClass: 'shadow-[0_10px_30px_-10px_rgba(59,130,246,0.15)]',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
    textColor: 'text-slate-900',
    secondaryText: 'text-slate-500',
  },
];
