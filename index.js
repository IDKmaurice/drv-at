const { app, BrowserWindow, globalShortcut } = require('electron')
const { autoUpdater } = require('electron-updater')
const { ipcMain } = require('electron')
const electron = require('electron')
const log = require('electron-log')
const path = require('path')
const fs = require('fs')
const Menu = electron.Menu
const subFolderName = 'PDF'
quit = false

let mainWindow

function createWindow () {
    mainWindow = new BrowserWindow({
        width: 650,
        height: 500,
        icon:'images/icon/logo_white.png',
        webPreferences: {
            nodeIntegration: true
        }
    })

    mainWindow.loadFile('index.html')
    mainWindow.maximize()
    mainWindow.setTitle(`Gencestor ${app.getVersion()}`)
    mainWindow.on('closed', function () { mainWindow = null })
    //mainWindow.webContents.openDevTools()



    printWindow = new BrowserWindow({
        width: 1800,
        height: 1000,
        show: false,
        icon: 'images/icon/logo_white.png',
        webPreferences: {
            nodeIntegration: true
        }
    })

    printWindow.loadFile('print.html')
    printWindow.setMenu(null)
    printWindow.hide()
    printWindow.setTitle(`Gencestor ${app.getVersion()} - Druckvorschau`)
    //printWindow.webContents.openDevTools()

    workerWindow = new BrowserWindow({
        width: 1414,
        height: 1000,
        show: true,
        frame: false,
        icon: 'images/icon/logo_white.png',
        webPreferences: {
            nodeIntegration: true
        }
    })

    workerWindow.loadFile('worker.html')
    workerWindow.setMenu(null)
    workerWindow.hide()
    workerWindow.setTitle(`Gencestor ${app.getVersion()} PrintWorker`)
    //workerWindow.webContents.openDevTools()
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
        }
    ]

    mainWindow.setMenu(Menu.buildFromTemplate(template))
    //mainWindow.setMenu(null)

    // globalShortcut.register('CmdOrCtrl+N',          () => { toRenderer(['new']) })
    // globalShortcut.register('CmdOrCtrl+O',          () => { toRenderer(['open']) })
    // globalShortcut.register('CmdOrCtrl+Shift+H',    () => { toRenderer(['home']) })
    // globalShortcut.register('CmdOrCtrl+S',          () => { toRenderer(['save']) })
    // globalShortcut.register('CmdOrCtrl+Shift+S',    () => { toRenderer(['saveas']) })
    // globalShortcut.register('CmdOrCtrl+P',          () => { toRenderer(['print']) })
    // globalShortcut.register('CmdOrCtrl+Shift+E',    () => { toRenderer(['openSettings']) })
    // globalShortcut.register('CmdOrCtrl+Shift+I',    () => { mainWindow.webContents.openDevTools() })

    mainWindow.on('close', function(e){
        var choice = require('electron').dialog.showMessageBox(this,{
            type: 'warning',
            buttons: ['Schließen', 'Abbrechen'],
            title: 'Programm schließen?',
            message: 'Wollen Sie das Programm schließen?\nEventuell ungespeicherter Fortschritt geht verlohren!'
        });

        if(choice == 1){
            quit = false
            e.preventDefault()
        } else {
            //enable close for printWindow
            quit = true
            printWindow.close()
            workerWindow.close()
        }
    })

    //can only close when mainWindow is closing
    printWindow.on('close', function(e){
        if(quit !== true){
            e.preventDefault()
            printWindow.hide()
            mainWindow.webContents.focus()
        }
    })

    workerWindow.on('close', function (e) {
        if (quit !== true) {
            e.preventDefault()
        }
    })

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

function toRenderer(arg) { mainWindow.webContents.send('msgFromMain', arg) }

ipcMain.on('loaded', (event) => {
    
    if (process.platform == 'win32' && process.argv.length >= 2) {
        toRenderer(['startupOpen',process.argv[1]])
    }

    ///////////////////////////////////////////////////////////////
    ////////////////////////Updater Methods////////////////////////
    ///////////////////////////////////////////////////////////////

    autoUpdater.on('error', function (err) {
        toRenderer(['update_error', JSON.stringify(err)])
    })

    autoUpdater.on('checking-for-update', () => {
        toRenderer(['update_checking'])
    })

    autoUpdater.on('update-available', function (info) {
        toRenderer(['update_available', JSON.stringify(info)])
    })

    autoUpdater.on('update-not-available', function () {
        toRenderer(['update_not_available'])
    })

    autoUpdater.on('update-downloaded', function () {
        toRenderer(['update_downloaded'])
    })

    autoUpdater.logger = log
    autoUpdater.logger.transports.file.level = 'info'
    log.info('App starting...')

    setTimeout(() => {
        autoUpdater.checkForUpdatesAndNotify()
    }, 3000)

})



ipcMain.on('print-close', () => {
    printWindow.hide()
    mainWindow.webContents.focus()
})

ipcMain.on('print-info', (event, arg) => {
    printWindow.webContents.send('print-info-return', arg)
    printWindow.show()
})

ipcMain.on('print-request', (event, args) => {
    workerWindow.webContents.send('print-request-return', args)
})

ipcMain.on('print-to-pdf', function(event, args) {

    let filepath = args[0]
    let filename = args[1]

    
    if (!fs.existsSync(filepath+'/'+subFolderName)) {
        fs.mkdirSync(filepath+'/'+subFolderName)
    }

    let pdfPath = path.join(filepath,subFolderName,filename)

    workerWindow.webContents.printToPDF({printBackground: true, marginsType: 1, landscape: true, pageSize: 'A4'}, function(error, data){
        if(error) return console.error(error.message)
        fs.writeFile(pdfPath, data, function(err) {
            if(err) return console.error(err.message)
            event.sender.send('print-to-pdf-ready')
        })
    })
})





// const printer = require('node-native-printer')
// const PDFKit = require('pdfkit')

// const doc = new PDFKit({
//     margin: 50,
//     layout: 'landscape',
//     size: 'A4'
// })

// const stream = doc.pipe(fs.createWriteStream('output.pdf'))

// doc.fontSize(25)
//     .text('Some text with an embedded font!', {
//         align: 'center'
//     })

// doc.fontSize(20)
//     .text('Here is some vector graphics...', {
//         width: 410,
//         align: 'left'
//     })

// doc.end()

// stream.on('finish', function() {
//     console.log('PRINTING')

//     filename = 'output.pdf'
//     printername = 'Brother MFC-L3770CDW series Printer'
//     data = fs.readFileSync(filename)
    
//     console.log(printer.listPrinters())
//     console.log(printer.printerOptions(printername))
    
//     if( process.platform != 'win32') {
        
//     } else {
//         printer.print(filename, {
//             "landscape": true,
//             "paperSize": "A4",
//             "sides": "two-sided-long-edge"
//         }, printername)
//     }
// })