import * as Os from "os";
import {BrowserWindow, Menu, app, dialog, shell, clipboard} from "electron";
import {mainWindow} from "./window";
import {createSettingsWindow} from "../settings/main";

function paste(contents: any): void {
    const contentTypes = clipboard.availableFormats().toString();
    //Workaround: fix pasting the images.
    if (contentTypes.includes("image/") && contentTypes.includes("text/html")) {
        clipboard.writeImage(clipboard.readImage());
    }
    contents.paste();
}
export async function setMenu(): Promise<void> {
    // Get version info
    const appName = app.getName();
    const appVer = app.getVersion();
    const userDataDir = app.getPath("userData");
    const electronVer = process.versions.electron;
    const chromeVer = process.versions.chrome;
    const nodeVer = process.versions.node;
    const v8Ver = process.versions.v8;
    // Globally export what OS we are on
    const isLinux = process.platform === "linux";
    const isWin = process.platform === "win32";
    const isMac = process.platform === "darwin";
    let currentOS: any;
    if (isLinux) {
        currentOS = "Linux";
    } else if (isWin) {
        currentOS = "Windows";
    } else if (isMac) {
        currentOS = "MacOS";
    } else {
        currentOS = "BSD";
    }
    const archType = Os.arch();
    let template: Electron.MenuItemConstructorOptions[] = [
        {
            label: "ArmCord",
            submenu: [
                {label: "About ArmCord", role: "about", visible: isMac ? true : false}, //orderFrontStandardAboutPanel
                {
                    label: "Open settings",
                    accelerator: "CmdOrCtrl+Shift+'",
                    click() {
                        createSettingsWindow();
                    }
                },
                {
                    label: "Relaunch",
                    accelerator: "CmdOrCtrl+Alt+R",
                    click() {
                        app.relaunch();
                        app.quit();
                    }
                },
                {
                    label: "Quit",
                    accelerator: "CmdOrCtrl+Q",
                    click() {
                        app.quit();
                    }
                }
            ]
        },
        {
            role: "editMenu",
            submenu: [
                {role: "undo"},
                {role: "redo"},
                {type: "separator"},
                {role: "cut"},
                {role: "copy"},
                {
                    label: "Paste",
                    role: "paste",
                    accelerator: "CmdOrCtrl+V",
                    click() {
                        paste(mainWindow.webContents);
                    }
                },
                {role: "delete"},
                {type: "separator"},
                {role: "selectAll"}
            ]
        },
        {role: "viewMenu"},
        {role: "windowMenu"},
        {
            label: "Developer",
            submenu: [
                {
                    label: "Reload F5",
                    accelerator: "F5",
                    visible: false,
                    acceleratorWorksWhenHidden: true,
                    click(item, focusedWindow) {
                        if (focusedWindow) focusedWindow.reload();
                    }
                },
                {
                    label: "Open User Data Dir",
                    click() {
                        shell.openPath(userDataDir);
                    }
                },
                {
                    label: "Open Electron DevTools",
                    accelerator: isMac ? "Cmd+Shift+F12" : "F12",
                    click(item, focusedWindow) {
                        // @ts-expect-error
                        BrowserWindow.getFocusedWindow().openDevTools({mode: "detach"});
                    }
                },
                {type: "separator"},
                {
                    label: "Open chrome://gpu",
                    click() {
                        const gpuWindow = new BrowserWindow({
                            width: 900,
                            height: 700,
                            useContentSize: true,
                            title: "GPU Internals"
                        });
                        gpuWindow.loadURL("chrome://gpu");
                    }
                },
                {
                    label: "Open chrome://process-internals",
                    click() {
                        const procsWindow = new BrowserWindow({
                            width: 900,
                            height: 700,
                            useContentSize: true,
                            title: "Process Model Internals"
                        });
                        procsWindow.loadURL("chrome://process-internals");
                    }
                }
            ]
        },
        {
            role: "help",
            label: "About",
            submenu: [
                {label: appName + " v" + appVer, enabled: false},
                {
                    label: "File an Issue",
                    click() {
                        shell.openExternal("https://github.com/Alex313031/ArmCord-Win7/issues/new/choose");
                    }
                },
                {
                    label: "About",
                    accelerator: "CmdorCtrl+Alt+A",
                    click() {
                        const info = [
                            appName + " v" + appVer,
                            "",
                            "Electron : " + electronVer,
                            "Chromium : " + chromeVer,
                            "Node : " + nodeVer,
                            "V8 : " + v8Ver,
                            "OS : " + currentOS + " " + archType
                        ];
                        dialog.showMessageBox({
                            type: "info",
                            title: "About " + appName,
                            message: info.join("\n"),
                            buttons: ["Ok"]
                        });
                    }
                }
            ]
        }
    ];

    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}
