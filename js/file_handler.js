function getTempName(dir,arg) {
    let date = new Date().getTime();
    const {app} = require('electron').remote;
    //console.log(app.getPath('userData'));
    // TODO: save data in appdata instead of in src files
    if(arg == "date"){

        return __dirname+"/"+dir+"temp-"+date+".json";

    } else if (arg == "db") {
        return __dirname+"/"+dir+"temp-current";
    } else if (arg == "folder") {
        return __dirname+"/"+dir;
    }  else {

        return __dirname+"/"+dir+"temp-current.json";
    }
}



function checkForBackups() {
    var filepath = getTempName("temp/");
    if(fs.existsSync(filepath)){
        renameFile(filepath, getTempName('temp/backup/'));
    }
    JsonDB = require('node-json-db');
    // TODO: set second parameter to true when exporting product
    db = new JsonDB(getTempName('temp/','db'), true, true);

    //init for vue for loop (adds one empty puppy to have at least one to edit)
    db.push("/",{'puppy':[]});
    updateVueArr();
}



function convertToTempFile(filepath) {

    db.delete("/");
    db.push("/",JSON.parse(readFile(filepath)));
    updateVueArr();

}



function deleteFile(filepath){

    if (fs.existsSync(filepath)) {
        fs.unlink(filepath, (err) => {
            if (err) {
                sendAToast('error',"Datei konnte nicht gelöscht werden! Fehler:" + err.message,2000);
                return;
            }
            sendAToast('success',"Datei erfolgreich gelöscht!",2000);
        });
    } else {
        sendAToast('warning',"Datei existiert nicht!",1800);
    }

}



function saveFile(arg){

    var app = require('electron').remote;
    var dialog = app.dialog;
    var filepathOLD = getTempName("temp/");

    if(savePath == "" || arg == "saveas"){

        dialog.showSaveDialog({filters:[{name: 'Ahnentafel Dokument', extensions: ['atd']}]},(filepathNEW) => {

            if (filepathNEW === undefined){
                sendAToast("warning","Datei nicht gespeichert!",2000);
                return;
            }

            if(filepathNEW.includes('.') == false){
                filepathNEW += '.atd';
            }

            copyFile(filepathOLD,filepathNEW,function(err){
                if (err){
                    console.error(err);
                    unsavedProgress = true;
                } else {
                    savePath = filepathNEW;
                    sendAToast("success","Erfolgreich gespeichert!",2000);
                    unsavedProgress = false;
                }
            });

        });
    } else {

        console.info(filepathOLD+" : "+savePath)

        copyFile(filepathOLD,savePath,function(err){
            if (err){
                console.error(err);
                unsavedProgress = true;
            } else {
                sendAToast("success","Erfolgreich gespeichert!",2000);
                unsavedProgress = false;
            }
        });
    }
}



function openFile(){

    if(dismissProgress()){

        var app = require('electron').remote;
        var dialog = app.dialog;

        dialog.showOpenDialog({filters:[{name: 'Ahnentafel Dokument', extensions: ['atd']}]},(file) => {

            if (file === undefined){
                sendAToast("warning","Keine Datei ausgewählt!",2000);
                return;
            } else {
                //file is an array but we only need one string
                console.log("Opening : "+file[0]);
                savePath = file[0];
                convertToTempFile(file[0]);
                writeToInput();
            }

        });
    }
}

function openOnStart(filepath) {
    if(filepath != "." && filepath != "" && filepath !== undefined){
        savePath = filepath;
        convertToTempFile(filepath);
        writeToInput();
    }
}



function renameFile(oldFilepath, newFilepath){
    fs.renameSync(oldFilepath, newFilepath);
}



function readFile(filepath){

    return fs.readFileSync(filepath, 'utf-8');

}




function copyFile(source, target, cb) {
    var cbCalled = false;

    var rd = fs.createReadStream(source);
    rd.on("error", function(err) {
        done(err);
    });
    var wr = fs.createWriteStream(target);
    wr.on("error", function(err) {
        done(err);
    });
    wr.on("close", function(ex) {
        done();
    });
    rd.pipe(wr);

    function done(err) {
        if (!cbCalled) {
            cb(err);
            cbCalled = true;
        }
    }
}
