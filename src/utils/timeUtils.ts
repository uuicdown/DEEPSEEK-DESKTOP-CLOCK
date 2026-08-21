import { DeepSeekPhase, PhaseInfo, Language } from '../types';

/**
 * DeepSeek official peak/valley pricing rules (Effective 2026-08-17):
 * 1. 高峰时段 (梁文峰 · 原价 100%):
 *    - 每日北京时间 (UTC+8) 09:00 - 12:00 (3小时)
 *    - 每日北京时间 (UTC+8) 14:00 - 18:00 (4小时)
 * 2. 优惠/空闲时段 (梁文谷 · 5折特惠 50%):
 *    - 每日北京时间 (UTC+8) 00:00 - 09:00 (9小时，凌晨夜间)
 *    - 每日北京时间 (UTC+8) 12:00 - 14:00 (2小时，午间错峰)
 *    - 每日北京时间 (UTC+8) 18:00 - 24:00 (6小时，晚间夜间)
 */
export function getPhaseInfo(targetDate: Date = new Date(), lang: Language = 'zh'): PhaseInfo {
  // Obtain Beijing Time (Asia/Shanghai) parts accurately with explicit h23 cycle
  const beijingFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Shanghai',
    hour12: false,
    hourCycle: 'h23',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    weekday: 'short',
  });

  const parts = beijingFormatter.formatToParts(targetDate);
  const findPart = (type: string) => {
    const p = parts.find((item) => item.type === type);
    return p ? p.value : '';
  };

  const bYear = parseInt(findPart('year'), 10) || targetDate.getFullYear();
  const bMonth = parseInt(findPart('month'), 10) || targetDate.getMonth() + 1;
  const bDay = parseInt(findPart('day'), 10) || targetDate.getDate();
  
  let bHour = parseInt(findPart('hour'), 10);
  if (isNaN(bHour) || bHour === 24) bHour = 0;
  
  const bMinute = parseInt(findPart('minute'), 10) || 0;
  const bSecond = parseInt(findPart('second'), 10) || 0;
  const bWeekdayStr = findPart('weekday'); // 'Mon', 'Tue', ...

  const weekdayMap: Record<string, { day: number; zh: string; en: string; ru: string }> = {
    Sun: { day: 0, zh: '星期日', en: 'Sunday', ru: 'Воскресенье' },
    Mon: { day: 1, zh: '星期一', en: 'Monday', ru: 'Понедельник' },
    Tue: { day: 2, zh: '星期二', en: 'Tuesday', ru: 'Вторник' },
    Wed: { day: 3, zh: '星期三', en: 'Wednesday', ru: 'Среда' },
    Thu: { day: 4, zh: '星期四', en: 'Thursday', ru: 'Четверг' },
    Fri: { day: 5, zh: '星期五', en: 'Friday', ru: 'Пятница' },
    Sat: { day: 6, zh: '星期六', en: 'Saturday', ru: 'Суббота' },
  };

  const weekdayInfo = weekdayMap[bWeekdayStr] || { day: 1, zh: '星期一', en: 'Monday', ru: 'Понедельник' };
  const beijingDayOfWeek = weekdayInfo.day;
  const beijingWeekdayName = weekdayInfo[lang] || weekdayInfo.zh;
  const isWeekend = beijingDayOfWeek === 0 || beijingDayOfWeek === 6;

  // Decimal hours in Beijing time (e.g. 09:30:00 = 9.5)
  const decimalBeijingHour = bHour + bMinute / 60 + bSecond / 3600;

  // Peak ranges: 09:00 - 12:00 (3h), 14:00 - 18:00 (4h)
  const inMorningPeak = decimalBeijingHour >= 9 && decimalBeijingHour < 12;
  const inAfternoonPeak = decimalBeijingHour >= 14 && decimalBeijingHour < 18;

  const isFeng = inMorningPeak || inAfternoonPeak;
  const currentPhase: DeepSeekPhase = isFeng ? 'feng' : 'gu';

  // Determine current period description name localized
  let currentPeriodName = '';
  if (lang === 'zh') {
    if (inMorningPeak) currentPeriodName = '上午高峰时段 (09:00 - 12:00 · 原价)';
    else if (decimalBeijingHour >= 12 && decimalBeijingHour < 14) currentPeriodName = '午间错峰谷时 (12:00 - 14:00 · 5折)';
    else if (inAfternoonPeak) currentPeriodName = '下午高峰时段 (14:00 - 18:00 · 原价)';
    else if (decimalBeijingHour >= 18) currentPeriodName = '晚间夜间谷时 (18:00 - 24:00 · 5折)';
    else currentPeriodName = '凌晨夜间谷时 (00:00 - 09:00 · 5折)';
  } else if (lang === 'en') {
    if (inMorningPeak) currentPeriodName = 'Morning Peak (09:00 - 12:00 · Standard)';
    else if (decimalBeijingHour >= 12 && decimalBeijingHour < 14) currentPeriodName = 'Noon Valley (12:00 - 14:00 · 50% Off)';
    else if (inAfternoonPeak) currentPeriodName = 'Afternoon Peak (14:00 - 18:00 · Standard)';
    else if (decimalBeijingHour >= 18) currentPeriodName = 'Evening Valley (18:00 - 24:00 · 50% Off)';
    else currentPeriodName = 'Night Valley (00:00 - 09:00 · 50% Off)';
  } else {
    // ru
    if (inMorningPeak) currentPeriodName = 'Утренний пик (09:00 - 12:00 · 100%)';
    else if (decimalBeijingHour >= 12 && decimalBeijingHour < 14) currentPeriodName = 'Обеденная скидка (12:00 - 14:00 · 50%)';
    else if (inAfternoonPeak) currentPeriodName = 'Дневной пик (14:00 - 18:00 · 100%)';
    else if (decimalBeijingHour >= 18) currentPeriodName = 'Вечерняя скидка (18:00 - 24:00 · 50%)';
    else currentPeriodName = 'Ночная скидка (00:00 - 09:00 · 50%)';
  }

  // Calculate next phase transition timestamp accurately
  let nextTransitionYear = bYear;
  let nextTransitionMonth = bMonth;
  let nextTransitionDay = bDay;
  let nextTransitionHour = 9;
  let nextTransitionMinute = 0;
  let nextPhaseName = '';
  let nextCharacterName = '';

  if (lang === 'zh') {
    if (decimalBeijingHour < 9) {
      nextTransitionHour = 9;
      nextTransitionMinute = 0;
      nextPhaseName = '上午高峰时段 (09:00 · 梁文峰 · 原价)';
      nextCharacterName = '梁文峰';
    } else if (decimalBeijingHour >= 9 && decimalBeijingHour < 12) {
      nextTransitionHour = 12;
      nextTransitionMinute = 0;
      nextPhaseName = '午间错峰谷时 (12:00 · 梁文谷 · 5折)';
      nextCharacterName = '梁文谷';
    } else if (decimalBeijingHour >= 12 && decimalBeijingHour < 14) {
      nextTransitionHour = 14;
      nextTransitionMinute = 0;
      nextPhaseName = '下午高峰时段 (14:00 · 梁文峰 · 原价)';
      nextCharacterName = '梁文峰';
    } else if (decimalBeijingHour >= 14 && decimalBeijingHour < 18) {
      nextTransitionHour = 18;
      nextTransitionMinute = 0;
      nextPhaseName = '晚间夜间谷时 (18:00 · 梁文谷 · 5折)';
      nextCharacterName = '梁文谷';
    } else {
      const nextDate = new Date(Date.UTC(bYear, bMonth - 1, bDay + 1, 1, 0, 0));
      nextTransitionYear = nextDate.getUTCFullYear();
      nextTransitionMonth = nextDate.getUTCMonth() + 1;
      nextTransitionDay = nextDate.getUTCDate();
      nextTransitionHour = 9;
      nextTransitionMinute = 0;
      nextPhaseName = '明日上午高峰 (09:00 · 梁文峰 · 原价)';
      nextCharacterName = '梁文峰';
    }
  } else if (lang === 'en') {
    if (decimalBeijingHour < 9) {
      nextTransitionHour = 9;
      nextTransitionMinute = 0;
      nextPhaseName = 'Morning Peak (09:00 · Liang Wenpeak · 100%)';
      nextCharacterName = 'Liang Wenpeak';
    } else if (decimalBeijingHour >= 9 && decimalBeijingHour < 12) {
      nextTransitionHour = 12;
      nextTransitionMinute = 0;
      nextPhaseName = 'Noon Valley (12:00 · Liang Wentrough · 50% Off)';
      nextCharacterName = 'Liang Wentrough';
    } else if (decimalBeijingHour >= 12 && decimalBeijingHour < 14) {
      nextTransitionHour = 14;
      nextTransitionMinute = 0;
      nextPhaseName = 'Afternoon Peak (14:00 · Liang Wenpeak · 100%)';
      nextCharacterName = 'Liang Wenpeak';
    } else if (decimalBeijingHour >= 14 && decimalBeijingHour < 18) {
      nextTransitionHour = 18;
      nextTransitionMinute = 0;
      nextPhaseName = 'Evening Valley (18:00 · Liang Wentrough · 50% Off)';
      nextCharacterName = 'Liang Wentrough';
    } else {
      const nextDate = new Date(Date.UTC(bYear, bMonth - 1, bDay + 1, 1, 0, 0));
      nextTransitionYear = nextDate.getUTCFullYear();
      nextTransitionMonth = nextDate.getUTCMonth() + 1;
      nextTransitionDay = nextDate.getUTCDate();
      nextTransitionHour = 9;
      nextTransitionMinute = 0;
      nextPhaseName = 'Tomorrow Morning Peak (09:00 · 100%)';
      nextCharacterName = 'Liang Wenpeak';
    }
  } else {
    // ru
    if (decimalBeijingHour < 9) {
      nextTransitionHour = 9;
      nextTransitionMinute = 0;
      nextPhaseName = 'Утренний пик (09:00 · Пиковый Лян · 100%)';
      nextCharacterName = 'Пиковый Лян';
    } else if (decimalBeijingHour >= 9 && decimalBeijingHour < 12) {
      nextTransitionHour = 12;
      nextTransitionMinute = 0;
      nextPhaseName = 'Обеденная скидка (12:00 · Долинный Лян · 50%)';
      nextCharacterName = 'Долинный Лян';
    } else if (decimalBeijingHour >= 12 && decimalBeijingHour < 14) {
      nextTransitionHour = 14;
      nextTransitionMinute = 0;
      nextPhaseName = 'Дневной пик (14:00 · Пиковый Лян · 100%)';
      nextCharacterName = 'Пиковый Лян';
    } else if (decimalBeijingHour >= 14 && decimalBeijingHour < 18) {
      nextTransitionHour = 18;
      nextTransitionMinute = 0;
      nextPhaseName = 'Вечерняя скидка (18:00 · Долинный Лян · 50%)';
      nextCharacterName = 'Долинный Лян';
    } else {
      const nextDate = new Date(Date.UTC(bYear, bMonth - 1, bDay + 1, 1, 0, 0));
      nextTransitionYear = nextDate.getUTCFullYear();
      nextTransitionMonth = nextDate.getUTCMonth() + 1;
      nextTransitionDay = nextDate.getUTCDate();
      nextTransitionHour = 9;
      nextTransitionMinute = 0;
      nextPhaseName = 'Завтрашний утренний пик (09:00 · 100%)';
      nextCharacterName = 'Пиковый Лян';
    }
  }

  // Build target transition date in UTC: CST (UTC+8) -> UTC is (hour - 8)
  const targetUtcMs = Date.UTC(
    nextTransitionYear,
    nextTransitionMonth - 1,
    nextTransitionDay,
    nextTransitionHour - 8,
    nextTransitionMinute,
    0
  );
  const nextPhaseTime = new Date(targetUtcMs);
  const countdownSeconds = Math.max(0, Math.floor((nextPhaseTime.getTime() - targetDate.getTime()) / 1000));

  const hoursLeft = Math.floor(countdownSeconds / 3600);
  const minsLeft = Math.floor((countdownSeconds % 3600) / 60);
  const secsLeft = countdownSeconds % 60;
  const countdownFormatted = `${String(hoursLeft).padStart(2, '0')}:${String(minsLeft).padStart(2, '0')}:${String(secsLeft).padStart(2, '0')}`;

  const beijingTimeString = `${String(bHour).padStart(2, '0')}:${String(bMinute).padStart(2, '0')}:${String(bSecond).padStart(2, '0')}`;
  const dayProgressPercent = Math.min(100, Math.max(0, (decimalBeijingHour / 24) * 100));

  const charName = lang === 'zh' ? (isFeng ? '梁文峰' : '梁文谷') : lang === 'en' ? (isFeng ? 'Liang Wenpeak' : 'Liang Wentrough') : (isFeng ? 'Пиковый Лян' : 'Долинный Лян');
  const phaseName = lang === 'zh' 
    ? (isFeng ? '高峰时段 (繁忙原价 100%)' : '空闲谷时 (5折半价特惠 50%)')
    : lang === 'en'
    ? (isFeng ? 'Peak Hours (100% Standard)' : 'Off-Peak Valley (50% Off)')
    : (isFeng ? 'Пиковый период (100%)' : 'Непиковый период (Скидка 50%)');

  const tagline = lang === 'zh'
    ? (isFeng ? '高峰繁忙 · 原价输出' : '错峰空闲 · 5折特惠')
    : lang === 'en'
    ? (isFeng ? 'Peak Traffic · Standard Rate' : 'Off-Peak Hours · 50% Discount')
    : (isFeng ? 'Высокая нагрузка · 100%' : 'Непиковые часы · Скидка 50%');

  const discountRate = lang === 'zh'
    ? (isFeng ? '100% (标准原价)' : '50% (5折半价)')
    : lang === 'en'
    ? (isFeng ? '100% (Standard)' : '50% (50% Off)')
    : (isFeng ? '100% (Стандарт)' : '50% (Скидка 50%)');

  const description = lang === 'zh'
    ? (isFeng
      ? `当前处于【梁文峰】繁忙高峰期（${currentPeriodName}），属于 API 调用高并发时段，按标准费率 100% 计费。`
      : `当前处于【梁文谷】错峰优惠期（${currentPeriodName}），API 调用价格立享 5 折（50% 折扣），推荐批量跑批！`)
    : lang === 'en'
    ? (isFeng
      ? `Currently in [${charName}] peak traffic period (${currentPeriodName}). API requests are charged at the standard 100% rate.`
      : `Currently in [${charName}] off-peak window (${currentPeriodName})! API calls enjoy an instant 50% discount. Perfect for batch runs!`)
    : (isFeng
      ? `Сейчас действует пиковый период [${charName}] (${currentPeriodName}). Запросы тарифицируются по 100% стоимости.`
      : `Сейчас действует скидочный период [${charName}] (${currentPeriodName})! Скидка 50% на все вызовы API. Рекомендуется для пакетных задач!`);

  return {
    currentPhase,
    phaseName,
    characterName: charName,
    description,
    tagline,
    discountRate,
    beijingHour: bHour,
    beijingMinute: bMinute,
    beijingSecond: bSecond,
    beijingTimeString,
    isWeekend,
    beijingDayOfWeek,
    beijingWeekdayName,
    currentPeriodName,
    nextPhaseTime,
    nextPhaseName,
    nextCharacterName,
    countdownSeconds,
    countdownFormatted,
    dayProgressPercent,
  };
}

