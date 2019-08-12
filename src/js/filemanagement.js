function getTempName(dir, arg) {
    let date = new Date().getTime();
    const { app } = require('electron').remote;
    //console.log(app.getPath('userData'));
    // TODO: save data in appdata instead of in src files

    if (arg == "date") {
        return __dirname + "/" + dir + "temp-" + date + ".json";

    } else if (arg == "db") {
        return __dirname + "/" + dir + "temp-current";

    } else if (arg == "folder") {
        return __dirname + "/" + dir;
        
    } else {
        return __dirname + "/" + dir + "temp-current.json";
    }
}



function deleteFile(filepath) {

    if (fs.existsSync(filepath)) {
        fs.unlink(filepath, (err) => {
            if (err) {
                sendAToast('error', "Datei konnte nicht gelöscht werden! Fehler:" + err.message, 4000);
                return;
            }
            sendAToast('success', "Datei erfolgreich gelöscht!", 2000);
        });
    } else {
        sendAToast('warning', "Datei existiert nicht!", 1800);
    }

}



function saveFile(arg) {

    let electron = require('electron').remote
    let dialog = electron.dialog

    if (app.settings.savePath == "" || arg == "SAVEAS") {

        dialog.showSaveDialog({
            filters: [{
                name: 'Ahnentafel Dokument',
                extensions: ['atd']
            }]
        }, (filepath) => {

            if (filepath === undefined) {
                sendAToast("warning", "Datei nicht gespeichert!", 2000)
                return
            }

            if(filepath.endsWith('.atd') == false) filepath += '.atd'

            writeFile(filepath, JSON.stringify(app.doc))

        })

    } else {

        writeFile(app.settings.savePath, JSON.stringify(app.doc))
    }
}



function openFile() {

    if (canProceed()) {

        let electron = require('electron').remote
        let dialog = electron.dialog

        dialog.showOpenDialog({
            filters: [{
                name: 'Ahnentafel Dokument',
                extensions: ['atd']
            }]
        }, (file) => {

            if (file === undefined) {
                sendAToast("info", "Keine Datei ausgewählt!")
                return
            } else {
                //file is an array but we only need one string
                app.settings.justLoaded = true
                app.settings.savePath = file[0]
                app.settings.activeView = 'edit'
                app.doc = JSON.parse(fs.readFileSync(file[0], 'utf-8'))
            }

        });
    }
}

function openOnStart(filepath) {
    if (filepath != "." && filepath != "" && filepath !== undefined) {
        app.settings.justLoaded = true
        app.settings.activeView = 'edit'
        app.settings.savePath = filepath
        app.doc = JSON.parse(fs.readFileSync(filepath, 'utf-8'))
    }
}



function renameFile(sourcePath, tragetPath) {
    fs.renameSync(sourcePath, tragetPath)
}

function writeFile(path, content) {
    fs.writeFile(path, content, function (err) {
        if (err) throw err
        sendAToast("success", "Erfolgreich gespeichert!", 2000)
    })
}


function readFile(filepath) {
    return fs.readFileSync(filepath, 'utf-8')
}
