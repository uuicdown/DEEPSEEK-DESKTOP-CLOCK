#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem};

fn main() {
    // 1. 构建系统托盘右键菜单
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
            // 单击托盘左键恢复显示主界面
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
