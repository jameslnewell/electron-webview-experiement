const electron = require('electron');
const ipcMain = electron.ipcMain;
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const browserWindows = [];

function openWindow(url) {

  const window = new BrowserWindow();
  window.loadURL('file://' + __dirname + '/index.html');
  window.webContents.openDevTools();

  window.webContents.on('did-finish-load', function() {
    if (url) {
      window.webContents.send('load-url', url);
    }
  });

  window.on('closed', function() {
    window = null;
    //browserWindows = browserWindows.slice(0, 1) //TODO: remove the browser window
  });

  browserWindows.push(window);

};

electron.crashReporter.start();

app.on('ready', function() {
  openWindow();
});

app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

ipcMain.on('open-window', function(event, url) {
  openWindow(url);
});
