import { ModelPricing, TimezoneOption, ClockTheme } from '../types';

export const DEEPSEEK_MODELS: ModelPricing[] = [
  {
    modelId: 'deepseek-v4-flash',
    modelName: 'DeepSeek-V4 Flash',
    description: '新一代极速轻量旗舰，高吞吐与极低延迟，适用于高频业务、即时响应与实时交互场景',
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
    modelId: 'deepseek-v4-flash-vision',
    modelName: 'DeepSeek-V4 Flash Vision',
    description: '新发布多模态实验旗舰，具备与 V4-Flash 同等文本能力及强大的图像解析与视觉 Agent 表现',
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
    description: '新一代全能专业旗舰，兼具极致通用编程、复杂长文逻辑推理与深度多轮任务执行',
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
  {
    modelId: 'deepseek-r1',
    modelName: 'DeepSeek-R1',
    description: '初代深度推理模型，强化学习驱动，专注于数学、算法竞赛与深度逻辑解题',
    contextWindow: '64K',
    maxOutput: '8K',
    cny: {
      feng: {
        inputHit: 0.14,   // 缓存命中 ¥0.14 / 1M (原标价 1元/1M 峰时/历史)
        inputMiss: 4.0,   // 输入未命中 ¥4.00 / 1M
        output: 16.0,     // 输出 ¥16.00 / 1M
      },
      gu: {
        inputHit: 0.07,   // 谷时 50% 折扣 ¥0.07 / 1M
        inputMiss: 2.0,   // 谷时 50% 折扣 ¥2.00 / 1M
        output: 8.0,      // 谷时 50% 折扣 ¥8.00 / 1M
      },
    },
    usd: {
      feng: {
        inputHit: 0.14,   // $0.14 / 1M
        inputMiss: 0.55,  // $0.55 / 1M
        output: 2.19,     // $2.19 / 1M
      },
      gu: {
        inputHit: 0.07,   // $0.07 / 1M
        inputMiss: 0.275, // $0.275 / 1M
        output: 1.095,    // $1.095 / 1M
      },
    },
  },
  {
    modelId: 'deepseek-v3',
    modelName: 'DeepSeek-V3',
    description: '开源通用对话旗舰，具备卓越的多语言对话能力与超高性价比',
    contextWindow: '64K',
    maxOutput: '8K',
    cny: {
      feng: {
        inputHit: 0.07,   // 缓存命中 ¥0.07 / 1M
        inputMiss: 2.0,   // 输入未命中 ¥2.00 / 1M (标准标价 ¥1~2/1M)
        output: 8.0,      // 输出 ¥8.00 / 1M
      },
      gu: {
        inputHit: 0.035,  // 谷时 50% 折扣 ¥0.035 / 1M
        inputMiss: 1.0,   // 谷时 50% 折扣 ¥1.00 / 1M
        output: 4.0,      // 谷时 50% 折扣 ¥4.00 / 1M
      },
    },
    usd: {
      feng: {
        inputHit: 0.014,  // $0.014 / 1M
        inputMiss: 0.14,   // $0.14 / 1M
        output: 0.28,     // $0.28 / 1M
      },
      gu: {
        inputHit: 0.007,  // $0.007 / 1M
        inputMiss: 0.07,  // $0.07 / 1M
        output: 0.14,     // $0.14 / 1M
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
    id: 'losangeles', 
    name: '美国太平洋时间 (PT / PST/PDT)', 
    city: '洛杉矶 / 旧金山', 
    timeZone: 'America/Los_Angeles', 
    offsetLabel: 'UTC-8/7',
    names: { zh: '美国太平洋时间 (PT / PST/PDT)', en: 'Pacific Time (PT / PST/PDT)', ru: 'Тихоокеанское время (PT)' },
    cities: { zh: '洛杉矶 / 旧金山', en: 'Los Angeles / SF', ru: 'Лос-Анджелес' }
  },
  { 
    id: 'sydney', 
    name: '澳洲东部时间 (AEST/AEDT)', 
    city: '悉尼 / 墨尔本', 
    timeZone: 'Australia/Sydney', 
    offsetLabel: 'UTC+10/11',
    names: { zh: '澳洲东部时间 (AEST/AEDT)', en: 'Australian Eastern Time (AEST/AEDT)', ru: 'Восточноавстралийское время (AEST)' },
    cities: { zh: '悉尼 / 墨尔本', en: 'Sydney / Melbourne', ru: 'Сидней' }
  },
];

export const THEMES: ClockTheme[] = [
  {
    id: 'deepseek',
    name: 'DeepSeek 官方深蓝',
    names: { zh: 'DeepSeek 官方深蓝', en: 'DeepSeek Deep Blue', ru: 'DeepSeek Синий' },
    bgClass: 'from-slate-950 via-[#0B1528] to-[#040C18]',
    cardBgClass: 'bg-[#0E1E38]/90 backdrop-blur-2xl',
    borderClass: 'border-0 shadow-2xl shadow-blue-950/60 ring-0',
    accentText: 'text-blue-400',
    glowClass: 'shadow-blue-500/20',
    badgeBg: 'bg-blue-600/20 text-blue-300',
    textColor: 'text-blue-50',
    secondaryText: 'text-slate-400',
  },
  {
    id: 'oled',
    name: 'OLED 极黑省电',
    names: { zh: 'OLED 极黑省电', en: 'OLED Pure Black', ru: 'OLED Черный' },
    bgClass: 'from-black via-zinc-950 to-black',
    cardBgClass: 'bg-zinc-900/95 backdrop-blur-2xl',
    borderClass: 'border-0 shadow-2xl shadow-black/90 ring-0',
    accentText: 'text-emerald-400',
    glowClass: 'shadow-emerald-500/20',
    badgeBg: 'bg-emerald-600/20 text-emerald-300',
    textColor: 'text-zinc-100',
    secondaryText: 'text-zinc-400',
  },
  {
    id: 'cyberpunk',
    name: '赛博霓虹',
    names: { zh: '赛博霓虹', en: 'Cyberpunk Neon', ru: 'Киберпанк Неон' },
    bgClass: 'from-[#0A051B] via-[#150A2A] to-[#05020D]',
    cardBgClass: 'bg-[#1D0C38]/90 backdrop-blur-2xl',
    borderClass: 'border-0 shadow-2xl shadow-fuchsia-950/70 ring-0',
    accentText: 'text-fuchsia-400',
    glowClass: 'shadow-fuchsia-500/20',
    badgeBg: 'bg-fuchsia-600/20 text-fuchsia-300',
    textColor: 'text-fuchsia-50',
    secondaryText: 'text-fuchsia-300/60',
  },
  {
    id: 'amber',
    name: '复古暖金琥珀',
    names: { zh: '复古暖金琥珀', en: 'Warm Golden Amber', ru: 'Теплый Янтарь' },
    bgClass: 'from-[#1A1208] via-[#24180A] to-[#0F0B05]',
    cardBgClass: 'bg-[#2A1D0E]/90 backdrop-blur-2xl',
    borderClass: 'border-0 shadow-2xl shadow-amber-950/60 ring-0',
    accentText: 'text-amber-400',
    glowClass: 'shadow-amber-500/20',
    badgeBg: 'bg-amber-600/20 text-amber-300',
    textColor: 'text-amber-50',
    secondaryText: 'text-amber-300/60',
  },
  {
    id: 'clean',
    name: '极简明亮 (浅色)',
    names: { zh: '极简明亮 (浅色)', en: 'Clean Bright (Light)', ru: 'Светлый стиль' },
    bgClass: 'from-slate-100 via-blue-50/50 to-slate-200',
    cardBgClass: 'bg-white/95 backdrop-blur-2xl text-slate-900',
    borderClass: 'border-0 shadow-2xl shadow-slate-300/60 ring-0',
    accentText: 'text-blue-600',
    glowClass: 'shadow-blue-500/10',
    badgeBg: 'bg-blue-100 text-blue-700',
    textColor: 'text-slate-900',
    secondaryText: 'text-slate-500',
  },
];
