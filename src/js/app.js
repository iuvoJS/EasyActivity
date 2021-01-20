const $ = require("jquery");
let { remote } = require("electron");
const { app, Tray, Menu } = remote;
const BrowserWindow = remote.getCurrentWindow();
const fs = require("fs");
const path = require("path");
const discord_rpc = require("discord-rpc");
const rpc = new discord_rpc.Client({
  transport: "ipc",
});

function createTray() {
  let trayIcon = new Tray(path.join(__dirname, "/assets/logo/logo.png"));

  const trayMenu = [
    {
      label: "Apply",
      click: function () {
        $(".submit[data-submit=dp]").click();
      },
    },
    {
      label: "Hide",
      click: function () {
        BrowserWindow.hide();
      },
    },
    {
      label: "Show",
      click: function () {
        BrowserWindow.show();
      },
    },
    {
      label: "Close",
      click: function () {
        window.close();
      },
    },
  ];

  let tray = Menu.buildFromTemplate(trayMenu);
  trayIcon.setContextMenu(tray);
}

function createUserDataFolder(folder) {
  const target = path.join(app.getPath("userData"), folder);
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target);
    return true;
  }

  return false;
}

function createUserDataFile(filename, extension, folder, content) {}

function readJSON(filename, folder) {
  let raw = fs.readFileSync(
    path.join(app.getPath("userData"), folder + "/" + filename + ".json"),
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
  preload.hide(
    250,
    () => {
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
    },
    "after"
  );
  createTray();
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

$(document).ready(function () {
  readContent();
});

function readContent() {
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

class Preload {
  constructor() {
    this.hide = function (delay, func, time) {
      if (typeof delay === undefined) delay = 50;
      if (time == "after" && typeof func == "function") {
        var func__do = true;
      } else if (time == "before" && typeof func == "function") {
        func();
      }

      setTimeout(function () {
        if (func__do) {
          func();
        }
        $(".preload").addClass("finish");
      }, delay);
    };

    this.restart = function () {
      const e = $(".preload");
      if (e.hasClass("finish")) e.removeClass("finish");
    };

    this.show = function (duration) {
      const e = $(".preload");
      if (e.hasClass("finish")) e.removeClass("finish");
      if (typeof duration === "number") {
        setTimeout(function () {
          if (!e.hasClass("finish")) e.addClass("finish");
        }, duration);
      }
    };
  }
}

let preload = new Preload();

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
