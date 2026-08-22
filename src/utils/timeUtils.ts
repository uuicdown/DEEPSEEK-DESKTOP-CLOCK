import { DeepSeekPhase, PhaseInfo, Language } from '../types';

/**
 * Known Statutory Holiday Ranges (YYYY-MM-DD) for China
 * DeepSeek rules: Weekends & statutory holidays are 100% full-day off-peak valley (50% discount)
 */
interface HolidayRange {
  nameZh: string;
  nameEn: string;
  nameRu: string;
  start: string; // YYYY-MM-DD
  end: string;   // YYYY-MM-DD
}

const STATUTORY_HOLIDAYS: HolidayRange[] = [
  // 2025
  { nameZh: '元旦', nameEn: "New Year's Day", nameRu: 'Новый Год', start: '2025-01-01', end: '2025-01-01' },
  { nameZh: '春节', nameEn: 'Spring Festival', nameRu: 'Праздник Весны', start: '2025-01-28', end: '2025-02-04' },
  { nameZh: '清明节', nameEn: 'Tomb Sweeping Day', nameRu: 'Цинмин', start: '2025-04-04', end: '2025-04-06' },
  { nameZh: '劳动节', nameEn: 'Labor Day', nameRu: 'День Труда', start: '2025-05-01', end: '2025-05-05' },
  { nameZh: '端午节', nameEn: 'Dragon Boat Festival', nameRu: 'Праздник Драконьих Лодок', start: '2025-05-31', end: '2025-06-02' },
  { nameZh: '中秋节与国庆节', nameEn: 'National Day', nameRu: 'День Образования КНР', start: '2025-10-01', end: '2025-10-08' },
  
  // 2026
  { nameZh: '元旦', nameEn: "New Year's Day", nameRu: 'Новый Год', start: '2026-01-01', end: '2026-01-03' },
  { nameZh: '春节', nameEn: 'Spring Festival', nameRu: 'Праздник Весны', start: '2026-02-15', end: '2026-02-23' },
  { nameZh: '清明节', nameEn: 'Tomb Sweeping Day', nameRu: 'Цинмин', start: '2026-04-04', end: '2026-04-06' },
  { nameZh: '劳动节', nameEn: 'Labor Day', nameRu: 'День Труда', start: '2026-05-01', end: '2026-05-05' },
  { nameZh: '端午节', nameEn: 'Dragon Boat Festival', nameRu: 'Праздник Драконьих Лодок', start: '2026-06-19', end: '2026-06-21' },
  { nameZh: '中秋节', nameEn: 'Mid-Autumn Festival', nameRu: 'Праздник Середины Осени', start: '2026-09-25', end: '2026-09-27' },
  { nameZh: '国庆节', nameEn: 'National Day', nameRu: 'День Образования КНР', start: '2026-10-01', end: '2026-10-07' },

  // 2027
  { nameZh: '元旦', nameEn: "New Year's Day", nameRu: 'Новый Год', start: '2027-01-01', end: '2027-01-03' },
  { nameZh: '春节', nameEn: 'Spring Festival', nameRu: 'Праздник Весны', start: '2027-02-05', end: '2027-02-12' },
  { nameZh: '清明节', nameEn: 'Tomb Sweeping Day', nameRu: 'Цинмин', start: '2027-04-03', end: '2027-04-05' },
  { nameZh: '劳动节', nameEn: 'Labor Day', nameRu: 'День Труда', start: '2027-05-01', end: '2027-05-05' },
  { nameZh: '端午节', nameEn: 'Dragon Boat Festival', nameRu: 'Праздник Драконьих Лодок', start: '2027-06-08', end: '2027-06-10' },
  { nameZh: '中秋节', nameEn: 'Mid-Autumn Festival', nameRu: 'Праздник Середины Осени', start: '2027-09-15', end: '2027-09-17' },
  { nameZh: '国庆节', nameEn: 'National Day', nameRu: 'День Образования КНР', start: '2027-10-01', end: '2027-10-07' },
];

