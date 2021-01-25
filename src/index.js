const { app, BrowserWindow, Menu, Tray } = require("electron");
const path = require("path");
const fs = require("fs");


if (fs.existsSync(path.join(app.getPath("userData"), "../discord/"))) {
  var loadFile = "index.html";
} else {
  var loadFile = "alert.html";
}

if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 992,
    minWidth: 992,
    height: 701,
    minHeight: 701,
    icon: path.join(__dirname, "assets/logo/logo.png"),
    backgroundColor: "#3A416F",
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
    frame: false,
  });

  mainWindow.maximize();
  mainWindow.loadFile(path.join(__dirname, loadFile));

  app.whenReady().then(() => {
    tray = new Tray(path.join(__dirname, "assets/logo/logo.png"))
    const contextMenu = Menu.buildFromTemplate([
      { label: 'Show', click: () => { mainWindow.show() } },
      { label: 'Hide', click: () => { mainWindow.hide() } },
      { label: 'Close', click: () => { mainWindow.close() } }
    ])
    tray.setToolTip('This is my application.')
    tray.setContextMenu(contextMenu)
  })
  
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});