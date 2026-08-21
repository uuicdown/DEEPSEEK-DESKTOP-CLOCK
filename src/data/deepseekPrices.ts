import { ModelPricing, TimezoneOption, ClockTheme } from '../types';

export const DEEPSEEK_MODELS: ModelPricing[] = [
  {
    modelId: 'deepseek-v4-flash',
    modelName: 'DeepSeek-V4 Flash',
    description: '新一代极速轻量旗舰，高吞吐与极低延迟，适用于高频业务与实时场景',
    contextWindow: '128K',
    maxOutput: '16K',
    cny: {
      feng: {
        inputHit: 0.10,   // 峰时 ¥0.10 / 1M
        inputMiss: 3.0,   // 峰时 ¥3.00 / 1M
        output: 9.0,      // 峰时 ¥9.00 / 1M
      },
      gu: {
        inputHit: 0.05,   // 谷时 50% 折扣 ¥0.05 / 1M
        inputMiss: 1.5,   // 谷时 50% 折扣 ¥1.50 / 1M
        output: 4.5,      // 谷时 50% 折扣 ¥4.50 / 1M
      },
    },
    usd: {
      feng: {
        inputHit: 0.014,
        inputMiss: 0.42,
        output: 1.26,
      },
      gu: {
        inputHit: 0.007,
        inputMiss: 0.21,
        output: 0.63,
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
        inputHit: 0.30,   // 峰时 ¥0.30 / 1M
        inputMiss: 9.0,   // 峰时 ¥9.00 / 1M
        output: 27.0,     // 峰时 ¥27.00 / 1M
      },
      gu: {
        inputHit: 0.15,   // 谷时 50% 折扣 ¥0.15 / 1M
        inputMiss: 4.5,   // 谷时 50% 折扣 ¥4.50 / 1M
        output: 13.5,     // 谷时 50% 折扣 ¥13.50 / 1M
      },
    },
    usd: {
      feng: {
        inputHit: 0.042,
        inputMiss: 1.26,
        output: 3.78,
      },
      gu: {
        inputHit: 0.021,
        inputMiss: 0.63,
        output: 1.89,
      },
    },
  },
];

