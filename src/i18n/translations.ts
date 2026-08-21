import { Language } from '../types';

export interface Translations {
  appName: string;
  badge: string;
  selectTimezone: string;
  selectTimezoneHint: string;
  selectTheme: string;
  themeTitle: string;
  language: string;
  toggle24hTitle: string;
  toggleMsTitle: string;
  soundEnabledTitle: string;
  soundDisabledTitle: string;
  fullscreenTitle: string;
  fullscreenBtn: string;
  minimizeBtn: string;
  minimizeTitle: string;
  exeBtn: string;
  exeTitle: string;
  exitFullscreen: string;
  
  // Liang status card
  peakName: string;
  valleyName: string;
  peakBadge: string;
  valleyBadge: string;
  peakRateTag: string;
  valleyRateTag: string;
  peakTagline: string;
  valleyTagline: string;
  peakDescription: string;
  valleyDescription: string;
  
  targetNext: string;
  countdownLabel: string;
  nextPhaseLabel: string;
  
  // Timeline
  timelineTitle: string;
  timelineBenchmark: string;
  legendPeak: string;
  legendValley: string;
  timelineGu1: string;
  timelineFeng1: string;
  timelineGu2: string;
  timelineFeng2: string;
  timelineGu3: string;
  
  tick0: string;
  tick9: string;
  tick12: string;
  tick14: string;
  tick18: string;
  tick24: string;
  
  ruleGuideBtn: string;
  ruleGuideTitle: string;
  rulePeakTitle: string;
  rulePeakDesc: string;
  ruleValleyTitle: string;
  ruleValleyDesc: string;
  ruleBestPractice: string;
  
  // Price Board
  priceBoardTitle: string;
  priceBoardSubGu: string;
  priceBoardSubFeng: string;
  priceBoardDesc: string;
  filterAll: string;
  filterFlash: string;
  filterPro: string;
  cny: string;
  usd: string;
  flagship: string;
  context: string;
  activePriceHighlight: string;
  liveActive: string;
  inputMiss: string;
  inputHit: string;
  output: string;
  inputMissHitOutput: string;
  rateTable: string;
  peakRowTitle: string;
  valleyRowTitle: string;
  cacheNotice: string;
  maxOutput: string;
  
  // Calculator
  calculator: string;
  hideCalculator: string;
  calcHeaderTitle: string;
  calcHeaderSub: string;
  calcSelectModel: string;
  calcInputLabel: string;
  calcOutputLabel: string;
  calcCacheLabel: string;
  calcResultTitle: string;
  calcSavingsTitle: string;
  calcSavingsPercent: string;
  calcGuActiveNow: string;
  calcFengAdvice: string;
  
  // Mini floating clock
  miniClock: string;
  expandMainBtn: string;
  
  // Fullscreen Modal
  fullscreenZenTitle: string;
  
  // Exe packaging modal
  exeModalTitle: string;
  exeModalSub: string;
  exeModalBadge: string;
  tabPwa: string;
  tabTauri: string;
  tabElectron: string;
  pwaDescTitle: string;
  pwaDescText: string;
  pwaFeaturesTitle: string;
  pwaFeature1: string;
  pwaFeature2: string;
  pwaFeature3: string;
  tauriDesc: string;
  tauriStepTitle: string;
  electronDesc: string;
  electronStepTitle: string;
  
