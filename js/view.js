function changeToEditView() {
    if(canProceed()){
        app.settings.activeView = 'edit'
        app.resetDocument()
    }
}

function changeToStartView() {
    if(canProceed()){
        app.settings.activeView = 'start'
        app.resetDocument()
    }
}

function changeToDatabaseView() {
    if(canProceed()){
        app.settings.activeView = 'database'
        app.resetDocument()

        $.post("https://maurice-freuwoert.com/drvserverapi/readDB.php", { license: settings.get('license'), sessionKey: app.settings.sessionKey, filtervalue: '' }, function (data) {
            try {
                let returnValue = JSON.parse(data)
                if(returnValue.success){
                    app.dogData = returnValue.data
                } else {
                    console.warn(returnValue.error)
                }
                
            } catch (error) {
                console.warn(error)
            }
        });
    }
}



function canProceed() {
    if(app.settings.unsavedProgress == false){

        app.settings.savePath = ''
        return true

    } else {

        let electron = require('electron').remote
        let dialog = electron.dialog
        let choice = dialog.showMessageBox(
            electron.getCurrentWindow(),{
                type: 'warning',
                buttons: ['Speichern', 'Verwerfen', 'Abbrechen'],
                title: 'Ungespeicherter Fortschritt',
                message: 'Wollen Sie Ihren ungespeicherten Fortschritt speichern?'
            })

        if(choice == 0){

            saveFile()
            app.settings.savePath = ''
            app.settings.unsavedProgress = false
            return true

        } else if(choice == 1) {

            app.resetDocument()
            app.settings.savePath = ''
            app.settings.unsavedProgress = false
            return true

        } else {
            return false
        }
    }
}