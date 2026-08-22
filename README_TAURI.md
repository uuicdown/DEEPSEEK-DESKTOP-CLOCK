# 🚀 DeepSeek 桌面时钟 · Tauri 打包 Windows .exe 全流程指南 (Zero to One)

本项目采用 **Vite + React 18 + TypeScript** 作为现代化前端，并基于 **Rust + Tauri v2** 进行原生级极小体积封装。
打包产出的 Windows `.exe` 安装包仅约 **3~5 MB**，日常运行内存仅 **20~40 MB**，且具备**沉浸式全屏、独立置顶悬浮小时钟、全局多主题联动与系统托盘驻留**四大桌面级特性！

---

## 🛠️ 第一步：准备 Windows 本地开发环境（仅首次需要）

在 Windows 电脑上编译 Tauri 应用，需要准备以下 3 项基础环境：

### 1. 安装 Node.js (推荐 LTS 18 或 20+)
* 官方下载地址：[https://nodejs.org/](https://nodejs.org/)
* 安装后打开终端（PowerShell 或 CMD）验证：
  ```powershell
  node -v
  npm -v
  ```

### 2. 安装 Rust 编译环境
* 访问 Rust 官网下载安装器：[https://www.rust-lang.org/tools/install](https://www.rust-lang.org/tools/install)
* 双击运行 `rustup-init.exe`，出现选择项时直接按 **回车 (默认选择 1. Proceed with installation (default))** 即可。
* 安装完成后关闭并重新打开终端，验证安装成功：
  ```powershell
  rustc --version
  cargo --version
  ```

### 3. 安装 C++ 构建工具 (MSVC)
* 下载 **Visual Studio 生成工具 (Build Tools for Visual Studio)**：[https://visualstudio.microsoft.com/visual-cpp-build-tools/](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
* 运行安装器，在工作负荷中勾选 **“使用 C++ 的桌面开发” (Desktop development with C++)**，点击右下角“安装”。

---

## 🎨 第二步：准备项目依赖与图标文件

在解压后的项目根目录下打开终端，执行以下步骤：

### 1. 安装前端项目依赖
```powershell
npm install
```

### 2. 生成专属 Windows 桌面与托盘图标 (Icon)
项目中已内置生成的 DeepSeek 风格高清图标（位于 `src/assets/images/`），运行 Tauri 官方图标命令行工具：
```powershell
npx @tauri-apps/cli icon src/assets/images/deepseek_clock_icon_1787300567789.jpg
```
> 💡 **提示**：该命令会自动在 `src-tauri/icons/` 目录下生成 `icon.ico`、`32x32.png`、`128x128.png` 等全套 Windows 桌面与托盘图标文件。

---

## ⚙️ 第三步：确认 Tauri 核心配置文件 (Tauri v2 规范)

项目中已为您配置好符合最新 **Tauri v2** 规范的 `src-tauri/` 目录结构与标识符（`com.Soren.deepseekclock`）：

### 1. `src-tauri/tauri.conf.json`（无边框沉浸式窗口与全局 API 配置）
```json
{
  "$schema": "https://raw.githubusercontent.com/tauri-apps/tauri/dev/crates/tauri-cli/schema.json",
  "productName": "DeepSeekClock",
  "version": "0.1.0",
  "identifier": "com.Soren.deepseekclock",
  "build": {
    "beforeDevCommand": "npm run dev",
    "beforeBuildCommand": "npm run build",
    "devUrl": "http://localhost:3000",
    "frontendDist": "../dist"
  },
  "app": {
    "withGlobalTauri": true,
    "windows": [
      {
        "label": "main",
        "title": "DeepSeek 桌面时钟 · 梁文峰/梁文谷时钟看板",
        "width": 1000,
        "height": 760,
        "minWidth": 280,
        "minHeight": 120,
        "resizable": true,
        "fullscreen": false,
        "decorations": false,
        "center": true,
        "alwaysOnTop": false,
        "transparent": true,
        "shadow": true
      }
    ],
    "security": {
      "csp": null
    }
  },
  "bundle": {
    "active": true,
    "targets": "all",
    "icon": [
      "icons/32x32.png",
      "icons/128x128.png",
      "icons/128x128@2x.png",
      "icons/icon.icns",
      "icons/icon.ico"
    ],
    "copyright": "Copyright © 2026 Soren. All rights reserved.",
    "shortDescription": "DeepSeek 桌面时钟",
    "longDescription": "DeepSeek 桌面时钟 · 梁文峰/梁文谷峰谷时段追踪与 Token 计费看板",
    "windows": {
      "certificateThumbprint": null,
      "digestAlgorithm": "sha256",
      "timestampUrl": ""
    }
  }
}
```

### 2. `src-tauri/capabilities/default.json`（Tauri v2 窗口拖拽、尺寸变更与事件权限配置）
```json
{
  "$schema": "../gen/schemas/desktop-schema.json",
  "identifier": "default",
  "description": "Capability for the main window",
  "windows": ["main"],
  "permissions": [
    "core:default",
    "core:window:default",
    "core:window:allow-start-dragging",
    "core:window:allow-set-size",
    "core:window:allow-set-resizable",
    "core:window:allow-set-always-on-top",
    "core:window:allow-set-fullscreen",
    "core:window:allow-show",
    "core:window:allow-hide",
    "core:window:allow-close",
    "core:window:allow-center",
    "core:window:allow-minimize",
    "core:window:allow-maximize",
    "core:window:allow-unmaximize",
    "core:window:allow-toggle-maximize",
    "core:window:allow-is-maximized",
    "core:window:allow-set-decorations",
    "core:window:allow-set-shadow",
    "core:event:default",
    "core:event:allow-listen",
    "core:event:allow-emit"
  ]
}
```

### 3. `src-tauri/Cargo.toml`
```toml
[package]
name = "deepseek-clock"
version = "0.1.0"
description = "DeepSeek Clock Desktop Application by Soren"
edition = "2021"

[build-dependencies]
tauri-build = { version = "2", features = [] }

[dependencies]
tauri = { version = "2", features = [ "tray-icon" ] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
```

### 4. `src-tauri/src/main.rs`（系统托盘与三项菜单）
```rust
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    Emitter, Manager,
};

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            // 1. 构建系统托盘右键菜单
            let show_main = MenuItem::with_id(app, "show_main", "📌 打开主界面 / 大屏", true, None::<&str>)?;
            let show_mini = MenuItem::with_id(app, "show_mini", "⏱️ 切换桌面悬浮时钟 / 小屏", true, None::<&str>)?;
            let quit = MenuItem::with_id(app, "quit", "❌ 退出程序", true, None::<&str>)?;

            let menu = Menu::with_items(app, &[&show_main, &show_mini, &quit])?;

            // 2. 初始化托盘图标
            let _tray = TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&menu)
                .show_menu_on_left_click(false)
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "show_main" => {
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                            let _ = window.emit("tray-show-main", ());
                        }
                    }
                    "show_mini" => {
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                            let _ = window.emit("tray-show-mini", ());
                        }
                    }
                    "quit" => {
                        std::process::exit(0);
                    }
                    _ => {}
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        let app = tray.app_handle();
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                })
                .build(app)?;

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

---

## 📦 第四步：一键执行编译打包

在项目根目录下，依次执行两条命令：

```powershell
# 1. 编译前端生产静态文件
npm run build

# 2. 调用 Tauri 构建 Windows 安装包与可执行文件
npx @tauri-apps/cli build
```

---

## 🎉 第五步：获取生成的 `.exe` 文件

编译成功后，在项目目录下的：
```
src-tauri/target/release/bundle/nsis/
```
即可找到生成的安装包文件：
* **`DeepSeekClock_0.1.0_x64-setup.exe`** —— Windows 安装引导程序。

另外在 `src-tauri/target/release/` 下可直接找到 **`DeepSeekClock.exe`**（即点即用的免安装绿色版）。

---

## ✨ 桌面端功能与体验亮点

1. **沉浸式真全屏（大屏模式）**：
   * 点击右上角「大屏 / 全屏时钟」，自动隐藏窗口边框、滚动条并占满整屏，按 `Esc` 或右上角即可退出。
2. **独立桌面悬浮时钟（小屏模式）**：
   * 点击「小时钟」，窗口自动收缩为 **340×180** 卡片，并自动开启 **桌面置顶（Always on Top）**，支持鼠标按住标题栏在桌面上自由拖动摆放。
3. **全局色彩主题全要素联动**：
   * 切换 DeepSeek 深海夜空、OLED 极黑、赛博霓虹、复古琥珀或极简白，大屏与小时钟全要素同步换肤。
4. **系统托盘常驻**：
   * 任务栏右下角托盘图标支持右键菜单「打开主界面 / 大屏」、「切换桌面悬浮时钟 / 小屏」、「退出程序」快速调度。
