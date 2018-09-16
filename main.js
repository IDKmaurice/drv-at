// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const {ipcMain} = require('electron')
const electron = require('electron')
const Menu = electron.Menu

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 650, height: 500, icon:'images/icon/drv-at.png'})

    // and load the index.html of the app.
    mainWindow.loadFile('index.html')

    //maximize window
    mainWindow.maximize()

    // Open the DevTools.
    //mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}



function toRenderer(arg) { mainWindow.webContents.send('ping', arg); }

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function(){

    createWindow()

    const template = [
        {
            label:'Datei',
            submenu: [
                {
                    label:'Neu',
                    accelerator: 'CmdOrCtrl+N',
                    click (){toRenderer(['new'])}
                },{
                    label:'Öffnen',
                    accelerator: 'CmdOrCtrl+O',
                    click (){toRenderer(['open'])}
                },
                {type: 'separator'},
                {
                    label:'Hauptseite',
                    accelerator: 'CmdOrCtrl+Shift+H',
                    click (){toRenderer(['home'])}
                },
                {type: 'separator'},
                {
                    label:'Speichern',
                    accelerator: 'CmdOrCtrl+S',
                    click (){toRenderer(['save'])}
                },{
                    label:'Speichern unter...',
                    accelerator: 'CmdOrCtrl+Shift+S',
                    click (){toRenderer(['saveas'])}
                },{
                    label:'Drucken',
                    accelerator: 'CmdOrCtrl+P',
                    click (){toRenderer(['print'])}
                },
                {type: 'separator'},
                {
                    label:'Beenden',
                    click(){toRenderer(['close'])}
                }
            ]
        },{
            label:'Bearbeiten',
            submenu:[
                {label: 'Kopieren', role: 'copy'},
                {label: 'Einfügen', role: 'paste'},
                {label: 'Ausschneiden', role: 'cut'},
                {type: 'separator'},
                {label: 'Einstellungen'}
            ]
        },{
            label:'Fenster',
            submenu:[
                {label: 'Dev Tools öffnen', role: 'toggledevtools'},
            ]
        },{
            label:'Hilfe',
            submenu:[
                {
                    label: 'Online Hilfe',
                    click () { require('electron').shell.openExternal('https://maurice-freuwoert.com') }
                },
            ]
        }
    ]

    const menu = Menu.buildFromTemplate(template)

    mainWindow.setMenu(menu)


    mainWindow.on('close', function(e){
        var choice = require('electron').dialog.showMessageBox(this,{
            type: 'warning',
            buttons: ['Schließen', 'Abbrechen'],
            title: 'Programm schließen?',
            message: 'Wollen Sie das Programm schließen?\nEventuell ungespeicherter Fortschritt geht verlohren!'
        });
        if(choice == 1){
            e.preventDefault();
        } else {
            // TODO: send renderer msg to delete temp file
        }
    });

})

ipcMain.on('request-mainprocess-action', (event, arg) => {
    if(arg == 'openedWithFile'){
        if (process.platform == 'win32' && process.argv.length >= 2) {
            toRenderer(['startupOpen',process.argv[1]])
        }
    }
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})
