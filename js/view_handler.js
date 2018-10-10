function setViewVisibility() {
    $('.view').each(function(){
        if($(this).data('active') === true){
            $(this).css('display','grid')
        } else {
            $(this).css('display','none')
        }
    })
}

function changeView(view) {
    $('.view').data('active',false);
    $('.view[data-view-page="'+view+'"]').data('active',true);
    setViewVisibility();
}

function changeToEditView() {
    if(dismissProgress()){
        changeView("edit");
        clearInputs();
        db.delete("/");
        db.push("/",{'puppy':[]});
        updateVueArr();
    }
}

function changeToStartView() {
    if(dismissProgress()){
        changeView("start");
        clearInputs();
    }
}

function changeToDatabaseView() {
    if(dismissProgress()){
        changeView("database");
        clearInputs();
        $.post("https://maurice-freuwoert.com/drvserverapi/readDB.php", { license: settings.get('license'), sessionKey: app.settings.sessionKey, filtervalue: '' }, function (data) {
            try {
                let returnValue = JSON.parse(data)
                if(returnValue.success){
                    app.dogData = returnValue.data;
                } else {
                    console.warn(returnValue.error);
                }
                
            } catch (error) {
                console.warn(error);
            }
        });
    }
}



function dismissProgress() {
    if(unsavedProgress == false){
        return true;
        savePath = "";
    }else{
        var app = require('electron').remote;
        var dialog = app.dialog;
        var choice = dialog.showMessageBox(
                app.getCurrentWindow(),
                {
                    type: 'warning',
                    buttons: ['Speichern', 'Verwerfen', 'Abbrechen'],
                    title: 'Ungespeicherter Fortschritt',
                    message: 'Wollen Sie Ihren ungespeicherten Fortschritt speichern?'
                });

        if(choice == 0){
            saveFile();
            savePath = "";
            unsavedProgress = false;
            return true;
        }else if(choice == 1){
            savePath = "";
            unsavedProgress = false;
            return true;
        }else{
            return false;
        }
    }
}