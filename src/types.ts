export type DeepSeekPhase = 'feng' | 'gu';
export type Language = 'zh' | 'en' | 'ru';

export interface TimezoneOption {
  id: string;
  name: string;
  city: string;
  timeZone: string;
  offsetLabel: string;
  names?: { zh: string; en: string; ru: string };
  cities?: { zh: string; en: string; ru: string };
}

export interface ClockTheme {
  id: string;
  name: string;
  names?: { zh: string; en: string; ru: string };
  bgClass: string;
  cardBgClass: string;
  borderClass: string;
  accentText: string;
  glowClass: string;
  badgeBg: string;
  textColor: string;
  secondaryText: string;
}

export interface ModelPricing {
  modelId: string;
  modelName: string;
  description: string;
  contextWindow: string;
  maxOutput: string;
  cny: {
    feng: {
      inputMiss: number; // ¥ per 1M tokens
      inputHit: number;  // ¥ per 1M tokens
      output: number;    // ¥ per 1M tokens
    };
    gu: {
      inputMiss: number;
      inputHit: number;
      output: number;
    };
  };
  usd: {
    feng: {
      inputMiss: number; // $ per 1M tokens
      inputHit: number;  // $ per 1M tokens
      output: number;    // $ per 1M tokens
    };
    gu: {
      inputMiss: number;
      inputHit: number;
      output: number;
    };
  };
}

export interface PhaseInfo {
  currentPhase: DeepSeekPhase;
  phaseName: string;
  characterName: string; // '梁文峰' or '梁文谷'
  description: string;
  tagline: string;
  discountRate: string;
  beijingHour: number;
  beijingMinute: number;
  beijingSecond: number;
  beijingTimeString: string;
  isWeekend: boolean;
  isHoliday: boolean;
  holidayName?: string;
  isAllDayGu: boolean;
  beijingDayOfWeek: number; // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
  beijingWeekdayName: string;
  currentPeriodName: string; // e.g. "上午高峰期", "午间谷时", "下午高峰期", "夜间谷时", "周末全天谷时", "法定节假日谷时"
  nextPhaseTime: Date;
  nextPhaseName: string;
  nextCharacterName: string;
  countdownSeconds: number;
  countdownFormatted: string;
  dayProgressPercent: number;
}
