// DOM Manipulator
const $ = require("jquery");
// Gives access to more modules
let { remote } = require("electron");
// App, System Tray, System Menu
const { app, Tray, Menu } = remote;
// Browser Window
const BrowserWindow = remote.getCurrentWindow();
// File System
const fs = require("fs");
const path = require("path");
// Notify Tool
const notifier = require("node-notifier");
// Discord RPC
const discord_rpc = require("discord-rpc");
const rpc = new discord_rpc.Client({
  transport: "ipc",
});

function createUserDataFolder(folder) {
  const target = path.join(app.getPath("userData"), folder);
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target);
    return true;
  }

  return false;
}

function readJSON(filename, folder) {
  let raw = fs.readFileSync(
    path.join(app.getPath("userData"), `${folder}/${filename}.json`),
    "utf-8"
  );

  return JSON.parse(raw);
}

function writeJSON(filename, content, folder) {
  fs.writeFileSync(
    path.join(app.getPath("userData"), folder + "/" + filename + ".json"),
    JSON.stringify(content, null, 2)
  );

  return 0;
}

$(document).ready(function () {
  $(".title-bar__name span").text(document.title);
  createUserDataFolder("discord_pre");
  const preconfig = path.join(
    app.getPath("userData"),
    "discord_pre/config.json"
  );
  if (fs.existsSync(preconfig)) {
    if (fs.readFileSync(preconfig).length === 0) {
      writeTemplate();
    }
  } else {
    writeTemplate();
  }
  readContent();
});

writeTemplate = function () {
  writeJSON(
    "config",
    {
      app_id: "801220827877998602",
      details: "Rich Presence Tool",
      state: "developed by m2v",
      large_key: "large",
      large_text: "Discord Rich Presence Tool",
      small_key: "small",
      small_text: "github.com/iuvoJS/",
    },
    "discord_pre"
  );
};

$(".on-hide").click (function (e) {
  BrowserWindow.hide();
  notifier.notify({
    title: "Minimized to Tray",
    message: "EasyActivity has been minimized in the system tray, if you don't want this click on me",
    icon: path.join(__dirname, "assets/logo/logo_full.png"),
    sound: true,
    wait: false,
  }),
    notifier.on("click", function () {
      BrowserWindow.show();
    });
})

$(".config-reset").click(function () {
  createUserDataFolder("discord_pre");
  fs.unlinkSync(path.join(app.getPath("userData"), "discord_pre/config.json"));
  writeTemplate();
  readContent();
  $(".submit[data-submit=dp]").click();
});

$(".preview").click(function () {
  $("#preview").addClass("show");
});

$(".dialog .bg-shadow").click(function () {
  $("#preview").removeClass("show");
});

$(".title-bar span").click(function (e) {
  // Click on Menubar
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

function readContent() {
  // Read form values
  const file = readJSON("config", "discord_pre");
  $("form.dpp #dp__id").val(file.app_id);
  $("form.dpp #dp__details").val(file.details);
  $("form.dpp #dp__state").val(file.state);
  $("form.dpp #dp__large_key").val(file.large_key);
  $("form.dpp #dp__large_text").val(file.large_text);
  $("form.dpp #dp__small_key").val(file.small_key);
  $("form.dpp #dp__small_text").val(file.small_text);
}

$(".submit[data-submit=dp]").click(function () {
  const app_id = $("form.dpp #dp__id").val(),
    details = $("form.dpp #dp__details").val(),
    state = $("form.dpp #dp__state").val(),
    large_key = $("form.dpp #dp__large_key").val(),
    large_text = $("form.dpp #dp__large_text").val(),
    small_key = $("form.dpp #dp__small_key").val(),
    small_text = $("form.dpp #dp__small_text").val();

  rpc.on("ready", () => {
    rpc.setActivity({
      details: details,
      state: state,
      startTimestamp: new Date(),
      largeImageKey: large_key,
      largeImageText: large_text,
      smallImageKey: small_key,
      smallImageText: small_text,
    });
  });

  rpc.login({
    clientId: app_id,
  });

  writeJSON(
    "config",
    {
      app_id: app_id,
      details: details,
      state: state,
      large_key: large_key,
      large_text: large_text,
      small_key: small_key,
      small_text: small_text,
    },
    "discord_pre"
  );
});

// Debug
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

$(".reload").click(() => {
  location.reload();
});
