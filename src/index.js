const { app, BrowserWindow } = require("electron");
const { join } = require("path");
const fs = require("fs");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 940,
    minWidth: 940,
    height: 500,
    minHeight: 500,
    icon: join(__dirname, "assets/logo/logo.png"),
    backgroundColor: "#2C2F33",
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
    frame: false,
  });

  mainWindow.maximize();
  mainWindow.loadFile(join(__dirname, "index.html"));
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.