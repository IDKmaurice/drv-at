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

        $.post(app.API.read_animal_data_multiple.url, { jwt: app.settings.jwt, searchString: '' }, function (data) {
            if(data.response == 'OK'){
                app.dogData = data.data
                console.log(data.data)    
                app.settings.jwt = data.jwt
            } else {
                sendAToast('warning',data.response)
            }
        }, 'json')
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