const $ = require("jquery");
let { remote } = require("electron");
const { app } = remote;
const BrowserWindow = remote.getCurrentWindow();
const fs = require("fs");
const path = require("path");

$(document).ready(function (e) {
  const exists = fs.existsSync(path.join(app.getPath("userData"), "../discord/"));
  const userDataPath = path.join(app.getPath("userData"), "../discord/");
  $(".bottom-left").html(`Exists: ${exists} <br> Folder: ${userDataPath}`);

  $(".title-bar__name span").text(document.title);
});

$(".title-bar span").click(function (e) {
  e.preventDefault();
  target = $(this).attr("href");

  switch (target) {
    case "#minimize":
      BrowserWindow.minimize();
      break;
    case "#maximize":
      if (BrowserWindow.isMaximized()) {
        BrowserWindow.restore();
      } else {
        BrowserWindow.maximize();
      }
      break;
    case "#close":
      window.close();
      break;
  }
});

$(document).keydown(function (e) {
  if (e.which == 116 || e.which == 27) {
    e.preventDefault();
    location.reload();
  } else if (e.which == 123) {
    e.preventDefault();
    if (BrowserWindow.isDevToolsOpened()) {
      BrowserWindow.closeDevTools();
    } else {
      BrowserWindow.openDevTools();
    }
  }
});
