import * as path from "path";
import * as fs from "fs";
import {addStyle} from "../../common/dom.js";

type WebviewTag = Electron.WebviewTag;

var webview = `<webview src="${path.join(
    "file://",
    __dirname,
    "../",
    "../",
    "/settings/settings.html"
)}" preload="${path.join(
    "file://",
    __dirname,
    "../",
    "../",
    "/settings/preload.js"
)}" id="inAppSettings" webpreferences="sandbox=false"></webview>`;

export function injectSettings() {
    document.getElementById("webviewSettingsContainer")!.innerHTML = webview;
    document.getElementById("ACsettingsModal")!.style.display = "block";
}

document.addEventListener("DOMContentLoaded", function (_event) {
    const settingsCssPath = path.join(__dirname, "../", "/content/css/inAppSettings.css");
    addStyle(fs.readFileSync(settingsCssPath, "utf8"));
    const webview = document.querySelector("webview") as WebviewTag;
    webview.addEventListener("console-message", (e) => {
        console.log("Settings page logged a message:", e.message);
    });
});