export const AVAILABLE_TIMEZONES: TimezoneOption[] = [
  { 
    id: 'local', 
    name: '系统本地时区', 
    city: '本地', 
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Shanghai', 
    offsetLabel: 'Local',
    names: { zh: '系统本地时区', en: 'System Local Time', ru: 'Локальное время системы' },
    cities: { zh: '本地', en: 'Local', ru: 'Локально' }
  },
  { 
    id: 'beijing', 
    name: '中国标准时间 (北京时间 / UTC+8)', 
    city: '北京 / 上海', 
    timeZone: 'Asia/Shanghai', 
    offsetLabel: 'UTC+8',
    names: { zh: '中国标准时间 (北京时间 / UTC+8)', en: 'China Standard Time (Beijing / UTC+8)', ru: 'Китайское время (Пекин / UTC+8)' },
    cities: { zh: '北京 / 上海', en: 'Beijing / Shanghai', ru: 'Пекин / Шанхай' }
  },
  { 
    id: 'moscow', 
    name: '莫斯科时间 (MSK / UTC+3)', 
    city: '莫斯科', 
    timeZone: 'Europe/Moscow', 
    offsetLabel: 'UTC+3',
    names: { zh: '莫斯科标准时间 (MSK / UTC+3)', en: 'Moscow Standard Time (MSK / UTC+3)', ru: 'Московское время (MSK / UTC+3)' },
    cities: { zh: '莫斯科', en: 'Moscow', ru: 'Москва' }
  },
  { 
    id: 'tokyo', 
    name: '日本标准时间 (JST / UTC+9)', 
    city: '东京', 
    timeZone: 'Asia/Tokyo', 
    offsetLabel: 'UTC+9',
    names: { zh: '日本标准时间 (JST / UTC+9)', en: 'Japan Standard Time (JST / UTC+9)', ru: 'Японское стандартное время (JST / UTC+9)' },
    cities: { zh: '东京', en: 'Tokyo', ru: 'Токио' }
  },
  { 
    id: 'hongkong', 
    name: '香港时间 (HKT / UTC+8)', 
    city: '香港', 
    timeZone: 'Asia/Hong_Kong', 
    offsetLabel: 'UTC+8',
    names: { zh: '香港时间 (HKT / UTC+8)', en: 'Hong Kong Time (HKT / UTC+8)', ru: 'Гонконгское время (HKT / UTC+8)' },
    cities: { zh: '香港', en: 'Hong Kong', ru: 'Гонконг' }
  },
  { 
    id: 'singapore', 
    name: '新加坡时间 (SGT / UTC+8)', 
    city: '新加坡', 
    timeZone: 'Asia/Singapore', 
    offsetLabel: 'UTC+8',
    names: { zh: '新加坡时间 (SGT / UTC+8)', en: 'Singapore Time (SGT / UTC+8)', ru: 'Сингапурское время (SGT / UTC+8)' },
    cities: { zh: '新加坡', en: 'Singapore', ru: 'Сингапур' }
  },
  { 
    id: 'london', 
    name: '英国伦敦时间 (GMT/BST)', 
    city: '伦敦', 
    timeZone: 'Europe/London', 
    offsetLabel: 'UTC+0/1',
    names: { zh: '英国伦敦时间 (GMT/BST)', en: 'London Time (GMT/BST)', ru: 'Лондонское время (GMT/BST)' },
    cities: { zh: '伦敦', en: 'London', ru: 'Лондон' }
  },
  { 
    id: 'paris', 
    name: '中欧时间 (CET/CEST)', 
    city: '巴黎 / 柏林', 
    timeZone: 'Europe/Paris', 
    offsetLabel: 'UTC+1/2',
    names: { zh: '中欧时间 (CET/CEST)', en: 'Central European Time (CET/CEST)', ru: 'Центральноевропейское время (CET/CEST)' },
    cities: { zh: '巴黎 / 柏林', en: 'Paris / Berlin', ru: 'Париж / Берлин' }
  },
  { 
    id: 'newyork', 
    name: '美国东部时间 (ET / EST/EDT)', 
    city: '纽约', 
    timeZone: 'America/New_York', 
    offsetLabel: 'UTC-5/4',
    names: { zh: '美国东部时间 (ET / EST/EDT)', en: 'Eastern Time (ET / EST/EDT)', ru: 'Североамериканское восточное время (ET)' },
    cities: { zh: '纽约', en: 'New York', ru: 'Нью-Йорк' }
  },
  { 
    id: 'sanfrancisco', 
    name: '美国太平洋时间 (PT / PST/PDT)', 
    city: '旧金山 / 硅谷', 
    timeZone: 'America/Los_Angeles', 
    offsetLabel: 'UTC-8/7',
    names: { zh: '美国太平洋时间 (PT / PST/PDT)', en: 'Pacific Time (PT / PST/PDT)', ru: 'Тихоокеанское время (PT)' },
    cities: { zh: '旧金山 / 硅谷', en: 'San Francisco / Silicon Valley', ru: 'Сан-Франциско' }
  },
];

export const THEMES: ClockTheme[] = [
  {
    id: 'deepseek-dark',
    name: 'DeepSeek 深海夜空',
    names: { zh: 'DeepSeek 深海夜空', en: 'DeepSeek Abyss Night', ru: 'DeepSeek Бездна Ночи' },
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
    names: { zh: 'OLED 极黑流光', en: 'OLED Pure Black', ru: 'OLED Глубокий Черный' },
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
    names: { zh: '赛博霓虹', en: 'Cyberpunk Neon', ru: 'Киберпанк Неон' },
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
    names: { zh: '复古琥珀光', en: 'Retro Amber Glow', ru: 'Ретро Янтарь' },
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
    names: { zh: '极简素雅白', en: 'Minimal Porcelain Light', ru: 'Минималистичный Светлый' },
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
