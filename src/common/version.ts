import {app} from "electron";

export function getVersion(): string {
    if ((app.getVersion() == process.versions.electron) == true) {
        return "3.3.4";
    }
    return app.getVersion();
}
export function getDisplayVersion(): string {
    return getVersion();
}