  // Footer
  footerNote: string;
  footerExeGuide: string;
  footerBenchmark: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  zh: {
    appName: 'DEEPSEEK DESKTOP CLOCK',
    badge: 'DEEPSEEK 桌面时钟',
    selectTimezone: '时区选择',
    selectTimezoneHint: '选择显示时区（DeepSeek 峰谷时段均以北京时间为准）',
    selectTheme: '选择视觉主题',
    themeTitle: '主题皮肤',
    language: '语言 (Language)',
    toggle24hTitle: '切换 12/24 小时制',
    toggleMsTitle: '切换毫秒显示',
    soundEnabledTitle: '已开启整点与变相提示音',
    soundDisabledTitle: '提示音已静音',
    fullscreenTitle: '开启桌面全屏大时钟',
    fullscreenBtn: '全屏时钟',
    minimizeBtn: '悬浮小时钟',
    minimizeTitle: '最小化为桌面悬浮小时钟 (仅显示时间与梁文峰/谷状态)',
    exeBtn: '打包.exe',
    exeTitle: '查看如何打包为 Windows .exe 桌面独立程序',
    exitFullscreen: '退出全屏 (ESC)',
    
    peakName: '梁文峰',
    valleyName: '梁文谷',
    peakBadge: '高峰时段 (繁忙原价 100%)',
    valleyBadge: '空闲谷时 (5折半价特惠 50%)',
    peakRateTag: '100% (标准原价)',
    valleyRateTag: '50% (5折半价)',
    peakTagline: '高峰繁忙 · 原价输出',
    valleyTagline: '错峰空闲 · 5折特惠',
    peakDescription: '当前处于【梁文峰】繁忙高峰期，属于 API 调用高并发时段，按标准费率 100% 计费。',
    valleyDescription: '当前处于【梁文谷】错峰优惠期，API 调用价格立享 5 折（50% 折扣），推荐批量跑批！',
    
    targetNext: '下阶段',
    countdownLabel: '倒计时',
    nextPhaseLabel: '下阶段：',
    
    timelineTitle: '24小时峰谷时间轴',
    timelineBenchmark: '(北京时间 UTC+8)',
    legendPeak: '高峰 (梁文峰 · 原价)',
    legendValley: '谷时 (梁文谷 · 5折)',
    timelineGu1: '夜间谷时',
    timelineFeng1: '上午高峰',
    timelineGu2: '午间谷时',
    timelineFeng2: '下午高峰',
    timelineGu3: '晚间谷时',
    
    tick0: '00:00',
    tick9: '09:00',
    tick12: '12:00',
    tick14: '14:00',
    tick18: '18:00',
    tick24: '24:00',
    
    ruleGuideBtn: '官方分时峰谷计费规则与最佳省钱指南',
    ruleGuideTitle: 'DeepSeek 官方峰谷分时定价策略（2026-08-17 起生效）',
    rulePeakTitle: '每日高峰时段（梁文峰 · 原价 100%）：',
    rulePeakDesc: '每日北京时间 09:00 - 12:00 以及 14:00 - 18:00。并发调用高峰期，按标准费率计费。',
    ruleValleyTitle: '每日谷时特惠（梁文谷 · 5折 50%）：',
    ruleValleyDesc: '每日北京时间 00:00 - 09:00、12:00 - 14:00 以及 18:00 - 24:00。API 价格直降 50%！',
    ruleBestPractice: '跑批省钱建议：将非实时批量任务、数据集构建、知识库切片评测安排在「梁文谷」空闲谷时（夜间 18:00 后或午休 12:00-14:00）运行，API 成本直降 50%！',
    
    priceBoardTitle: 'DeepSeek-V4 Flash / Pro 价格看板',
    priceBoardSubGu: '⚡ 梁文谷 5 折特惠中',
    priceBoardSubFeng: '☀️ 梁文峰 原价运行中',
    priceBoardDesc: '动态依据北京时间判定：每日高峰原价，其余夜间与午间享 50% 半价优惠',
    filterAll: '全部',
    filterFlash: 'V4 Flash',
    filterPro: 'V4 Pro',
    cny: '人民币 ¥',
    usd: '美元 $',
    flagship: '新旗舰',
    context: '上下文',
    activePriceHighlight: '当前实时生效费率',
    liveActive: '生效中',
    inputMiss: '输入 (未命中)',
    inputHit: '缓存 (命中)',
    output: '输出 (Output)',
    inputMissHitOutput: '未命中 / 命中 / 输出',
    rateTable: '峰谷费率对比',
    peakRowTitle: '梁文峰 (高峰 100%)',
    valleyRowTitle: '梁文谷 (谷时 50%)',
    cacheNotice: '支持命中缓存大幅省钱',
    maxOutput: '最大输出',
    
    calculator: '省钱计算器',
    hideCalculator: '收起计算器',
    calcHeaderTitle: 'Token 成本测算与 5 折省钱收益计算器',
    calcHeaderSub: '实时试算错峰调用节省预算',
    calcSelectModel: '选择预估模型',
    calcInputLabel: '预计输入 Tokens 量',
    calcOutputLabel: '预计输出 Tokens 量',
    calcCacheLabel: 'KV Cache 缓存命中率',
    calcResultTitle: '成本对比测算',
    calcSavingsTitle: '错峰调用节省收益',
    calcSavingsPercent: '立省 50%',
    calcGuActiveNow: '✨ 当前正处于「梁文谷」优惠时段，立即调用即享 5 折！',
    calcFengAdvice: '💡 建议将批量请求延后至 18:00 梁文谷时段运行以节省 50% 预算！',
    
    miniClock: 'DeepSeek 小时钟',
    expandMainBtn: '展开主界面',
    
    fullscreenZenTitle: 'DeepSeek 沉浸全屏时钟',
    
    exeModalTitle: '生成 Windows .exe 桌面独立程序指南',
    exeModalSub: '基于网页前端开发，可通过以下 3 种方式秒变为桌面独立软件',
    exeModalBadge: '支持悬浮挂件',
    tabPwa: '方法 1：PWA 免安装桌面化 (最推荐)',
    tabTauri: '方法 2：Tauri 打包 (.exe 极小 3MB)',
    tabElectron: '方法 3：Electron 打包 (.exe 经典)',
    pwaDescTitle: '无需编译，0 秒生成桌面独立窗口应用：',
    pwaDescText: '在 Edge 或 Chrome 浏览器中，点击地址栏右侧的「安装应用」图标，或在菜单中选择「应用」→「将此站点作为应用安装」。',
    pwaFeaturesTitle: '✨ 独立窗口特性：',
    pwaFeature1: '拥有独立的 Windows 任务栏图标与桌面图标。',
    pwaFeature2: '支持点击右上方「悬浮小时钟」，随时变为桌面右下角极简可拖拽小挂件。',
    pwaFeature3: '无需安装庞大运行库，随开随用，极致省电省内存。',
    tauriDesc: 'Tauri 是最先进的轻量级桌面打包方案，编译出的 Windows .exe 安装包仅约 3~5 MB，内存占用极低。',
    tauriStepTitle: '打包步骤命令：',
    electronDesc: 'Electron 是最经典的跨平台桌面方案，适合零 Rust 环境门槛的开发者快速打包。',
    electronStepTitle: '打包步骤命令：',
    
    footerNote: 'DeepSeek 桌面时钟 · 梁文峰 (高峰原价) / 梁文谷 (谷时 5折特惠)',
    footerExeGuide: '打包为 Windows .exe 独立程序',
    footerBenchmark: '计费基准：中国标准时间 (UTC+8)',
  },
  
