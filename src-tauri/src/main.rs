#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    Emitter, Manager, LogicalSize, Size,
};

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            // 1. 构建系统托盘右键菜单
            let show_main = MenuItem::with_id(app, "show_main", "📌 打开主界面 / 大屏", true, None::<&str>)?;
            let show_mini = MenuItem::with_id(app, "show_mini", "⏱️ 切换桌面悬浮小时钟", true, None::<&str>)?;
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
                            let _ = window.set_resizable(true);
                            let _ = window.set_always_on_top(false);
                            let _ = window.set_size(Size::Logical(LogicalSize { width: 1000.0, height: 760.0 }));
                            let _ = window.center();
                            let _ = window.unminimize();
                            let _ = window.show();
                            let _ = window.set_focus();
                            let _ = window.emit("tray-show-main", ());
                        }
                    }
                    "show_mini" => {
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.set_resizable(false);
                            let _ = window.set_always_on_top(true);
                            let _ = window.set_size(Size::Logical(LogicalSize { width: 310.0, height: 135.0 }));
                            let _ = window.unminimize();
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
                            let _ = window.unminimize();
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
