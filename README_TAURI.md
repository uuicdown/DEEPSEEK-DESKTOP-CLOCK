# 🚀 DeepSeek 桌面时钟 · Tauri 打包 Windows .exe 全流程指南 (Zero to One)

本项目采用 **Vite + React 18 + TypeScript** 作为现代化前端，并基于 **Rust + Tauri** 进行原生级极小体积封装。
打包产出的 Windows `.exe` 安装包仅约 **3~5 MB**，日常运行内存仅 **20~40 MB**，且具备**沉浸式全屏、独立置顶悬浮小时钟、全局多主题联动与系统托盘驻留**四大桌面级特性！

---

## 🛠️ 第一步：准备 Windows 本地开发环境（仅首次需要）

在 Windows 电脑上编译 Tauri 应用，需要准备以下 3 项基础环境：

### 1. 安装 Node.js (推荐 LTS 18 或 20+)
* 官方下载地址：[https://nodejs.org/](https://nodejs.org/)
* 安装后打开终端（PowerShell 或 CMD）验证：
  ```bash
  node -v
  npm -v
  ```

### 2. 安装 Rust 编译环境
* 访问 Rust 官网下载安装器：[https://www.rust-lang.org/tools/install](https://www.rust-lang.org/tools/install)
* 双击运行 `rustup-init.exe`，出现选择项时直接按 **回车 (默认选择 1. Proceed with installation (default))** 即可。
* 安装完成后关闭并重新打开终端，验证安装成功：
  ```bash
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
```bash
npm install
```

### 2. 生成专属 Windows 桌面与托盘图标 (Icon)
项目中已内置生成的 DeepSeek 风格高清图标（位于 `src/assets/images/`），运行 Tauri 官方图标命令行工具：
```bash
npx @tauri-apps/cli icon src/assets/images/deepseek_clock_icon_1787300567789.jpg
```
> 💡 **提示**：该命令会自动在 `src-tauri/icons/` 目录下生成 `icon.ico`、`32x32.png`、`128x128.png` 等全套 Windows 桌面与托盘图标文件。

---

## ⚙️ 第三步：确认 Tauri 核心配置文件

项目中已为您配置好 `src-tauri/` 目录结构与标识符（`com.Soren.deepseekclock`）：

### 1. `src-tauri/tauri.conf.json`
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
    "bundle": {
      "active": true,
      "category": "Utility",
      "copyright": "Copyright © 2026 Soren. All rights reserved.",
      "deb": {
        "depends": []
      },
      "externalBin": [],
      "icon": [
        "icons/32x32.png",
        "icons/128x128.png",
        "icons/128x128@2x.png",
        "icons/icon.icns",
        "icons/icon.ico"
      ],
      "identifier": "com.Soren.deepseekclock",
      "longDescription": "DeepSeek 桌面时钟 · 梁文峰/梁文谷峰谷时段追踪与 Token 计费看板",
      "macOS": {
        "frameworks": [],
        "minimumSystemVersion": "",
        "exceptionDomain": "",
        "signingIdentity": null,
        "entitlements": null
      },
      "resources": [],
      "shortDescription": "DeepSeek 桌面时钟",
      "targets": "all",
      "windows": {
        "certificateThumbprint": null,
        "digestAlgorithm": "sha256",
        "timestampUrl": ""
      }
    },
    "allowlist": {
      "all": true,
      "window": {
        "all": true,
        "close": true,
        "hide": true,
        "show": true,
        "maximize": true,
        "minimize": true,
        "unmaximize": true,
        "unminimize": true,
        "startDragging": true,
        "setFullscreen": true,
        "setAlwaysOnTop": true,
        "setSize": true,
        "setMinSize": true,
        "setMaxSize": true,
        "setResizable": true,
        "setTitle": true,
        "setPosition": true,
        "center": true
      }
    },
    "systemTray": {
      "iconPath": "icons/icon.ico",
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
        "center": true,
        "alwaysOnTop": false,
        "transparent": false
      }
    ]
  }
}
```

### 2. `src-tauri/src/main.rs`（系统托盘与三项菜单）
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
            // 单击托盘图标快速激活窗口
            SystemTrayEvent::LeftClick { .. } => {
                let window = app.get_window("main").unwrap();
                window.show().unwrap();
                window.set_focus().unwrap();
            }
            _ => {}
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

---

## 📦 第四步：一键执行编译打包

在项目根目录下，依次执行两条命令：

```bash
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