  en: {
    appName: 'DEEPSEEK DESKTOP CLOCK',
    badge: 'DEEPSEEK CLOCK',
    selectTimezone: 'Timezone',
    selectTimezoneHint: 'Select display timezone (DeepSeek peak/valley billing strictly follows Beijing Time UTC+8)',
    selectTheme: 'Theme',
    themeTitle: 'Theme Skin',
    language: 'Language',
    toggle24hTitle: 'Toggle 12/24 Hour Format',
    toggleMsTitle: 'Toggle Milliseconds Display',
    soundEnabledTitle: 'Chimes Enabled (Hourly & Phase Switch)',
    soundDisabledTitle: 'Chimes Muted',
    fullscreenTitle: 'Open Fullscreen Zen Clock',
    fullscreenBtn: 'Fullscreen',
    minimizeBtn: 'Mini Widget',
    minimizeTitle: 'Minimize to floating desktop widget (Time & Phase)',
    exeBtn: 'Desktop .exe',
    exeTitle: 'How to package as standalone Windows .exe desktop app',
    exitFullscreen: 'Exit Fullscreen (ESC)',
    
    peakName: 'Liang Wenpeak',
    valleyName: 'Liang Wentrough',
    peakBadge: 'Peak Hours (Standard 100%)',
    valleyBadge: 'Off-Peak Valley (50% Off)',
    peakRateTag: '100% (Standard Rate)',
    valleyRateTag: '50% (50% Off)',
    peakTagline: 'High Traffic · Standard Rate',
    valleyTagline: 'Off-Peak · 50% Off Saving',
    peakDescription: 'Currently in [Liang Wenpeak] peak window. API requests are charged at the standard 100% rate.',
    valleyDescription: 'Currently in [Liang Wentrough] off-peak window! All API calls enjoy an instant 50% discount.',
    
    targetNext: 'Next',
    countdownLabel: 'Countdown',
    nextPhaseLabel: 'Next Phase:',
    
    timelineTitle: '24-Hour Peak & Valley Timeline',
    timelineBenchmark: '(Beijing Time UTC+8)',
    legendPeak: 'Peak (Wenpeak · 100%)',
    legendValley: 'Valley (Wentrough · 50% Off)',
    timelineGu1: 'Night Valley',
    timelineFeng1: 'Morning Peak',
    timelineGu2: 'Noon Valley',
    timelineFeng2: 'Afternoon Peak',
    timelineGu3: 'Evening Valley',
    
    tick0: '00:00',
    tick9: '09:00',
    tick12: '12:00',
    tick14: '14:00',
    tick18: '18:00',
    tick24: '24:00',
    
    ruleGuideBtn: 'Official Peak/Valley Rules & Cost Saving Guide',
    ruleGuideTitle: 'DeepSeek Official Peak/Valley Pricing Policy (Effective Aug 17, 2026)',
    rulePeakTitle: 'Daily Peak Hours (Liang Wenpeak · 100% Standard):',
    rulePeakDesc: 'Daily Beijing Time 09:00 - 12:00 and 14:00 - 18:00 (UTC+8). High-concurrency hours billed at standard rates.',
    ruleValleyTitle: 'Daily Off-Peak Valley (Liang Wentrough · 50% Off):',
    ruleValleyDesc: 'Daily Beijing Time 00:00 - 09:00, 12:00 - 14:00, and 18:00 - 24:00 (UTC+8). Instant 50% discount on all API calls!',
    ruleBestPractice: 'Cost-Saving Tip: Schedule offline batch processing, dataset synthesis, and evaluations during [Liang Wentrough] off-peak hours (after 18:00 or 12:00-14:00) to cut API spend by 50%!',
    
    priceBoardTitle: 'DeepSeek-V4 Flash / Pro Pricing Matrix',
    priceBoardSubGu: '⚡ 50% Off Valley Active',
    priceBoardSubFeng: '☀️ Standard Peak Active',
    priceBoardDesc: 'Dynamically calculated against Beijing Time: Peak hours at 100%, Night & Noon Valley at 50% off',
    filterAll: 'All',
    filterFlash: 'V4 Flash',
    filterPro: 'V4 Pro',
    cny: 'CNY ¥',
    usd: 'USD $',
    flagship: 'Flagship',
    context: 'Context',
    activePriceHighlight: 'Live Active Pricing',
    liveActive: 'Active',
    inputMiss: 'Prompt (Miss)',
    inputHit: 'Cache (Hit)',
    output: 'Output (Gen)',
    inputMissHitOutput: 'Miss / Hit / Output',
    rateTable: 'Rate Comparison',
    peakRowTitle: 'Peak (Wenpeak 100%)',
    valleyRowTitle: 'Valley (Wentrough 50%)',
    cacheNotice: 'Supports KV Cache Hit discounts',
    maxOutput: 'Max Output',
    
    calculator: 'Cost Calculator',
    hideCalculator: 'Hide Calculator',
    calcHeaderTitle: 'Token Cost & 50% Off Savings Calculator',
    calcHeaderSub: 'Simulate API savings during off-peak valley hours',
    calcSelectModel: 'Select Model',
    calcInputLabel: 'Estimated Input Tokens',
    calcOutputLabel: 'Estimated Output Tokens',
    calcCacheLabel: 'KV Cache Hit Rate',
    calcResultTitle: 'Cost Estimation',
    calcSavingsTitle: 'Money Saved in Valley',
    calcSavingsPercent: 'Save 50%',
    calcGuActiveNow: '✨ Currently in「Liang Wentrough」50% off window! Run your batch calls now!',
    calcFengAdvice: '💡 Postpone heavy batch jobs to after 18:00 to save 50% of your budget!',
    
    miniClock: 'DeepSeek Mini',
    expandMainBtn: 'Expand',
    
    fullscreenZenTitle: 'DeepSeek Zen Clock',
    
    exeModalTitle: 'Build Standalone Windows Desktop App (.exe)',
    exeModalSub: 'Package DeepSeek Clock into a standalone native desktop app using 3 methods',
    exeModalBadge: 'Mini Widget Supported',
    tabPwa: 'Method 1: PWA Desktop (Instant & Recommended)',
    tabTauri: 'Method 2: Tauri (.exe Ultra Light ~3MB)',
    tabElectron: 'Method 3: Electron (.exe Classic)',
    pwaDescTitle: 'Zero build required — install directly from browser:',
    pwaDescText: 'In Edge or Chrome, click the "Install App" icon in the address bar, or choose "Apps" → "Install this site as an app".',
    pwaFeaturesTitle: '✨ Native App Features:',
    pwaFeature1: 'Independent Windows taskbar icon and desktop launcher shortcut.',
    pwaFeature2: 'Click "Mini Widget" to minimize to a draggable floating desktop gadget.',
    pwaFeature3: 'Extremely lightweight, minimal memory and CPU usage.',
    tauriDesc: 'Tauri is the modern Rust-powered framework. Compiled Windows .exe installer is only 3~5 MB.',
    tauriStepTitle: 'Build Commands:',
    electronDesc: 'Electron is the industry standard for cross-platform apps without requiring Rust setup.',
    electronStepTitle: 'Build Commands:',
    
    footerNote: 'DeepSeek Clock · Peak (Liang Wenpeak · 100%) / Off-Peak (Liang Wentrough · 50% Off)',
    footerExeGuide: 'Build Standalone Windows .exe',
    footerBenchmark: 'Billing Benchmark: China Standard Time (UTC+8)',
  },
  
