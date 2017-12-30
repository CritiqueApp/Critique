const fs = require('fs')
const electron = require('electron')
const {menu} = require('./menu')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const dialog = electron.dialog

let window
const createWindow = () => {
  let windowSettings = {
    show: false,
    titleBarStyle: 'hiddenInset',
    frame: (process.platform == "win32" ? false : true),
    minWidth: 520,
    maxWidth: 520,
    minHeight: 400,
    maxHeight: 800,
    width: 520,
    height: 600,
  }
  window = new BrowserWindow(windowSettings)
  Menu.setApplicationMenu(menu)

  let extension = '/Users/matthijs/Library/Application Support/Google/Chrome/Profile 2/Extensions/fmkadmapgofadopljbjfkapdkoienihi/2.5.2_0/'
  if(fs.existsSync(extension)) {
    BrowserWindow.addDevToolsExtension(extension)
  }

  window.loadURL(`file://${__dirname}/main.html`)

  window.on('closed', () => {
    window = null
  })
  window.once('ready-to-show', () => {
    window.show()
  })
}

app.on('ready', createWindow)
app.on('window-all-closed', () => {
  if(process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('activate', () => {
  if(window === null) {
    createWindow()
  }
})
app.on('open-file', (e) => {
  e.preventDefault()
})
app.on('open-url', (e) => {
  e.preventDefault()
})
