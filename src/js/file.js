module.exports = {
    save: (method)=>{
        let electron = require('electron').remote
        let dialog = electron.dialog

        if (app.MEMORY.savePath == "" || method == "SAVEAS") {

            dialog.showSaveDialog({
                filters: [{
                    name: 'Ahnentafel Dokument',
                    extensions: ['atd']
                }]
            }, (filepath) => {

                if (filepath === undefined) {
                    sendAToast("info", "Datei nicht gespeichert!")
                    return
                }

                if(filepath.endsWith('.atd') == false) filepath += '.atd'

                app.MEMORY.savePath = filepath

                fs.writeFile(filepath, JSON.stringify(app.doc), function (err) {
                    err ? sendAToast("success", "Fehler: "+err) : sendAToast("success", "Erfolgreich gespeichert!")
                })

            })

        } else {

            fs.writeFile(app.MEMORY.savePath, JSON.stringify(app.doc), function (err) {
                err ? sendAToast("success", "Fehler: "+err) : sendAToast("success", "Erfolgreich gespeichert!")
            })
        }
    },

    open: (callback)=>{
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
            } else {
                //file is an array but we only need one string
                app.MEMORY.justLoaded = true
                app.MEMORY.savePath = file[0]
                app.doc = JSON.parse(fs.readFileSync(file[0], 'utf-8'))

                callback()
            }

        })
    },

    openOnStart: (path)=>{
        if (path != "." && path != "" && path !== undefined) {
            app.MEMORY.justLoaded = true
            app.MEMORY.activeView = 'EDIT'
            app.MEMORY.savePath = path
            app.doc = JSON.parse(fs.readFileSync(path, 'utf-8'))
        }
    },
}