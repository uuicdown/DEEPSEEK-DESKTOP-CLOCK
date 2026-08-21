import React, { useState } from 'react';
import { 
  X, 
  Terminal, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  Monitor, 
  Cpu, 
  Layers, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface ExePackagingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExePackagingModal: React.FC<ExePackagingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'pwa' | 'tauri' | 'electron'>('pwa');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 text-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>生成 Windows .exe 桌面独立程序指南</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  支持最小化悬浮小时钟
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                本程序基于网页前端开发，可通过以下 3 种方式秒变为桌面独立软件
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex rounded-xl bg-slate-950 p-1 my-4 border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('pwa')}
            className={`flex-1 py-2 rounded-lg font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'pwa'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>方法 1：免安装一键桌面化 (PWA 最推荐)</span>
          </button>
          <button
            onClick={() => setActiveTab('tauri')}
            className={`flex-1 py-2 rounded-lg font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'tauri'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>方法 2：Tauri 打包 (.exe 极小轻量)</span>
          </button>
          <button
            onClick={() => setActiveTab('electron')}
            className={`flex-1 py-2 rounded-lg font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'electron'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>方法 3：Electron 打包 (.exe 经典)</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
          {activeTab === 'pwa' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-800/40 text-blue-200 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-blue-300">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>无需编译，0 秒生成桌面独立窗口应用：</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  在 Edge 或 Chrome 浏览器中，点击地址栏右侧的 <strong>「安装应用」</strong> 图标，或在浏览器菜单选择 <strong>「应用」→「将此站点作为应用安装」</strong>。
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-semibold text-white">✨ 独立窗口特性：</div>
                <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1">
                  <li>拥有独立的 Windows 任务栏图标与桌面图标。</li>
                  <li>支持点击右上方 <strong>「最小化为小时钟」</strong>，立即变为桌面右下角极简可拖拽的【时间 + 梁文峰/谷】小挂件。</li>
                  <li>无需安装庞大的运行库，随开随用，极致省电省内存。</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'tauri' && (
            <div className="space-y-3">
              <p className="text-slate-300">
                Tauri 是目前最先进的轻量级桌面打包方案，编译出的 Windows <code>.exe</code> 安装包仅约 <strong>3~5 MB</strong>，且内存占用极低。
              </p>

              <div className="space-y-2">
                <div className="font-semibold text-slate-200">打包步骤命令：</div>
                
                <div className="relative p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 flex items-center justify-between">
                  <code>npm install -D @tauri-apps/cli</code>
                  <button
                    onClick={() => handleCopy('npm install -D @tauri-apps/cli', 1)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                  >
                    {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="relative p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 flex items-center justify-between">
                  <code>npx tauri init && npx tauri build</code>
                  <button
                    onClick={() => handleCopy('npx tauri init && npx tauri build', 2)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                  >
                    {copiedIndex === 2 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-200">
                运行完成后即可在 <code>src-tauri/target/release/</code> 目录下生成 <strong>DeepSeekClock.exe</strong> 安装包。
              </div>
            </div>
          )}

          {activeTab === 'electron' && (
            <div className="space-y-3">
              <p className="text-slate-300">
                使用业界最经典的 Electron + Electron Builder 框架一键封装为 Windows 可执行程序。
              </p>

              <div className="space-y-2">
                <div className="font-semibold text-slate-200">打包步骤命令：</div>

                <div className="relative p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 flex items-center justify-between">
                  <code>npm install -D electron electron-builder</code>
                  <button
                    onClick={() => handleCopy('npm install -D electron electron-builder', 3)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                  >
                    {copiedIndex === 3 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="relative p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 flex items-center justify-between">
                  <code>npm run build && electron-builder --win</code>
                  <button
                    onClick={() => handleCopy('npm run build && electron-builder --win', 4)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                  >
                    {copiedIndex === 4 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-300">
                输出文件位于 <code>dist/DeepSeek Clock Setup.exe</code>。
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            💡 当前页面已内置【小时钟模式】，点击主界面右上角「最小化为小时钟」即可直接体验！
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors cursor-pointer"
          >
            知道了，立即体验
          </button>
        </div>
      </div>
    </div>
  );
};
