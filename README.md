# ⏰ DeepSeek 桌面时钟 (DeepSeek Clock)

> 一款专为 DeepSeek 开发者与 AI 用户量身打造的现代化峰谷时段追踪看板与轻量级桌面时钟挂件。
> 实时精准追踪「梁文锋（高峰原价时段）」与「梁文谷（夜间、午间错峰及周末 5 折特惠时段）」，助力 API 调用成本直降 50%。

---

## 📊 官方最新峰谷分时计价标准（2026年8月17日起生效）

单位：**元 / 百万 Tokens (¥ / 1M Tokens)**

| 模型 | 计费项 | 空闲谷时价格 (梁文谷 · 5折) | 高峰时段价格 (梁文峰 · 原价) |
| :--- | :--- | :---: | :---: |
| **DeepSeek-V4-Flash** | 输入（缓存命中） | **0.05 元** | **0.10 元** |
| | 输入（缓存未命中） | **1.50 元** | **3.00 元** |
| | 输出 | **4.50 元** | **9.00 元** |
| **DeepSeek-V4-Pro** | 输入（缓存命中） | **0.15 元** | **0.30 元** |
| | 输入（缓存未命中） | **4.50 元** | **9.00 元** |
| | 输出 | **13.50 元** | **27.00 元** |

---

## ✨ 核心特性

- **⏱️ 毫秒级精准时钟**：支持 12/24 小时制、毫秒动态显示、全球主要时区（北京时间、UTC、纽约、伦敦、东京等）一键切换。
- **🎯 峰谷状态实时感知（梁文锋 vs 梁文谷）**：
  - **高峰原价时段 (梁文锋 · 100%)**：工作日 09:00 - 12:00 以及 14:00 - 18:00 (UTC+8)。
  - **空闲特惠时段 (梁文谷 · 50%)**：工作日午间错峰 (12:00 - 14:00)、晚间夜间 (18:00 - 次日 09:00)、周末全天 (周六日全天)。
- **⏳ 状态切换倒计时**：精准呈现距离下一次峰谷切换的倒计时与目标状态，不错过最佳跑批省钱时机。
- **🪟 极简悬浮小时钟（最小化模式）**：
  - 点击「最小化为小时钟」，看板即刻收缩为桌面右下角的极简悬浮小挂件。
  - 纯净呈现「数字时间 + 梁文峰/谷状态」，支持自由拖拽、停靠复位与一键还原。
- **💰 实时 Token 价格与省钱计算器**：
  - 深度支持 Flash 与 Pro 模型、KV Cache 缓存命中率与多轮 Token 测算。
- **🔔 音效与全屏沉浸模式**：支持整点/切换阶段轻音效提示与禅意大屏全屏模式。

---

## 🛠️ 技术栈

- **前端框架**：React 18 + TypeScript + Vite
- **样式方案**：Tailwind CSS + Lucide Icons
- **桌面端封装**：Tauri (Rust / WebView2) / Electron / PWA

---

## 📦 本地运行与开发

### 1. 克隆或下载代码
```bash
git clone https://github.com/your-username/deepseek-clock.git
cd deepseek-clock
```

### 2. 安装依赖
```bash
npm install
```

### 3. 启动本地开发服务
```bash
npm run dev
```
打开浏览器访问 `http://localhost:3000` 即可预览应用。

### 4. 编译生产前端资源
```bash
npm run build
```

---

## 🖥️ 打包为 Windows 独立桌面程序 (.exe)

本项目推荐使用 **Tauri** 进行桌面端打包，生成的 `.exe` 仅约 **3~5 MB**，运行时内存仅占用 **20~40 MB**。

### 方式 1：使用 Tauri 打包（推荐 · 超轻量）

#### 前置要求：
1. 安装 [Node.js](https://nodejs.org/) (LTS 稳定版)。
2. 安装 [Rust 环境](https://www.rust-lang.org/tools/install)（运行 `rustup-init.exe`）。
3. 安装 Visual Studio C++ 生成工具 (MSVC)。

#### 打包命令：
```bash
# 1. 编译前端资源
npm run build

# 2. 首次打包初始化 Tauri（Web assets 目录填写 ../dist）
npx @tauri-apps/cli init

# 3. 开始打包 .exe
npx @tauri-apps/cli build
```
编译成功后，在 `src-tauri/target/release/` 目录下即可获取 `DeepSeekClock.exe`。

---

### 方式 2：使用 Electron 打包（零编译环境门槛）

如果您的电脑未配置 Rust 环境，可使用经典的 Electron 方案：

```bash
# 1. 编译前端
npm run build

# 2. 安装打包依赖
npm install -D electron electron-builder

# 3. 打包生成 Windows 安装包
npx electron-builder --win
```
输出文件位于 `dist/` 文件夹下。

---

### 方式 3：免安装 PWA 桌面化（0 编译）
1. 使用 Chrome / Edge 浏览器打开本程序网页。
2. 点击地址栏右侧的 **「安装应用」** 图标。
3. 即可在电脑桌面生成独立的无边框桌面窗口应用。

---

## 📜 开源协议

本项目采用 [MIT License](LICENSE) 许可协议。
