const { app, BrowserWindow } = require("electron");
const path = require("path");
const { fork } = require("child_process");
const http = require("http");

let mainWindow;
let serverProcess;

function createWindow() {
  // 1. Start the Express Backend Server silently
  const serverPath = path.join(__dirname, "backend", "server.js");
  serverProcess = fork(serverPath);

  // 2. Create Native Windows Desktop Window
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 700,
    title: "Ashokraj Restaurant Billing",
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.maximize();

  // 3. Smart Server Poll: Checks http://localhost:5000 every 300ms until ready
  const pollServer = () => {
    http
      .get("http://localhost:5000", (res) => {
        mainWindow.loadURL("http://localhost:5000");
      })
      .on("error", () => {
        setTimeout(pollServer, 300); // Retry after 300ms if server is still starting
      });
  };

  pollServer();

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// App Ready Event
app.on("ready", createWindow);

// Kill Express server process when desktop window closes
app.on("window-all-closed", () => {
  if (serverProcess) serverProcess.kill();
  if (process.platform !== "darwin") app.quit();
});