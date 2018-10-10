const {app, BrowserWindow} = require('electron')
const {ipcMain} = require('electron')
const electron = require('electron')
const path = require('path')
const fs = require('fs')
const Menu = electron.Menu
const subFolderName = 'PDF'
quit = false

let mainWindow

function createWindow () {
    mainWindow = new BrowserWindow({width: 650, height: 500, icon:'images/icon/drv-at.png'})
    mainWindow.loadFile('index.html')
    mainWindow.maximize()
    mainWindow.on('closed', function () { mainWindow = null })

    printWindow = new BrowserWindow({width: 1414, height: 1000, show: false, resizable: false})
    printWindow.loadFile('print.html')
    printWindow.setMenu(null)
    printWindow.hide();
    //printWindow.webContents.openDevTools()
}

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
                {
                    label: 'Einstellungen',
                    accelerator: 'CmdOrCtrl+Shift+E',
                    click (){toRenderer(['openSettings'])}
                }
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

    mainWindow.setMenu(Menu.buildFromTemplate(template))

    mainWindow.on('close', function(e){
        var choice = require('electron').dialog.showMessageBox(this,{
            type: 'warning',
            buttons: ['Schließen', 'Abbrechen'],
            title: 'Programm schließen?',
            message: 'Wollen Sie das Programm schließen?\nEventuell ungespeicherter Fortschritt geht verlohren!'
        });

        if(choice == 1){
            quit = false
            e.preventDefault();
        } else {
            //enable close for printWindow
            quit = true
            printWindow.close()
            // TODO: send renderer msg to delete temp file
        }
    });

    //can only close when mainWindow is closing
    printWindow.on('close', function(e){
        if(quit !== true){ e.preventDefault(); }
    });

})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') { app.quit() }
})

app.on('activate', function () {
    if (mainWindow === null) { createWindow() }
})



///////////////////////////////////////////////////////////////
////////////////////////Request Methods////////////////////////
///////////////////////////////////////////////////////////////

function toRenderer(arg) { mainWindow.webContents.send('msgFromMain', arg); }

ipcMain.on('request-main', (event, arg) => {
    if(arg == 'openedWithFile'){
        if (process.platform == 'win32' && process.argv.length >= 2) {
            toRenderer(['startupOpen',process.argv[1]])
        }
    }
})

ipcMain.on('print-info', (event, arg) => {
    printWindow.webContents.send('print-info-return', arg);
    printWindow.show();
})

ipcMain.on('print-close', () => {
    printWindow.hide();
    mainWindow.webContents.focus()
})

ipcMain.on('print-to-pdf', function(event, args) {

    let filepath = args[0];
    let filename = args[1];

    
    if (!fs.existsSync(filepath+'/'+subFolderName)) {
        fs.mkdirSync(filepath+'/'+subFolderName)
    }

    let pdfPath = path.join(filepath,subFolderName,filename)

    printWindow.webContents.printToPDF({printBackground: true, marginsType: 1, landscape: true}, function(error, data){
        if(error) return console.error(error.message);
        fs.writeFile(pdfPath, data, function(err) {
            if(err) return console.error(err.message);
            if(args[2]){
                event.sender.send('print-front-ready', filepath);
            }
        })
    })
})