/**
 * Check if a date in Beijing time is a Statutory Holiday or Weekend
 */
export function checkDayStatus(year: number, month: number, day: number, dayOfWeek: number) {
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Sunday = 0, Saturday = 6
  
  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const holiday = STATUTORY_HOLIDAYS.find((h) => dateStr >= h.start && dateStr <= h.end);

  const isHoliday = !!holiday;
  const isAllDayGu = isWeekend || isHoliday;

  return {
    isWeekend,
    isHoliday,
    holiday,
    isAllDayGu,
  };
}

/**
 * DeepSeek official peak/valley pricing rules (Effective 2026-08-17):
 * 1. 高峰时段 (梁文峰 · 原价 100%):
 *    - 仅工作日 (周一至周五，非法定节假日) 的北京时间 09:00 - 12:00 (3小时) 与 14:00 - 18:00 (4小时)
 * 2. 优惠/空闲时段 (梁文谷 · 5折特惠 50%):
 *    - 周末（周六、周日）全天 24 小时均为 5 折！
 *    - 国家法定节假日（元旦、春节、清明、五一、端午、中秋、国庆等）全天 24 小时均为 5 折！
 *    - 工作日夜间 (00:00 - 09:00)、午休错峰 (12:00 - 14:00)、晚间夜间 (18:00 - 24:00)
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

  // Check today's holiday and weekend status
  const dayStatus = checkDayStatus(bYear, bMonth, bDay, beijingDayOfWeek);
  const isWeekend = dayStatus.isWeekend;
  const isHoliday = dayStatus.isHoliday;
  const isAllDayGu = dayStatus.isAllDayGu;
  const holidayName = isHoliday ? (lang === 'zh' ? dayStatus.holiday?.nameZh : lang === 'en' ? dayStatus.holiday?.nameEn : dayStatus.holiday?.nameRu) : undefined;

  // Decimal hours in Beijing time (e.g. 09:30:00 = 9.5)
  const decimalBeijingHour = bHour + bMinute / 60 + bSecond / 3600;

  // Peak ranges ONLY on workdays (NOT weekend and NOT holiday): 09:00 - 12:00 (3h), 14:00 - 18:00 (4h)
  const inMorningPeak = !isAllDayGu && decimalBeijingHour >= 9 && decimalBeijingHour < 12;
  const inAfternoonPeak = !isAllDayGu && decimalBeijingHour >= 14 && decimalBeijingHour < 18;

  const isFeng = inMorningPeak || inAfternoonPeak;
  const currentPhase: DeepSeekPhase = isFeng ? 'feng' : 'gu';

  // Determine current period description name localized
  let currentPeriodName = '';
  if (isHoliday) {
    if (lang === 'zh') currentPeriodName = `${holidayName || '法定节假日'}特惠 (全天24h · 5折)`;
    else if (lang === 'en') currentPeriodName = `${holidayName || 'Holiday'} Discount (All Day 24h · 50% Off)`;
    else currentPeriodName = `${holidayName || 'Праздник'} (Скидка 50% весь день)`;
  } else if (isWeekend) {
    if (lang === 'zh') currentPeriodName = '周末全天特惠谷时 (全天24h · 5折)';
    else if (lang === 'en') currentPeriodName = 'Weekend Full-day Valley (All Day 24h · 50% Off)';
    else currentPeriodName = 'Выходной день (Скидка 50% весь день)';
  } else if (lang === 'zh') {
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

  // Helper to find the next workday date starting from a given offset (days forward)
  const findNextWorkday = (startDayOffset: number) => {
    let offset = startDayOffset;
    while (offset < 30) {
      const d = new Date(Date.UTC(bYear, bMonth - 1, bDay + offset, 1, 0, 0));
      const testYear = d.getUTCFullYear();
      const testMonth = d.getUTCMonth() + 1;
      const testDay = d.getUTCDate();
      const testDOW = d.getUTCDay();

      const st = checkDayStatus(testYear, testMonth, testDay, testDOW);
      if (!st.isAllDayGu) {
        return {
          year: testYear,
          month: testMonth,
          day: testDay,
          dayOfWeek: testDOW,
          offsetDays: offset,
        };
      }
      offset++;
    }
    // Fallback
    return { year: bYear, month: bMonth, day: bDay + startDayOffset, dayOfWeek: 1, offsetDays: startDayOffset };
  };

  if (isAllDayGu) {
    // Currently in Weekend or Holiday: next peak is the next workday morning at 09:00!
    const nextWd = findNextWorkday(1);
    nextTransitionYear = nextWd.year;
    nextTransitionMonth = nextWd.month;
    nextTransitionDay = nextWd.day;
    nextTransitionHour = 9;
    nextTransitionMinute = 0;
    nextCharacterName = lang === 'zh' ? '梁文峰' : lang === 'en' ? 'Liang Wenpeak' : 'Пиковый Лян';

    if (lang === 'zh') {
      const dayLabel = nextWd.offsetDays === 1 ? '明日' : nextWd.dayOfWeek === 1 ? '下周一' : `节后工作日(${nextWd.month}月${nextWd.day}日)`;
      nextPhaseName = `${dayLabel}上午高峰 (09:00 · 梁文峰 · 原价)`;
    } else if (lang === 'en') {
      const dayLabel = nextWd.offsetDays === 1 ? 'Tomorrow' : nextWd.dayOfWeek === 1 ? 'Next Mon' : `Next Workday (${nextWd.month}/${nextWd.day})`;
      nextPhaseName = `${dayLabel} Morning Peak (09:00 · 100%)`;
    } else {
      const dayLabel = nextWd.offsetDays === 1 ? 'Завтра' : nextWd.dayOfWeek === 1 ? 'Пн' : `Рабочий день (${nextWd.day}.${nextWd.month})`;
      nextPhaseName = `${dayLabel} Утренний пик (09:00 · 100%)`;
    }
  } else {
    // Normal Workday
    if (decimalBeijingHour < 9) {
      nextTransitionHour = 9;
      nextTransitionMinute = 0;
      nextCharacterName = lang === 'zh' ? '梁文峰' : lang === 'en' ? 'Liang Wenpeak' : 'Пиковый Лян';
      nextPhaseName = lang === 'zh' 
        ? '上午高峰时段 (09:00 · 梁文峰 · 原价)' 
        : lang === 'en' ? 'Morning Peak (09:00 · Liang Wenpeak · 100%)' : 'Утренний пик (09:00 · Пиковый Лян · 100%)';
    } else if (decimalBeijingHour >= 9 && decimalBeijingHour < 12) {
      nextTransitionHour = 12;
      nextTransitionMinute = 0;
      nextCharacterName = lang === 'zh' ? '梁文谷' : lang === 'en' ? 'Liang Wentrough' : 'Долинный Лян';
      nextPhaseName = lang === 'zh' 
        ? '午间错峰谷时 (12:00 · 梁文谷 · 5折)' 
        : lang === 'en' ? 'Noon Valley (12:00 · Liang Wentrough · 50% Off)' : 'Обеденная скидка (12:00 · Долинный Лян · 50%)';
    } else if (decimalBeijingHour >= 12 && decimalBeijingHour < 14) {
      nextTransitionHour = 14;
      nextTransitionMinute = 0;
      nextCharacterName = lang === 'zh' ? '梁文峰' : lang === 'en' ? 'Liang Wenpeak' : 'Пиковый Лян';
      nextPhaseName = lang === 'zh' 
        ? '下午高峰时段 (14:00 · 梁文峰 · 原价)' 
        : lang === 'en' ? 'Afternoon Peak (14:00 · Liang Wenpeak · 100%)' : 'Дневной пик (14:00 · Пиковый Лян · 100%)';
    } else if (decimalBeijingHour >= 14 && decimalBeijingHour < 18) {
      nextTransitionHour = 18;
      nextTransitionMinute = 0;
      nextCharacterName = lang === 'zh' ? '梁文谷' : lang === 'en' ? 'Liang Wentrough' : 'Долинный Лян';
      nextPhaseName = lang === 'zh' 
        ? '晚间夜间谷时 (18:00 · 梁文谷 · 5折)' 
        : lang === 'en' ? 'Evening Valley (18:00 · Liang Wentrough · 50% Off)' : 'Вечерняя скидка (18:00 · Долинный Лян · 50%)';
    } else {
      // 18:00 - 24:00 on workday: search for next workday 09:00
      const nextWd = findNextWorkday(1);
      nextTransitionYear = nextWd.year;
      nextTransitionMonth = nextWd.month;
      nextTransitionDay = nextWd.day;
      nextTransitionHour = 9;
      nextTransitionMinute = 0;
      nextCharacterName = lang === 'zh' ? '梁文峰' : lang === 'en' ? 'Liang Wenpeak' : 'Пиковый Лян';

      if (lang === 'zh') {
        const dayLabel = nextWd.offsetDays === 1 ? '明日' : nextWd.dayOfWeek === 1 ? '下周一' : `节后工作日(${nextWd.month}月${nextWd.day}日)`;
        nextPhaseName = `${dayLabel}上午高峰 (09:00 · 梁文峰 · 原价)`;
      } else if (lang === 'en') {
        const dayLabel = nextWd.offsetDays === 1 ? 'Tomorrow' : nextWd.dayOfWeek === 1 ? 'Next Mon' : `Next Workday (${nextWd.month}/${nextWd.day})`;
        nextPhaseName = `${dayLabel} Morning Peak (09:00 · 100%)`;
      } else {
        const dayLabel = nextWd.offsetDays === 1 ? 'Завтра' : nextWd.dayOfWeek === 1 ? 'Пн' : `Рабочий день (${nextWd.day}.${nextWd.month})`;
        nextPhaseName = `${dayLabel} Утренний пик (09:00 · 100%)`;
      }
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

  const totalHoursLeft = Math.floor(countdownSeconds / 3600);
  const minsLeft = Math.floor((countdownSeconds % 3600) / 60);
  const secsLeft = countdownSeconds % 60;

  // Format countdown string: if >= 24h, show e.g. "1天 14:20:15" or "38:20:15"
  let countdownFormatted = '';
  if (totalHoursLeft >= 24) {
    const days = Math.floor(totalHoursLeft / 24);
    const remainHours = totalHoursLeft % 24;
    if (lang === 'zh') {
      countdownFormatted = `${days}天 ${String(remainHours).padStart(2, '0')}:${String(minsLeft).padStart(2, '0')}:${String(secsLeft).padStart(2, '0')}`;
    } else if (lang === 'en') {
      countdownFormatted = `${days}d ${String(remainHours).padStart(2, '0')}:${String(minsLeft).padStart(2, '0')}:${String(secsLeft).padStart(2, '0')}`;
    } else {
      countdownFormatted = `${days}д ${String(remainHours).padStart(2, '0')}:${String(minsLeft).padStart(2, '0')}:${String(secsLeft).padStart(2, '0')}`;
    }
  } else {
    countdownFormatted = `${String(totalHoursLeft).padStart(2, '0')}:${String(minsLeft).padStart(2, '0')}:${String(secsLeft).padStart(2, '0')}`;
  }

  const beijingTimeString = `${String(bHour).padStart(2, '0')}:${String(bMinute).padStart(2, '0')}:${String(bSecond).padStart(2, '0')}`;
  const dayProgressPercent = Math.min(100, Math.max(0, (decimalBeijingHour / 24) * 100));

  const charName = lang === 'zh' ? (isFeng ? '梁文峰' : '梁文谷') : lang === 'en' ? (isFeng ? 'Liang Wenpeak' : 'Liang Wentrough') : (isFeng ? 'Пиковый Лян' : 'Долинный Лян');
  const phaseName = lang === 'zh' 
    ? (isFeng ? '高峰时段 (繁忙原价 100%)' : isHoliday ? `法定节假日 (${holidayName || '节假日'} · 5折特惠)` : isWeekend ? '周末特惠 (全天 5折半价)' : '空闲谷时 (5折半价特惠 50%)')
    : lang === 'en'
    ? (isFeng ? 'Peak Hours (100% Standard)' : isHoliday ? `Holiday (${holidayName || 'Holiday'} 50% Off)` : isWeekend ? 'Weekend (All Day 50% Off)' : 'Off-Peak Valley (50% Off)')
    : (isFeng ? 'Пиковый период (100%)' : isHoliday ? `Праздник (Скидка 50%)` : isWeekend ? 'Выходные (Скидка 50%)' : 'Непиковый период (Скидка 50%)');

  const tagline = lang === 'zh'
    ? (isFeng ? '高峰繁忙 · 原价输出' : isHoliday ? '法定假期 · 全天5折特惠' : isWeekend ? '周末双休 · 全天5折特惠' : '错峰空闲 · 5折特惠')
    : lang === 'en'
    ? (isFeng ? 'Peak Traffic · Standard Rate' : isHoliday ? 'Holiday · 24h 50% Discount' : isWeekend ? 'Weekend · 24h 50% Discount' : 'Off-Peak Hours · 50% Discount')
    : (isFeng ? 'Высокая нагрузка · 100%' : isHoliday ? 'Праздник · Скидка 50%' : isWeekend ? 'Выходные · Скидка 50%' : 'Непиковые часы · Скидка 50%');

  const discountRate = lang === 'zh'
    ? (isFeng ? '100% (标准原价)' : '50% (5折半价)')
    : lang === 'en'
    ? (isFeng ? '100% (Standard)' : '50% (50% Off)')
    : (isFeng ? '100% (Стандарт)' : '50% (Скидка 50%)');

  const description = lang === 'zh'
    ? (isFeng
      ? `当前处于【梁文峰】繁忙高峰期（${currentPeriodName}），属于 API 调用高并发时段，按标准费率 100% 计费。`
      : isHoliday
      ? `当前处于【${holidayName || '法定节假日'}】全天优惠期（${currentPeriodName}），全天 24 小时享受 5 折（50% 折扣），推荐批量跑批！`
      : isWeekend
      ? `当前处于【周末】全天优惠期（${currentPeriodName}），周六与周日全天 24 小时均享受 5 折（50% 折扣），无需掐点即可畅快调用！`
      : `当前处于【梁文谷】错峰优惠期（${currentPeriodName}），API 调用价格立享 5 折（50% 折扣），推荐批量跑批！`)
    : lang === 'en'
    ? (isFeng
      ? `Currently in [${charName}] peak traffic period (${currentPeriodName}). API requests are charged at the standard 100% rate.`
      : isHoliday
      ? `Currently enjoying [${holidayName || 'Holiday'}] all-day off-peak window! All API calls are 50% off for 24 hours.`
      : isWeekend
      ? `Currently enjoying weekend all-day off-peak window! Saturday & Sunday are 100% discounted at 50% off.`
      : `Currently in [${charName}] off-peak window (${currentPeriodName})! API calls enjoy an instant 50% discount. Perfect for batch runs!`)
    : (isFeng
      ? `Сейчас действует пиковый период [${charName}] (${currentPeriodName}). Запросы тарифицируются по 100% стоимости.`
      : isHoliday || isWeekend
      ? `Сейчас действуют выходные/праздничные дни! Скидка 50% на все вызовы API в течение всех 24 часов.`
      : `Сейчас действует скидочный период [${charName}] (${currentPeriodName})! Скидка 50% на все вызовы API.`);

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
    isHoliday,
    holidayName,
    isAllDayGu,
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
