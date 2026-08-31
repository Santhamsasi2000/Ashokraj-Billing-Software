const { app, BrowserWindow } = require("electron");
const path = require("path");
const { fork } = require("child_process");

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
    icon: path.join(__dirname, "frontend", "public", "icon.ico"), // Optional Icon
    autoHideMenuBar: true, // Hides top file menu for clean POS look
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Maximize Window on launch for POS counter feel
  mainWindow.maximize();

  // 3. Load the Local Server URL
  setTimeout(() => {
    mainWindow.loadURL("http://localhost:5000");
  }, 1000); // 1 sec delay to ensure Express server is ready

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