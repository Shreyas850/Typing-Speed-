const { app, BrowserWindow, Tray, Menu, nativeImage } = require("electron");
const path = require("path");
const AutoLaunch = require("auto-launch");

let mainWindow;
let splash;
let tray;

// Optional: Auto-launch app at login
const autoLauncher = new AutoLaunch({
  name: "Typing Speed Test",
});

autoLauncher.isEnabled().then((isEnabled) => {
  if (!isEnabled) autoLauncher.enable();
});

// Function to create main window
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    resizable: false,
    fullscreenable: false,
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      contextIsolation: true,
    },
  });

  // Load app
  mainWindow.loadFile(path.join(__dirname, "dist", "index.html"));

  // Optional: Open DevTools
  // mainWindow.webContents.openDevTools();

  // Show window when ready and close splash
  mainWindow.once("ready-to-show", () => {
    splash.destroy();
    mainWindow.show();
  });

  // Handle window close (minimize to tray)
  mainWindow.on("close", (event) => {
    event.preventDefault();
    mainWindow.hide();
  });
}

// Function to create splash screen
function createSplashScreen() {
  splash = new BrowserWindow({
    width: 400,
    height: 300,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
  });

  splash.loadFile(path.join(__dirname, "splash.html"));
}

// Function to create system tray icon and menu
function createTray() {
  const icon = nativeImage.createFromPath(path.join(__dirname, "icon.png"));
  tray = new Tray(icon);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Show App",
      click: () => {
        mainWindow.show();
      },
    },
    {
      label: "Quit",
      click: () => {
        app.isQuiting = true;
        app.quit();
      },
    },
  ]);

  tray.setToolTip("Typing Speed Test");
  tray.setContextMenu(contextMenu);

  tray.on("double-click", () => {
    mainWindow.show();
  });
}

app.whenReady().then(() => {
  createSplashScreen();
  createMainWindow();
  createTray();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
