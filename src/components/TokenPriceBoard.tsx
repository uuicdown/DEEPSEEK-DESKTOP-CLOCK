import React, { useState } from 'react';
import { 
  Coins, 
  Sparkles, 
  Calculator, 
  TrendingDown, 
  CheckCircle2, 
  HelpCircle, 
  Zap, 
  Layers,
  ArrowRight,
  Database,
  Sliders,
  DollarSign,
  Sun,
  Moon
} from 'lucide-react';
import { DEEPSEEK_MODELS } from '../data/deepseekPrices';
import { ClockTheme, ModelPricing, PhaseInfo } from '../types';

interface TokenPriceBoardProps {
  phaseInfo: PhaseInfo;
  currentTheme: ClockTheme;
}

export const TokenPriceBoard: React.FC<TokenPriceBoardProps> = ({
  phaseInfo,
  currentTheme,
}) => {
  const [currency, setCurrency] = useState<'cny' | 'usd'>('cny');
  const [unit, setUnit] = useState<'1M' | '1K'>('1M');
  const [showCalculator, setShowCalculator] = useState(false);
  const [modelFilter, setModelFilter] = useState<'all' | 'flash' | 'pro'>('all');

  // Calculator states - default to V4 Flash
  const [calcModel, setCalcModel] = useState<string>('deepseek-v4-flash');
  const [calcInputTokens, setCalcInputTokens] = useState<number>(500000); // 500k default
  const [calcOutputTokens, setCalcOutputTokens] = useState<number>(200000); // 200k default
  const [calcCacheHitRate, setCalcCacheHitRate] = useState<number>(60); // 60% hit rate

  const isGu = phaseInfo.currentPhase === 'gu';
  const currencySymbol = currency === 'cny' ? '¥' : '$';
  const unitDivider = unit === '1M' ? 1 : 1000;
  const unitLabel = unit === '1M' ? '/ 1M Tokens' : '/ 1K Tokens';

  const formatPrice = (val: number) => {
    const adjusted = val / unitDivider;
    if (adjusted < 0.001) return adjusted.toFixed(5);
    if (adjusted < 0.01) return adjusted.toFixed(4);
    if (adjusted < 1) return adjusted.toFixed(3);
    return adjusted.toFixed(2);
  };

  const filteredModels = DEEPSEEK_MODELS.filter((m) => {
    if (modelFilter === 'flash') return m.modelId.includes('flash');
    if (modelFilter === 'pro') return m.modelId.includes('pro');
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
      {/* Header bar of Price Section */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white flex flex-wrap items-center gap-2">
              <span>DeepSeek-V4 Flash / Pro 实时价格看板</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${
                isGu
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}>
                {isGu ? '⚡ 正在享受「梁文谷」5折特惠' : '☀️ 当前为「梁文峰」原价'}
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              动态依据北京时间判定：工作日高峰 (09:00-12:00, 14:00-18:00 梁文峰) 原价，其余/午间/夜间/周末 (梁文谷) 享 50% 半价
            </p>
          </div>
        </div>

        {/* Action Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Model Filter Tabs */}
          <div className="flex rounded-xl bg-slate-900 border border-slate-800 p-0.5 text-xs">
            <button
              onClick={() => setModelFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                modelFilter === 'all' ? 'bg-slate-700 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              全部模型 (2)
            </button>
            <button
              onClick={() => setModelFilter('flash')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                modelFilter === 'flash' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              V4 Flash (轻量极速)
            </button>
            <button
              onClick={() => setModelFilter('pro')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                modelFilter === 'pro' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              V4 Pro (高智全能)
            </button>
          </div>

          {/* Currency Switcher */}
          <div className="flex rounded-xl bg-slate-900 border border-slate-800 p-0.5 text-xs">
            <button
              id="currency-cny-button"
              onClick={() => setCurrency('cny')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                currency === 'cny'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ¥ 人民币
            </button>
            <button
              id="currency-usd-button"
              onClick={() => setCurrency('usd')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                currency === 'usd'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              $ 美元
            </button>
          </div>

          {/* Unit Switcher */}
          <div className="flex rounded-xl bg-slate-900 border border-slate-800 p-0.5 text-xs">
            <button
              id="unit-1m-button"
              onClick={() => setUnit('1M')}
              className={`px-2.5 py-1 rounded-lg font-mono font-medium transition-all cursor-pointer ${
                unit === '1M'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              /1M
            </button>
            <button
              id="unit-1k-button"
              onClick={() => setUnit('1K')}
              className={`px-2.5 py-1 rounded-lg font-mono font-medium transition-all cursor-pointer ${
                unit === '1K'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              /1K
            </button>
          </div>

          {/* Calculator Toggle */}
          <button
            id="toggle-calculator-button"
            onClick={() => setShowCalculator(!showCalculator)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
              showCalculator
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>{showCalculator ? '收起计算器' : 'Token 计算器'}</span>
          </button>
        </div>
      </div>

      {/* Model Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {filteredModels.map((model) => {
          const pricing = currency === 'cny' ? model.cny : model.usd;
          const currentModelPricing = isGu ? pricing.gu : pricing.feng;
          const isV4 = model.modelId.startsWith('deepseek-v4');

          return (
            <div
              key={model.modelId}
              className={`relative rounded-3xl p-5 sm:p-6 border transition-all duration-300 ${
                currentTheme.cardBgClass
              } ${currentTheme.borderClass} ${isV4 ? 'ring-1 ring-blue-500/30' : ''} flex flex-col justify-between`}
            >
              <div>
                {/* Model Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xl font-black text-white tracking-tight">
                        {model.modelName}
                      </span>
                      {isV4 && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm">
                          V4 旗舰
                        </span>
                      )}
                      <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-400">
                        {model.modelId}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {model.description}
                    </p>
                  </div>

                  {/* Context Badge */}
                  <div className="text-right flex-shrink-0">
                    <span className="text-[11px] font-mono px-2 py-1 rounded-lg bg-blue-950/60 border border-blue-800/50 text-blue-300 font-semibold">
                      上下文 {model.contextWindow}
                    </span>
                  </div>
                </div>

                {/* Pricing Comparison Container */}
                <div className="space-y-2.5 mt-4">
                  {/* Current Active Price Highlight Card */}
                  <div className={`p-3.5 rounded-2xl border transition-all ${
                    isGu
                      ? 'bg-emerald-950/40 border-emerald-500/50 shadow-[0_0_20px_-8px_rgba(16,185,129,0.3)]'
                      : 'bg-amber-950/30 border-amber-500/50 shadow-[0_0_20px_-8px_rgba(245,158,11,0.3)]'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold flex items-center gap-1.5 text-white">
                        <Zap className={`w-3.5 h-3.5 ${isGu ? 'text-emerald-400' : 'text-amber-400'}`} />
                        当前实时生效价格 ({isGu ? '🌙 梁文谷 · 5折特惠' : '☀️ 梁文峰 · 峰时原价'})
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isGu 
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}>
                        实时生效中
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
                        <div className="text-[10px] text-slate-400 mb-0.5">输入 (未命中)</div>
                        <div className="font-mono text-sm sm:text-base font-extrabold text-white">
                          {currencySymbol}{formatPrice(currentModelPricing.inputMiss)}
                        </div>
                        <div className="text-[9px] text-slate-500 font-mono">{unitLabel}</div>
                      </div>

                      <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
                        <div className="text-[10px] text-emerald-400 font-semibold mb-0.5 flex items-center justify-center gap-0.5">
                          <Database className="w-2.5 h-2.5" />
                          输入 (缓存命中)
                        </div>
                        <div className="font-mono text-sm sm:text-base font-extrabold text-emerald-300">
                          {currencySymbol}{formatPrice(currentModelPricing.inputHit)}
                        </div>
                        <div className="text-[9px] text-emerald-500 font-mono">{unitLabel}</div>
                      </div>

                      <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
                        <div className="text-[10px] text-slate-400 mb-0.5">输出 (Output)</div>
                        <div className="font-mono text-sm sm:text-base font-extrabold text-white">
                          {currencySymbol}{formatPrice(currentModelPricing.output)}
                        </div>
                        <div className="text-[9px] text-slate-500 font-mono">{unitLabel}</div>
                      </div>
                    </div>
                  </div>

                  {/* Contrast Table (Peak vs Valley Details) */}
                  <div className="p-3 rounded-2xl bg-slate-950/50 border border-slate-800/70 text-xs">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 pb-1.5 border-b border-slate-800">
                      <span>费率对照表</span>
                      <span>输入 (未命中 / 命中) | 输出</span>
                    </div>

                    {/* Feng Row */}
                    <div className={`flex items-center justify-between py-2 border-b border-slate-800/50 ${
                      !isGu ? 'text-amber-300 font-semibold' : 'text-slate-400'
                    }`}>
                      <span className="flex items-center gap-1">
                        <Sun className="w-3 h-3 text-amber-400" />
                        <span>梁文峰 (高峰 09-12h, 14-18h)</span>
                      </span>
                      <span className="font-mono text-[11px]">
                        {currencySymbol}{formatPrice(pricing.feng.inputMiss)} / {currencySymbol}{formatPrice(pricing.feng.inputHit)} | {currencySymbol}{formatPrice(pricing.feng.output)}
                      </span>
                    </div>

                    {/* Gu Row */}
                    <div className={`flex items-center justify-between pt-2 ${
                      isGu ? 'text-emerald-300 font-semibold' : 'text-slate-400'
                    }`}>
                      <span className="flex items-center gap-1">
                        <Moon className="w-3 h-3 text-emerald-400" />
                        <span>梁文谷 (谷时/午间/夜间/周末)</span>
                        <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">5折</span>
                      </span>
                      <span className="font-mono text-[11px]">
                        {currencySymbol}{formatPrice(pricing.gu.inputMiss)} / {currencySymbol}{formatPrice(pricing.gu.inputHit)} | {currencySymbol}{formatPrice(pricing.gu.output)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Note */}
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                <span>上下文缓存 (KV Cache) 命中直降 90%</span>
                <span className="font-mono text-slate-400">最大输出：{model.maxOutput}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Token Cost & Savings Calculator */}
      {showCalculator && (
        <div className="mt-6 p-6 rounded-3xl bg-slate-900/90 backdrop-blur-xl border border-indigo-500/30 shadow-2xl animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-indigo-400" />
              <h4 className="text-base font-bold text-white">
                DeepSeek Token 峰谷费用测算与省钱计算器
              </h4>
            </div>
            <span className="text-xs text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
              动态模拟「梁文峰」vs「梁文谷」调用成本
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 cols: Controls */}
            <div className="lg:col-span-7 space-y-4">
              {/* Select Model */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  选择测试模型
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {DEEPSEEK_MODELS.map((m) => (
                    <button
                      key={m.modelId}
                      onClick={() => setCalcModel(m.modelId)}
                      className={`p-2.5 rounded-xl text-left border text-xs font-semibold transition-all cursor-pointer ${
                        calcModel === m.modelId
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="text-white font-bold">{m.modelName}</div>
                      <div className="text-[10px] text-slate-400">{m.modelId}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Tokens Slider & Input */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">输入 Token 量 (Prompt)</span>
                  <span className="font-mono text-indigo-400 font-bold">
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
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                  <span>10K</span>
                  <span>1M</span>
                  <span>3M</span>
                  <span>5M Tokens</span>
                </div>
              </div>

              {/* Output Tokens Slider */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">输出 Token 量 (Completion)</span>
                  <span className="font-mono text-indigo-400 font-bold">
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
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                  <span>1K</span>
                  <span>200K</span>
                  <span>500K</span>
                  <span>1M Tokens</span>
                </div>
              </div>

              {/* KV Cache Hit Rate Slider */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">上下文缓存命中率 (Cache Hit %)</span>
                  <span className="font-mono text-emerald-400 font-bold">{calcCacheHitRate}%</span>
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
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                  <span>0% (全未命中)</span>
                  <span>50% (典型会话)</span>
                  <span>100% (深度多轮)</span>
                </div>
              </div>
            </div>

            {/* Right 5 cols: Comparison Result */}
            <div className="lg:col-span-5 flex flex-col justify-between p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div>
                <div className="text-xs font-semibold text-slate-400 mb-3">测算结果对比 ({currencySymbol} {currency.toUpperCase()})</div>
                
                {/* Feng cost box */}
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 mb-2.5 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-amber-400 font-semibold flex items-center gap-1">
                      <Sun className="w-3 h-3" />
                      梁文峰 (高峰原价)
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">工作日 09-12h / 14-18h</div>
                  </div>
                  <div className="font-mono text-lg font-bold text-slate-200">
                    {currencySymbol}{totalFengCost.toFixed(4)}
                  </div>
                </div>

                {/* Gu cost box */}
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 mb-3 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-emerald-300 font-bold flex items-center gap-1">
                      <Moon className="w-3 h-3 text-emerald-400" />
                      梁文谷 (谷时 5折)
                    </div>
                    <div className="text-[10px] text-emerald-400/80 mt-0.5">午间/夜间/周末全天</div>
                  </div>
                  <div className="font-mono text-lg font-black text-emerald-300">
                    {currencySymbol}{totalGuCost.toFixed(4)}
                  </div>
                </div>
              </div>

              {/* Savings Highlight */}
              <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/40 text-center">
                <div className="text-[11px] text-indigo-300 font-medium">使用「梁文谷」时段立省</div>
                <div className="font-mono text-xl sm:text-2xl font-black text-emerald-400 my-1">
                  {currencySymbol}{moneySaved.toFixed(4)} (节省 50.0%)
                </div>
                <div className="text-[10px] text-slate-400">
                  {isGu ? '🎉 当前正是「梁文谷」时段，立即发起请求立减一半！' : '💡 建议将离线批量大任务调度在梁文谷时段执行'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
