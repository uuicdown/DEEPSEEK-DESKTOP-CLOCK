import { DeepSeekPhase, PhaseInfo } from '../types';

/**
 * Calculates current phase (梁文峰 vs 梁文谷) and time statistics
 * Note: DeepSeek peak hours are strictly based on Beijing Time (UTC+8):
 * 1. 高峰时段 (梁文峰 · 原价):
 *    - 工作日 (周一至周五): 09:00 - 12:00 以及 14:00 - 18:00 (UTC+8)
 *    - API 业务调用繁忙期，价格为标准费率 (100%)
 * 2. 空闲时段 (梁文谷 · 5折特惠):
 *    - 工作日午间 (12:00 - 14:00)、晚间夜间 (18:00 - 次日 09:00)
 *    - 周末 (周六、周日全天) 及法定节假日
 *    - API 调用价格为高峰时段的一半 (50% 折扣)
 */
export function getPhaseInfo(targetDate: Date = new Date()): PhaseInfo {
  // Obtain Beijing Time (Asia/Shanghai) parts accurately
  const beijingFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Shanghai',
    hour12: false,
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

  const bYear = parseInt(findPart('year'), 10) || 2026;
  const bMonth = parseInt(findPart('month'), 10) || 1;
  const bDay = parseInt(findPart('day'), 10) || 1;
  const bHour = parseInt(findPart('hour'), 10) || 0;
  const bMinute = parseInt(findPart('minute'), 10) || 0;
  const bSecond = parseInt(findPart('second'), 10) || 0;
  const bWeekdayStr = findPart('weekday'); // e.g. 'Mon', 'Tue', ...

  const weekdayMap: Record<string, { day: number; name: string }> = {
    Sun: { day: 0, name: '星期日' },
    Mon: { day: 1, name: '星期一' },
    Tue: { day: 2, name: '星期二' },
    Wed: { day: 3, name: '星期三' },
    Thu: { day: 4, name: '星期四' },
    Fri: { day: 5, name: '星期五' },
    Sat: { day: 6, name: '星期六' },
  };

  const weekdayInfo = weekdayMap[bWeekdayStr] || { day: 1, name: '星期一' };
  const beijingDayOfWeek = weekdayInfo.day;
  const beijingWeekdayName = weekdayInfo.name;
  const isWeekend = beijingDayOfWeek === 0 || beijingDayOfWeek === 6;

  // Decimal hours in Beijing time (e.g. 9:30 = 9.5)
  const decimalBeijingHour = bHour + bMinute / 60 + bSecond / 3600;

  // Peak ranges on weekdays: 09:00 - 12:00, 14:00 - 18:00
  const inMorningPeak = !isWeekend && decimalBeijingHour >= 9 && decimalBeijingHour < 12;
  const inAfternoonPeak = !isWeekend && decimalBeijingHour >= 14 && decimalBeijingHour < 18;

  const isFeng = inMorningPeak || inAfternoonPeak;
  const currentPhase: DeepSeekPhase = isFeng ? 'feng' : 'gu';

  // Determine current period description name
  let currentPeriodName = '';
  if (isWeekend) {
    currentPeriodName = beijingDayOfWeek === 6 ? '周六全天特惠' : '周日全天特惠';
  } else if (inMorningPeak) {
    currentPeriodName = '上午高峰 (09:00 - 12:00)';
  } else if (decimalBeijingHour >= 12 && decimalBeijingHour < 14) {
    currentPeriodName = '午间错峰空闲 (12:00 - 14:00)';
  } else if (inAfternoonPeak) {
    currentPeriodName = '下午高峰 (14:00 - 18:00)';
  } else if (decimalBeijingHour >= 18) {
    currentPeriodName = '晚间夜间空闲 (18:00 - 次日 09:00)';
  } else {
    currentPeriodName = '凌晨夜间空闲 (00:00 - 09:00)';
  }

  // Calculate next phase transition timestamp
  let nextTransitionYear = bYear;
  let nextTransitionMonth = bMonth;
  let nextTransitionDay = bDay;
  let nextTransitionHour = 9;
  let nextTransitionMinute = 0;
  let nextPhaseName = '';
  let nextCharacterName = '';

  if (isWeekend) {
    // Weekend is all Gu. Next transition is Monday 09:00 CST
    const daysUntilMonday = beijingDayOfWeek === 6 ? 2 : 1; // Sat -> +2, Sun -> +1
    const nextDate = new Date(Date.UTC(bYear, bMonth - 1, bDay + daysUntilMonday, 1, 0, 0)); // 09:00 CST is 01:00 UTC
    nextTransitionYear = nextDate.getUTCFullYear();
    nextTransitionMonth = nextDate.getUTCMonth() + 1;
    nextTransitionDay = nextDate.getUTCDate();
    nextTransitionHour = 9;
    nextTransitionMinute = 0;
    nextPhaseName = '高峰时段 (周一 09:00 · 梁文峰)';
    nextCharacterName = '梁文峰';
  } else {
    // Weekday transitions
    if (decimalBeijingHour < 9) {
      // 00:00 - 09:00 (Gu) -> Next: 09:00 Feng
      nextTransitionHour = 9;
      nextTransitionMinute = 0;
      nextPhaseName = '上午高峰 (09:00 · 梁文峰 · 原价)';
      nextCharacterName = '梁文峰';
    } else if (decimalBeijingHour >= 9 && decimalBeijingHour < 12) {
      // 09:00 - 12:00 (Feng) -> Next: 12:00 Gu
      nextTransitionHour = 12;
      nextTransitionMinute = 0;
      nextPhaseName = '午间空闲 (12:00 · 梁文谷 · 5折)';
      nextCharacterName = '梁文谷';
    } else if (decimalBeijingHour >= 12 && decimalBeijingHour < 14) {
      // 12:00 - 14:00 (Gu) -> Next: 14:00 Feng
      nextTransitionHour = 14;
      nextTransitionMinute = 0;
      nextPhaseName = '下午高峰 (14:00 · 梁文峰 · 原价)';
      nextCharacterName = '梁文峰';
    } else if (decimalBeijingHour >= 14 && decimalBeijingHour < 18) {
      // 14:00 - 18:00 (Feng) -> Next: 18:00 Gu
      nextTransitionHour = 18;
      nextTransitionMinute = 0;
      nextPhaseName = '晚间空闲 (18:00 · 梁文谷 · 5折)';
      nextCharacterName = '梁文谷';
    } else {
      // >= 18:00 (Gu) -> Next peak is tomorrow or Monday
      if (beijingDayOfWeek === 5) {
        // Friday after 18:00 -> Next peak is Monday 09:00
        const nextDate = new Date(Date.UTC(bYear, bMonth - 1, bDay + 3, 1, 0, 0));
        nextTransitionYear = nextDate.getUTCFullYear();
        nextTransitionMonth = nextDate.getUTCMonth() + 1;
        nextTransitionDay = nextDate.getUTCDate();
        nextTransitionHour = 9;
        nextTransitionMinute = 0;
        nextPhaseName = '下周一高峰 (09:00 · 梁文峰)';
        nextCharacterName = '梁文峰';
      } else {
        // Mon-Thu after 18:00 -> Next peak is tomorrow 09:00
        const nextDate = new Date(Date.UTC(bYear, bMonth - 1, bDay + 1, 1, 0, 0));
        nextTransitionYear = nextDate.getUTCFullYear();
        nextTransitionMonth = nextDate.getUTCMonth() + 1;
        nextTransitionDay = nextDate.getUTCDate();
        nextTransitionHour = 9;
        nextTransitionMinute = 0;
        nextPhaseName = '明日上午高峰 (09:00 · 梁文峰)';
        nextCharacterName = '梁文峰';
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

  const hoursLeft = Math.floor(countdownSeconds / 3600);
  const minsLeft = Math.floor((countdownSeconds % 3600) / 60);
  const secsLeft = countdownSeconds % 60;
  const countdownFormatted = `${String(hoursLeft).padStart(2, '0')}:${String(minsLeft).padStart(2, '0')}:${String(secsLeft).padStart(2, '0')}`;

  const beijingTimeString = `${String(bHour).padStart(2, '0')}:${String(bMinute).padStart(2, '0')}:${String(bSecond).padStart(2, '0')}`;
  const dayProgressPercent = Math.min(100, Math.max(0, (decimalBeijingHour / 24) * 100));

  return {
    currentPhase,
    phaseName: isFeng ? '高峰时段 (繁忙原价)' : '空闲时段 (5折半价特惠)',
    characterName: isFeng ? '梁文峰' : '梁文谷',
    description: isFeng
      ? `当前处于【梁文峰】繁忙高峰时段（${currentPeriodName}），属于 API 调用繁忙期，价格按标准费率计费。`
      : `当前处于【梁文谷】空闲时段（${currentPeriodName}），包括夜间、午间、周末全天，API 调用价格立享 50%（5折）半价！`,
    tagline: isFeng ? '高峰繁忙 · 原价输出' : '空闲错峰 · 半价特惠',
    discountRate: isFeng ? '100% (标准原价)' : '50% (5折半价)',
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
 * Format date & time for given timezone
 */
export function formatTimeInZone(date: Date, timeZone: string, use24h: boolean = true) {
  const options: Intl.DateTimeFormatOptions = {
    timeZone,
    hour12: !use24h,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };

  const timeStr = new Intl.DateTimeFormat('zh-CN', options).format(date);

  const dateOptions: Intl.DateTimeFormatOptions = {
    timeZone,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  };
  const dateStr = new Intl.DateTimeFormat('zh-CN', dateOptions).format(date);

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
    const months = ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '腊月'];
    const days = [
      '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
      '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
      '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十',
    ];

    // Simple fallback string
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
