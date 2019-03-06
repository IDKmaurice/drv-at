function openBackup(filepath){
    if (canProceed()) {
        app.settings.savePath = ''
        app.settings.unsavedProgress = true
        convertToTempFile(getTempName('temp/backup/','folder')+filepath)
        animateBackupOut()
    }
}

function deleteBackup(obj){

    if (obj == null || obj == ''){
        var dir = fs.readdirSync(getTempName('temp/backup/','folder'));

        for (var i = 0; i < dir.length; i++) {
            deleteFile(getTempName('temp/backup/','folder')+dir[i]);
            console.log(getTempName('temp/backup/','folder')+dir[i]);
        }

        animateBackupOut();
    } else {

    }
}