  ru: {
    appName: 'DEEPSEEK НАСТОЛЬНЫЕ ЧАСЫ',
    badge: 'DEEPSEEK CLOCK',
    selectTimezone: 'Часовой пояс',
    selectTimezoneHint: 'Выберите часовой пояс (Тарификация DeepSeek рассчитывается строго по Пекину UTC+8)',
    selectTheme: 'Тема',
    themeTitle: 'Тема оформления',
    language: 'Язык',
    toggle24hTitle: 'Переключить 12/24 часовой формат',
    toggleMsTitle: 'Переключить миллисекунды',
    soundEnabledTitle: 'Звуковые сигналы включены (каждый час и смена фазы)',
    soundDisabledTitle: 'Звук отключен',
    fullscreenTitle: 'Полноэкранный режим часов',
    fullscreenBtn: 'Во весь экран',
    minimizeBtn: 'Мини-виджет',
    minimizeTitle: 'Свернуть в плавающий мини-виджет (Время и статус)',
    exeBtn: 'Сборка .exe',
    exeTitle: 'Инструкция по сборке автономного Windows .exe приложения',
    exitFullscreen: 'Выйти из полноэкранного режима (ESC)',
    
    peakName: 'Пиковый Лян',
    valleyName: 'Долинный Лян',
    peakBadge: 'Пиковые часы (Стандарт 100%)',
    valleyBadge: 'Непиковые часы (Скидка 50%)',
    peakRateTag: '100% (Стандарт)',
    valleyRateTag: '50% (Скидка 50%)',
    peakTagline: 'Пиковая нагрузка · Стандартная цена',
    valleyTagline: 'Непиковое время · Скидка 50%',
    peakDescription: 'Текущий период [Пиковый Лян] — пиковая нагрузка API. Тариф 100%.',
    valleyDescription: 'Текущий период [Долинный Лян] — непиковые часы! Скидка 50% на все вызовы API.',
    
    targetNext: 'Далее',
    countdownLabel: 'Отсчет',
    nextPhaseLabel: 'След. фаза:',
    
    timelineTitle: '24-часовая шкала пиков и скидок',
    timelineBenchmark: '(Пекинское время UTC+8)',
    legendPeak: 'Пик (Пиковый Лян · 100%)',
    legendValley: 'Скидка (Долинный Лян · 50%)',
    timelineGu1: 'Ночная скидка',
    timelineFeng1: 'Утренний пик',
    timelineGu2: 'Обед (Скидка)',
    timelineFeng2: 'Дневной пик',
    timelineGu3: 'Вечерняя скидка',
    
    tick0: '00:00',
    tick9: '09:00',
    tick12: '12:00',
    tick14: '14:00',
    tick18: '18:00',
    tick24: '24:00',
    
    ruleGuideBtn: 'Правила тарификации и советы по экономии',
    ruleGuideTitle: 'Официальная тарифная политика DeepSeek (с 17 августа 2026 г.)',
    rulePeakTitle: 'Ежедневные пиковые часы (Пиковый Лян · 100%):',
    rulePeakDesc: 'Ежедневно по Пекину: 09:00 - 12:00 и 14:00 - 18:00 (UTC+8). Период высокой нагрузки, стандартная оплата.',
    ruleValleyTitle: 'Ежедневные скидочные часы (Долинный Лян · 50% скидка):',
    ruleValleyDesc: 'Ежедневно по Пекину: 00:00 - 09:00, 12:00 - 14:00 и 18:00 - 24:00 (UTC+8). Скидка 50% на весь API!',
    ruleBestPractice: 'Совет по экономии: запускайте фоновые пакетные задачи в период [Долинный Лян] (после 18:00 или 12:00-14:00), чтобы сократить расходы на API в 2 раза!',
    
    priceBoardTitle: 'Таблица тарифов DeepSeek-V4 Flash / Pro',
    priceBoardSubGu: '⚡ Скидка 50% активна',
    priceBoardSubFeng: '☀️ Стандартный тариф',
    priceBoardDesc: 'Автоматический расчет по Пекину: Пик (100%), ночь и обед со скидкой 50%',
    filterAll: 'Все',
    filterFlash: 'V4 Flash',
    filterPro: 'V4 Pro',
    cny: 'Юани ¥',
    usd: 'Доллары $',
    flagship: 'Флагман',
    context: 'Контекст',
    activePriceHighlight: 'Текущий активный тариф',
    liveActive: 'Активен',
    inputMiss: 'Вход (Промах)',
    inputHit: 'Кэш (Хит)',
    output: 'Выход (Ген.)',
    inputMissHitOutput: 'Промах / Хит / Выход',
    rateTable: 'Сравнение тарифов',
    peakRowTitle: 'Пик (Пиковый Лян 100%)',
    valleyRowTitle: 'Скидка (Долинный Лян 50%)',
    cacheNotice: 'Скидка на попадание в кэш KV Cache',
    maxOutput: 'Макс. выход',
    
    calculator: 'Калькулятор',
    hideCalculator: 'Скрыть калькулятор',
    calcHeaderTitle: 'Калькулятор затрат и выгоды от скидки 50%',
    calcHeaderSub: 'Расчет экономии при вызове в непиковые часы',
    calcSelectModel: 'Модель',
    calcInputLabel: 'Входные токены (Prompt)',
    calcOutputLabel: 'Выходные токены (Completion)',
    calcCacheLabel: 'Попадание в KV Cache',
    calcResultTitle: 'Оценка затрат',
    calcSavingsTitle: 'Экономия со скидкой',
    calcSavingsPercent: 'Экономия 50%',
    calcGuActiveNow: '✨ Сейчас действует скидка 50%「Долинный Лян」, запускайте вызовы!',
    calcFengAdvice: '💡 Перенесите пакетные задачи на время после 18:00, чтобы сэкономить 50%!',
    
    miniClock: 'Мини-часы',
    expandMainBtn: 'Развернуть',
    
    fullscreenZenTitle: 'Полноэкранные часы DeepSeek',
    
    exeModalTitle: 'Сборка автономного приложения Windows (.exe)',
    exeModalSub: 'Запускайте часы DeepSeek прямо на рабочем столе Windows с помощью 3 способов',
    exeModalBadge: 'Поддержка виджета',
    tabPwa: 'Способ 1: PWA (Рекомендуется, 0 сек)',
    tabTauri: 'Способ 2: Tauri (.exe 3~5 МБ)',
    tabElectron: 'Способ 3: Electron (.exe классика)',
    pwaDescTitle: 'Без компиляции — установка прямо из браузера:',
    pwaDescText: 'В Edge или Chrome нажмите на значок «Установить приложение» в адресной строке или выберите «Приложения» → «Установить этот сайт как приложение».',
    pwaFeaturesTitle: '✨ Возможности отдельного окна:',
    pwaFeature1: 'Отдельный значок на панели задач Windows и ярлык на рабочем столе.',
    pwaFeature2: 'Кнопка «Мини-виджет» сворачивает часы в плавающий виджет поверх окон.',
    pwaFeature3: 'Не требует тяжелых сред выполнения, минимум нагрузки на CPU и RAM.',
    tauriDesc: 'Tauri — современное решение на Rust. Размер .exe файла всего 3~5 МБ.',
    tauriStepTitle: 'Команды сборки:',
    electronDesc: 'Electron — классическое кроссплатформенное решение без настройки Rust.',
    electronStepTitle: 'Команды сборки:',
    
    footerNote: 'DeepSeek Часы · Пик (Пиковый Лян · 100%) / Скидка (Долинный Лян · 50%)',
    footerExeGuide: 'Инструкция по сборке Windows .exe',
    footerBenchmark: 'Официальный ориентир: Китайское время (UTC+8)',
  },
};

