# DeepSeek 桌面时钟 · Tauri 打包 Windows .exe 指南

本项目基于 Vite + React + TypeScript 构建，通过 Tauri 打包后生成的 Windows `.exe` 体积仅约 **3~5 MB**，内存占用仅 **20~40 MB**。

---

## 🛠️ 第一步：前置环境准备（只需配置一次）

在 Windows 电脑上运行 Tauri 打包，需要以下环境：

1. **Node.js**：[https://nodejs.org/](https://nodejs.org/)（推荐 LTS 版本）。
2. **Rust 环境**：
   - 访问 [https://www.rust-lang.org/tools/install](https://www.rust-lang.org/tools/install) 下载并运行 `rustup-init.exe`。
   - 运行后按默认提示输入 `1` 并回车完成安装。
3. **C++ 编译环境 (MSVC)**：
   - 如果系统未安装 Visual Studio，请安装 **Microsoft C++ 生成工具 (Build Tools for Visual Studio)**（勾选“使用 C++ 的桌面开发”）。

---

## 🚀 第二步：在项目目录执行打包

在解压后的项目根目录下打开终端（PowerShell 或 CMD），按顺序执行以下命令：

### 1. 安装项目依赖
```bash
npm install
```

### 2. 编译前端生产代码
```bash
npm run build
```

### 3. 初始化 Tauri（首次打包运行）
```bash
npx @tauri-apps/cli init
```
> **初始化提示填写建议**：
> - `What is your app name?` 👉 直接回车或输入 `DeepSeekClock`
> - `What should the window title be?` 👉 输入 `DeepSeek 桌面时钟`
> - `Where are your web assets located?` 👉 输入 `../dist`（关键：指定为 dist 目录）
> - `What is the url of your dev server?` 👉 输入 `http://localhost:3000`
> - `What is your frontend dev command?` 👉 输入 `npm run dev`
> - `What is your frontend build command?` 👉 输入 `npm run build`

### 4. 一键编译生成 .exe
```bash
npx @tauri-apps/cli build
```

---

## 🎉 第三步：获取你的专属 .exe

编译成功后，在项目目录下的：
```
src-tauri/target/release/
```
即可看到生成的：
- **`DeepSeekClock.exe`**（绿色独立运行版）
- 或在 `src-tauri/target/release/bundle/msi/` / `bundle/nsis/` 中获取标准安装包！

---

## 💡 特性支持
- 支持主看板全功能（北京时间、毫秒、全屏、峰谷倒计时、V4 Flash / Pro 价格计算器）。
- 支持一键 **「最小化为小时钟」**，变为桌面右下角极简可拖拽的悬浮时间挂件！
