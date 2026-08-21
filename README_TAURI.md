# DeepSeek 桌面时钟 · Tauri 打包 Windows .exe 终极指南

本项目基于 **Vite + React + TypeScript** 构建，通过 Tauri 打包后生成的 Windows `.exe` 安装包仅约 **3~5 MB**，内存占用仅 **20~40 MB**，且支持**沉浸式全屏、桌面悬浮小时钟与系统托盘菜单**！

---

## 🎨 准备应用图标 (App Icon)

项目中已内置全新生成的 DeepSeek 风格应用图标（位于 `src/assets/images/`）。在执行打包前，使用 Tauri 官方 CLI 一键生成多分辨率桌面图标与托盘图标：

```bash
npx @tauri-apps/cli icon src/assets/images/deepseek_clock_icon_1787300567789.jpg
```
> 执行后会自动生成 `src-tauri/icons/`（包含 `icon.ico`、`32x32.png`、`128x128.png` 等全套桌面与托盘图标）。

---

## 🛠️ 第一步：前置环境准备（只需配置一次）

1. **Node.js**：[https://nodejs.org/](https://nodejs.org/)（推荐 LTS 版本）。
2. **Rust 环境**：
   - 访问 [https://www.rust-lang.org/tools/install](https://www.rust-lang.org/tools/install) 下载并运行 `rustup-init.exe`。
   - 运行后按默认提示输入 `1` 并回车完成安装。
3. **C++ 编译环境 (MSVC)**：
   - 如果系统未安装 Visual Studio，请安装 **Build Tools for Visual Studio**（勾选“使用 C++ 的桌面开发”）。

---

## 🚀 第二步：配置 Tauri 系统托盘与独立悬浮小窗

确保 `src-tauri/` 目录下的核心文件包含以下配置：

### 1. `src-tauri/src/main.rs`（系统托盘：大屏 / 小屏 / 退出）
```rust
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem};

fn main() {
    // 1. 构建系统托盘菜单（大屏、小屏、退出）
    let show_main = CustomMenuItem::new("show_main".to_string(), "📌 打开主界面 / 大屏");
    let show_mini = CustomMenuItem::new("show_mini".to_string(), "⏱️ 切换桌面悬浮时钟 / 小屏");
    let quit = CustomMenuItem::new("quit".to_string(), "❌ 退出程序");

    let tray_menu = SystemTrayMenu::new()
        .add_item(show_main)
        .add_item(show_mini)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(quit);

    let system_tray = SystemTray::new().with_menu(tray_menu);

    tauri::Builder::default()
        .system_tray(system_tray)
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::MenuItemClick { id, .. } => {
                let window = app.get_window("main").unwrap();
                match id.as_str() {
                    "show_main" => {
                        window.show().unwrap();
                        window.set_focus().unwrap();
                        window.emit("tray-show-main", ()).unwrap();
                    }
                    "show_mini" => {
                        window.show().unwrap();
                        window.set_focus().unwrap();
                        window.emit("tray-show-mini", ()).unwrap();
                    }
                    "quit" => {
                        std::process::exit(0);
                    }
                    _ => {}
                }
            }
            _ => {}
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### 2. `src-tauri/tauri.conf.json`（窗口尺寸与系统托盘定义）
```json
{
  "build": {
    "beforeDevCommand": "npm run dev",
    "beforeBuildCommand": "npm run build",
    "devPath": "http://localhost:3000",
    "distDir": "../dist"
  },
  "package": {
    "productName": "DeepSeekClock",
    "version": "0.1.0"
  },
  "tauri": {
    "allowlist": {
      "all": true
    },
    "systemTray": {
      "iconPath": "icons/icon.png",
      "iconAsTemplate": true
    },
    "windows": [
      {
        "title": "DeepSeek 桌面时钟 · 梁文峰/梁文谷时钟看板",
        "width": 1100,
        "height": 820,
        "minWidth": 300,
        "minHeight": 150,
        "resizable": true,
        "fullscreen": false,
        "decorations": true,
        "center": true
      }
    ]
  }
}
```

---

## 📦 第三步：一键执行编译打包

在项目根目录下打开终端，依次执行：

```bash
# 1. 编译前端
npm run build

# 2. 一键生成 Windows .exe
npx @tauri-apps/cli build
```

打包完成后，在：
```
src-tauri/target/release/bundle/nsis/
```
即可获取生成的 **`DeepSeekClock_0.1.0_x64-setup.exe`** 安装包！

---

## ✨ 桌面端体验说明

1. **沉浸式全屏**：进入全屏后，自动隐藏窗口边框、滚动条并占满整屏，按 `Esc` 或右上角即可退出。
2. **独立桌面悬浮时钟**：点击「小屏 / 切换到小时钟」后，窗口自动缩小为精美卡片（340×180）并自动**置顶（Always on Top）**，支持自由拖动放置在桌面任意角落！
3. **系统托盘常驻**：任务栏右下角托盘图标支持右键菜单「大屏」、「小屏」、「退出」快速切换。
