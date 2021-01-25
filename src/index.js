const { app, BrowserWindow } = require("electron");
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
