#!/usr/bin/env node

const rgb = (r, g, b, msg) => `\x1b[38;2;${r};${g};${b}m${msg}\x1b[0m`;
const log = (...args) => console.log(`[${rgb(88, 101, 242, "arRPC")}]`, ...args);

log("arRPC v3.4.0 ArmCord-Win7");

const RPCServer = require("./server.js");
const {mainWindow} = require("../../../ts-out/discord/window.js");

async function run() {
    const server = await new RPCServer();
    server.on("activity", (data) => mainWindow.webContents.send("rpc", data));
    server.on("invite", (code) => {
        console.log(code);
        const {createInviteWindow} = require("../../../ts-out/discord/window.js");
        createInviteWindow(code);
    });
}
run();
