function openBackup(filepath){
    if (dismissProgress()) {
        savePath = '';
        convertToTempFile(getTempName('temp/backup/','folder')+filepath);
        writeToInput();
        animateBackupOut();
        unsavedProgress = true;
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