/**
 * Format date & time for given timezone and language
 */
export function formatTimeInZone(date: Date, timeZone: string, use24h: boolean = true, lang: Language = 'zh') {
  const locale = lang === 'zh' ? 'zh-CN' : lang === 'en' ? 'en-US' : 'ru-RU';

  const options: Intl.DateTimeFormatOptions = {
    timeZone,
    hour12: !use24h,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };

  const timeStr = new Intl.DateTimeFormat(locale, options).format(date);

  const dateOptions: Intl.DateTimeFormatOptions = {
    timeZone,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  };
  const dateStr = new Intl.DateTimeFormat(locale, dateOptions).format(date);

  // Timezone display name / offset
  const tzParts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    timeZoneName: 'shortOffset',
  }).formatToParts(date);
  const offsetPart = tzParts.find((p) => p.type === 'timeZoneName')?.value || '';

  return {
    timeStr,
    dateStr,
    offsetPart,
  };
}

/**
 * Approximate Chinese Lunar Date & Solar term lookup for enriching Chinese desktop clock
 */
export function getLunarInfo(date: Date): { lunarStr: string; solarTerm: string } {
  try {
    const formatter = new Intl.DateTimeFormat('zh-u-ca-chinese', {
      month: 'numeric',
      day: 'numeric',
    });
    const lunarRaw = formatter.format(date);

    return {
      lunarStr: `农历 ${lunarRaw}`,
      solarTerm: getSolarTerm(date),
    };
  } catch (e) {
    return { lunarStr: '农历', solarTerm: '' };
  }
}

function getSolarTerm(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  if (month === 1) return day < 20 ? '小寒' : '大寒';
  if (month === 2) return day < 19 ? '立春' : '雨水';
  if (month === 3) return day < 20 ? '惊蛰' : '春分';
  if (month === 4) return day < 20 ? '清明' : '谷雨';
  if (month === 5) return day < 21 ? '立夏' : '小满';
  if (month === 6) return day < 21 ? '芒种' : '夏至';
  if (month === 7) return day < 23 ? '小暑' : '大暑';
  if (month === 8) return day < 23 ? '立秋' : '处暑';
  if (month === 9) return day < 23 ? '白露' : '秋分';
  if (month === 10) return day < 23 ? '寒露' : '霜降';
  if (month === 11) return day < 22 ? '立冬' : '小雪';
  return day < 22 ? '大雪' : '冬至';
}
