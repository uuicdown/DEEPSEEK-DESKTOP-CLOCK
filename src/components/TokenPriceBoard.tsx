import React, { useState } from 'react';
import { 
  Coins, 
  Calculator, 
  Zap, 
  Database, 
  Sun, 
  Moon,
  Sparkles,
  Layers,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Brain,
  Sliders
} from 'lucide-react';
import { DEEPSEEK_MODELS } from '../data/deepseekPrices';
import { ClockTheme, Language, PhaseInfo } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface TokenPriceBoardProps {
  phaseInfo: PhaseInfo;
  currentTheme: ClockTheme;
  language: Language;
}

export const TokenPriceBoard: React.FC<TokenPriceBoardProps> = ({
  phaseInfo,
  currentTheme,
  language,
}) => {
  const [currency, setCurrency] = useState<'cny' | 'usd'>('cny');
  const [unit, setUnit] = useState<'1M' | '1K'>('1M');
  const [showCalculator, setShowCalculator] = useState(false);
  const [modelFilter, setModelFilter] = useState<'all' | 'flash' | 'vision' | 'pro' | 'reasoning'>('all');

  const t = TRANSLATIONS[language];

  // Calculator states - default to V4 Flash
  const [calcModel, setCalcModel] = useState<string>('deepseek-v4-flash');
  const [calcInputTokens, setCalcInputTokens] = useState<number>(500000); // 500k default
  const [calcOutputTokens, setCalcOutputTokens] = useState<number>(200000); // 200k default
  const [calcCacheHitRate, setCalcCacheHitRate] = useState<number>(60); // 60% hit rate

  const isGu = phaseInfo.currentPhase === 'gu';
  const currencySymbol = currency === 'cny' ? '¥' : '$';
  const unitDivider = unit === '1M' ? 1 : 1000;
  const unitLabel = unit === '1M' ? '/ 1M' : '/ 1K';

  const formatPrice = (val: number) => {
    const adjusted = val / unitDivider;
    if (adjusted < 0.001) return adjusted.toFixed(5);
    if (adjusted < 0.01) return adjusted.toFixed(4);
    if (adjusted < 1) return adjusted.toFixed(3);
    return adjusted.toFixed(2);
  };

  const filteredModels = DEEPSEEK_MODELS.filter((m) => {
    if (modelFilter === 'flash') return m.modelId === 'deepseek-v4-flash';
    if (modelFilter === 'vision') return m.modelId.includes('vision');
    if (modelFilter === 'pro') return m.modelId.includes('pro');
    if (modelFilter === 'reasoning') return m.modelId.includes('r1') || m.modelId.includes('v3');
    return true;
  });

  // Calculator calculations
  const selectedModel = DEEPSEEK_MODELS.find(m => m.modelId === calcModel) || DEEPSEEK_MODELS[0];
  const activePricing = currency === 'cny' ? selectedModel.cny : selectedModel.usd;

  const hitInputTokens = calcInputTokens * (calcCacheHitRate / 100);
  const missInputTokens = calcInputTokens * (1 - calcCacheHitRate / 100);

  // Feng cost
  const fengInputCost = (missInputTokens / 1000000) * activePricing.feng.inputMiss + (hitInputTokens / 1000000) * activePricing.feng.inputHit;
  const fengOutputCost = (calcOutputTokens / 1000000) * activePricing.feng.output;
  const totalFengCost = fengInputCost + fengOutputCost;

  // Gu cost (50% discount)
  const guInputCost = (missInputTokens / 1000000) * activePricing.gu.inputMiss + (hitInputTokens / 1000000) * activePricing.gu.inputHit;
  const guOutputCost = (calcOutputTokens / 1000000) * activePricing.gu.output;
  const totalGuCost = guInputCost + guOutputCost;

  const moneySaved = totalFengCost - totalGuCost;

  return (
    <section className="relative w-full">
      {/* Header Bar & Global Control Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        {/* Title & Live Status Indicator */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 shadow-sm flex-shrink-0">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {t.priceBoardTitle}
              </h3>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border flex items-center gap-1.5 shadow-sm ${
                isGu
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isGu ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                {isGu ? t.priceBoardSubGu : t.priceBoardSubFeng}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {t.priceBoardDesc}
            </p>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Model Filter Pills */}
          <div className="flex flex-wrap rounded-2xl bg-slate-950/80 p-1 text-xs shadow-inner">
            <button
              onClick={() => setModelFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                modelFilter === 'all' ? 'bg-slate-700 text-white font-bold shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.filterAll}
            </button>
            <button
              onClick={() => setModelFilter('flash')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                modelFilter === 'flash' ? 'bg-blue-600 text-white font-bold shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.filterFlash}
            </button>
            <button
              onClick={() => setModelFilter('vision')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer flex items-center gap-1 ${
                modelFilter === 'vision' ? 'bg-purple-600 text-white font-bold shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3 h-3 text-pink-300" />
              {t.filterVision}
            </button>
            <button
              onClick={() => setModelFilter('pro')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                modelFilter === 'pro' ? 'bg-indigo-600 text-white font-bold shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.filterPro}
            </button>
            <button
              onClick={() => setModelFilter('reasoning')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                modelFilter === 'reasoning' ? 'bg-emerald-600 text-white font-bold shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.filterReasoning}
            </button>
          </div>

          {/* Currency Toggle */}
          <div className="flex rounded-2xl bg-slate-950/80 p-1 text-xs shadow-inner">
            <button
              id="currency-cny-button"
              onClick={() => setCurrency('cny')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                currency === 'cny'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.cny}
            </button>
            <button
              id="currency-usd-button"
              onClick={() => setCurrency('usd')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                currency === 'usd'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.usd}
            </button>
          </div>

          {/* Unit Toggle */}
          <div className="flex rounded-2xl bg-slate-950/80 p-1 text-xs shadow-inner">
            <button
              id="unit-1m-button"
              onClick={() => setUnit('1M')}
              className={`px-2.5 py-1.5 rounded-xl font-mono font-bold transition-all cursor-pointer ${
                unit === '1M'
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              /1M
            </button>
            <button
              id="unit-1k-button"
              onClick={() => setUnit('1K')}
              className={`px-2.5 py-1.5 rounded-xl font-mono font-bold transition-all cursor-pointer ${
                unit === '1K'
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              /1K
            </button>
          </div>

          {/* Calculator Toggle Button */}
          <button
            id="toggle-calculator-button"
            onClick={() => setShowCalculator(!showCalculator)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              showCalculator
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:text-white shadow-md'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 text-indigo-400" />
            <span>{showCalculator ? t.hideCalculator : t.calculator}</span>
          </button>
        </div>
      </div>

      {/* Model Pricing Grid: Optimized Responsive Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">
        {filteredModels.map((model) => {
          const pricing = currency === 'cny' ? model.cny : model.usd;
          const currentModelPricing = isGu ? pricing.gu : pricing.feng;
          const isV4 = model.modelId.startsWith('deepseek-v4');
          const isVision = model.modelId.includes('vision');
          const isReasoning = model.modelId.includes('r1');
          const isPro = model.modelId.includes('pro');

          return (
            <div
              key={model.modelId}
              className={`relative rounded-3xl p-5 sm:p-6 transition-all duration-300 ${
                currentTheme.cardBgClass
              } ${
                isVision 
                  ? 'shadow-[0_15px_40px_-10px_rgba(168,85,247,0.3)]' 
                  : isV4 
                    ? 'shadow-[0_15px_40px_-10px_rgba(59,130,246,0.25)]' 
                    : 'shadow-xl'
              } flex flex-col justify-between`}
            >
              <div>
                {/* 1. Header Section: Title, Badges, and Context Limit */}
                <div className="mb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      {/* Model Name */}
                      <h4 className="text-xl font-black text-white tracking-tight leading-snug">
                        {model.modelName}
                      </h4>

                      {/* Tag / Badge Placed Below Model Name */}
                      <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                        {isVision && (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-gradient-to-r from-purple-600/90 to-pink-600/90 text-white shadow-sm flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3 text-yellow-300" />
                            {language === 'zh' ? '最新多模态旗舰' : language === 'en' ? 'Multimodal Flagship' : 'Мультимодальный флагман'}
                          </span>
                        )}
                        {isPro && (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-indigo-600/90 text-white shadow-sm flex items-center gap-1.5">
                            <Cpu className="w-3 h-3 text-indigo-200" />
                            {language === 'zh' ? '全能专业旗舰' : language === 'en' ? 'Pro Flagship' : 'Про Флагман'}
                          </span>
                        )}
                        {isV4 && !isVision && !isPro && (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-blue-600/90 text-white shadow-sm flex items-center gap-1.5">
                            <Zap className="w-3 h-3 text-yellow-300" />
                            {language === 'zh' ? '新一代极速旗舰' : language === 'en' ? 'Next-Gen Fast Flagship' : 'Скоростной флагман'}
                          </span>
                        )}
                        {isReasoning && (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-emerald-600/90 text-white shadow-sm flex items-center gap-1.5">
                            <Brain className="w-3 h-3 text-emerald-200" />
                            {language === 'zh' ? '深度逻辑推理' : language === 'en' ? 'Deep Reasoning' : 'Глубокие рассуждения'}
                          </span>
                        )}
                        {model.modelId === 'deepseek-v3' && (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-slate-700/90 text-slate-200 shadow-sm flex items-center gap-1.5">
                            <Layers className="w-3 h-3 text-blue-300" />
                            {language === 'zh' ? '开源通用对话' : language === 'en' ? 'Open-Source Chat' : 'Универсальный диалог'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Context Window Tag */}
                    <div className="flex-shrink-0 pt-0.5">
                      <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-xl bg-blue-950/80 text-blue-300 shadow-sm whitespace-nowrap">
                        {model.contextWindow}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-400 mt-2.5 leading-relaxed min-h-[36px]">
                    {language === 'zh'
                      ? model.description
                      : language === 'en'
                        ? (model.modelId.includes('vision')
                            ? 'Experimental multimodal flagship matching V4-Flash with strong vision agent benchmarks.'
                            : model.modelId.includes('flash')
                            ? 'Next-gen high throughput and ultra-low latency flagship for high-frequency workloads.'
                            : model.modelId.includes('pro')
                            ? 'Next-gen all-round professional flagship with advanced coding and deep reasoning.'
                            : model.modelId.includes('r1')
                            ? 'Deep reasoning model specialized in math, code logic, and step-by-step thinking.'
                            : 'General conversational LLM with exceptional multilingual ability and cost efficiency.')
                        : (model.modelId.includes('vision')
                            ? 'Экспериментальный мультимодальный флагман с визуальным анализом.'
                            : model.modelId.includes('flash')
                            ? 'Флагман нового поколения с высокой пропускной способностью и низкой задержкой.'
                            : model.modelId.includes('pro')
                            ? 'Универсальный профессиональный флагман для сложного кода и логики.'
                            : 'Флагман для глубоких рассуждений и диалогов.')}
                  </p>
                </div>

                {/* 2. Real-Time Active Rate Box (当前执行计费标准) */}
                <div className={`rounded-2xl p-3.5 transition-all ${
                  isGu
                    ? 'bg-gradient-to-b from-emerald-950/50 to-slate-950/80 shadow-[0_10px_30px_-10px_rgba(16,185,129,0.3)]'
                    : 'bg-gradient-to-b from-amber-950/40 to-slate-950/80 shadow-[0_10px_30px_-10px_rgba(245,158,11,0.3)]'
                }`}>
                  {/* Status Row */}
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-1.5">
                      <Zap className={`w-3.5 h-3.5 ${isGu ? 'text-emerald-400 animate-pulse' : 'text-amber-400'}`} />
                      <span className="text-xs font-bold text-white">
                        {isGu ? (
                          <span className="text-emerald-300">
                            {language === 'zh' ? '⚡ 当前执行：梁文谷 5折' : language === 'en' ? '⚡ Active: Valley 50% Off' : '⚡ Активно: Скидка 50%'}
                          </span>
                        ) : (
                          <span className="text-amber-300">
                            {language === 'zh' ? '☀️ 当前执行：梁文峰 原价' : language === 'en' ? '☀️ Active: Peak Standard' : '☀️ Активно: Пик 100%'}
                          </span>
                        )}
                      </span>
                    </div>

                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-wide uppercase shadow-sm ${
                      isGu 
                        ? 'bg-emerald-500/20 text-emerald-300' 
                        : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {t.liveActive}
                    </span>
                  </div>

                  {/* 3-Column Token Price Visual Cards */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {/* Input Miss */}
                    <div className="p-2 rounded-xl bg-slate-950/70 shadow-inner flex flex-col justify-between">
                      <div className="text-[10px] text-slate-400 mb-0.5 truncate font-medium">
                        {t.inputMiss}
                      </div>
                      <div className="font-mono text-sm sm:text-base font-black text-white">
                        {currencySymbol}{formatPrice(currentModelPricing.inputMiss)}
                      </div>
                      <div className="text-[9px] text-slate-500 font-mono mt-0.5">
                        {unitLabel}
                      </div>
                    </div>

                    {/* Input Hit (Cache) */}
                    <div className="p-2 rounded-xl bg-emerald-950/40 shadow-inner flex flex-col justify-between">
                      <div className="text-[10px] text-emerald-400 font-bold mb-0.5 flex items-center justify-center gap-0.5 truncate">
                        <Database className="w-2.5 h-2.5 flex-shrink-0" />
                        <span className="truncate">{t.inputHit}</span>
                      </div>
                      <div className="font-mono text-sm sm:text-base font-black text-emerald-300">
                        {currencySymbol}{formatPrice(currentModelPricing.inputHit)}
                      </div>
                      <div className="text-[9px] text-emerald-500 font-mono font-semibold mt-0.5">
                        {language === 'zh' ? '省90%+' : 'Save 90%'}
                      </div>
                    </div>

                    {/* Output */}
                    <div className="p-2 rounded-xl bg-slate-950/70 shadow-inner flex flex-col justify-between">
                      <div className="text-[10px] text-slate-400 mb-0.5 truncate font-medium">
                        {t.output}
                      </div>
                      <div className="font-mono text-sm sm:text-base font-black text-white">
                        {currencySymbol}{formatPrice(currentModelPricing.output)}
                      </div>
                      <div className="text-[9px] text-slate-500 font-mono mt-0.5">
                        {unitLabel}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Peak vs Valley Rate Comparison Matrix */}
                <div className="mt-3 rounded-2xl bg-slate-950/60 p-3 text-xs shadow-inner">
                  <div className="text-slate-400 font-semibold mb-2 flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3 h-3 text-blue-400" />
                      {t.rateTable}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {language === 'zh' ? '未命中 / 缓存命中 / 输出' : 'Miss / Hit / Output'}
                    </span>
                  </div>

                  {/* Peak standard row */}
                  <div className="flex items-center justify-between py-1.5">
                    <div className="flex items-center gap-1.5 text-amber-300 font-medium min-w-0">
                      <Sun className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
                      <span className="truncate">{t.peakRowTitle}</span>
                    </div>
                    <div className="font-mono font-bold text-slate-200 text-right text-[11px] sm:text-xs">
                      <span className="text-slate-300">{currencySymbol}{formatPrice(pricing.feng.inputMiss)}</span>
                      <span className="text-slate-600 mx-1">/</span>
                      <span className="text-emerald-400">{currencySymbol}{formatPrice(pricing.feng.inputHit)}</span>
                      <span className="text-slate-600 mx-1">/</span>
                      <span className="text-slate-300">{currencySymbol}{formatPrice(pricing.feng.output)}</span>
                    </div>
                  </div>

                  {/* Valley discounted row */}
                  <div className="flex items-center justify-between py-1.5">
                    <div className="flex items-center gap-1.5 text-emerald-300 font-medium min-w-0">
                      <Moon className="w-3.5 h-3.5 flex-shrink-0 text-emerald-400" />
                      <span className="truncate">{t.valleyRowTitle}</span>
                    </div>
                    <div className="font-mono font-bold text-emerald-300 text-right text-[11px] sm:text-xs">
                      <span className="text-emerald-200">{currencySymbol}{formatPrice(pricing.gu.inputMiss)}</span>
                      <span className="text-slate-600 mx-1">/</span>
                      <span className="text-emerald-400">{currencySymbol}{formatPrice(pricing.gu.inputHit)}</span>
                      <span className="text-slate-600 mx-1">/</span>
                      <span className="text-emerald-200">{currencySymbol}{formatPrice(pricing.gu.output)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Bottom Specs Footer */}
              <div className="mt-4 pt-3 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-slate-400 truncate">
                  <Database className="w-3 h-3 text-blue-400 flex-shrink-0" />
                  <span className="truncate">{t.cacheNotice}</span>
                </span>
                <span className="font-mono text-slate-300 whitespace-nowrap pl-2">
                  {t.maxOutput}: {model.maxOutput}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive API Call Cost Calculator (Accordion Drawer) */}
      {showCalculator && (
        <div className="mt-8 rounded-3xl p-6 sm:p-8 bg-slate-900/95 shadow-2xl backdrop-blur-xl animate-in fade-in duration-300">
          <div className="flex items-center justify-between mb-6 pb-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 shadow-sm">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg sm:text-xl font-black text-white">
                  {t.calcTitle}
                </h4>
                <p className="text-xs text-slate-400">
                  {t.calcDesc}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Calculator Controls (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              {/* Target Model Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  {t.calcModelSelect}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {DEEPSEEK_MODELS.map((m) => (
                    <button
                      key={m.modelId}
                      onClick={() => setCalcModel(m.modelId)}
                      className={`p-2.5 rounded-2xl text-left text-xs transition-all cursor-pointer ${
                        calcModel === m.modelId
                          ? 'bg-indigo-600/30 text-indigo-200 shadow-md font-bold'
                          : 'bg-slate-950/60 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="text-white font-bold truncate">{m.modelName}</div>
                      <div className="text-[10px] text-slate-500 font-mono truncate">{m.modelId}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Tokens Slider & Input */}
              <div className="p-4 rounded-2xl bg-slate-950/60 shadow-inner">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-slate-300 font-bold">{t.calcInputLabel}</span>
                  <span className="font-mono text-indigo-400 font-extrabold text-sm px-2.5 py-0.5 rounded-lg bg-indigo-950/80 shadow-sm">
                    {(calcInputTokens / 1000).toLocaleString()}K Tokens
                  </span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="5000000"
                  step="10000"
                  value={calcInputTokens}
                  onChange={(e) => setCalcInputTokens(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1.5">
                  <span>10K</span>
                  <span>1M</span>
                  <span>3M</span>
                  <span>5M Tokens</span>
                </div>
              </div>

              {/* Output Tokens Slider */}
              <div className="p-4 rounded-2xl bg-slate-950/60 shadow-inner">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-slate-300 font-bold">{t.calcOutputLabel}</span>
                  <span className="font-mono text-indigo-400 font-extrabold text-sm px-2.5 py-0.5 rounded-lg bg-indigo-950/80 shadow-sm">
                    {(calcOutputTokens / 1000).toLocaleString()}K Tokens
                  </span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="1000000"
                  step="5000"
                  value={calcOutputTokens}
                  onChange={(e) => setCalcOutputTokens(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1.5">
                  <span>1K</span>
                  <span>200K</span>
                  <span>500K</span>
                  <span>1M Tokens</span>
                </div>
              </div>

              {/* KV Cache Hit Rate Slider */}
              <div className="p-4 rounded-2xl bg-slate-950/60 shadow-inner">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-slate-300 font-bold">{t.calcCacheLabel}</span>
                  <span className="font-mono text-emerald-400 font-extrabold text-sm px-2.5 py-0.5 rounded-lg bg-emerald-950/80 shadow-sm">
                    {calcCacheHitRate}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={calcCacheHitRate}
                  onChange={(e) => setCalcCacheHitRate(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1.5">
                  <span>0% ({t.noCache})</span>
                  <span>50%</span>
                  <span>100% ({t.fullHit})</span>
                </div>
              </div>
            </div>

            {/* Calculation Output Results (5 Cols) */}
            <div className="lg:col-span-5 rounded-2xl bg-slate-950/90 shadow-xl p-5 space-y-4">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {t.calcResultSummary}
              </div>

              {/* Peak Period Estimation */}
              <div className="p-4 rounded-2xl bg-slate-900/90 shadow-md">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Sun className="w-4 h-4 text-amber-400" />
                    {t.peakTotalCost}
                  </span>
                  <span className="text-xs font-mono text-slate-400">100% {t.standardRate}</span>
                </div>
                <div className="font-mono text-2xl sm:text-3xl font-black text-white mt-1">
                  {currencySymbol}{totalFengCost.toFixed(3)}
                </div>
              </div>

              {/* Valley Period Estimation */}
              <div className="p-4 rounded-2xl bg-emerald-950/30 shadow-[0_10px_30px_-8px_rgba(16,185,129,0.3)]">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <Moon className="w-4 h-4 text-emerald-400" />
                    {t.valleyTotalCost}
                  </span>
                  <span className="text-xs font-mono text-emerald-300 font-bold px-2.5 py-0.5 rounded-lg bg-emerald-900/60 shadow-sm">
                    50% {t.discountRate}
                  </span>
                </div>
                <div className="font-mono text-2xl sm:text-3xl font-black text-emerald-400 mt-1">
                  {currencySymbol}{totalGuCost.toFixed(3)}
                </div>
              </div>

              {/* Savings Highlight */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-purple-950/60 shadow-md flex items-center justify-between">
                <div>
                  <div className="text-xs text-indigo-300 font-black">{t.directSavings}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{t.batchTip}</div>
                </div>
                <div className="font-mono text-xl sm:text-2xl font-black text-indigo-300">
                  {currencySymbol}{moneySaved.toFixed(3)}
                  <span className="text-xs text-emerald-400 ml-1 font-sans font-bold">(-50%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
