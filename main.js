// main.js
const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      contextIsolation: true,
    },
  });

  win.loadFile("dist/index.html"); // Or your build output
}

app.whenReady().then(createWindow);
