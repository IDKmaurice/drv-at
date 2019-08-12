require('electron').ipcRenderer.on('msgFromMain', function(event, message) {
    switch (message[0]) {
        case "save":
            app.settings.logged ? saveFile() : initLogin();
            break;
        case "saveas":
            app.settings.logged ? saveFile('SAVEAS') : initLogin();
            break;
        case "new":
            app.settings.logged ? changeToEditView() : initLogin();
            break;
        case "home":
            changeToStartView();
            break;
        case "startupOpen":
            openOnStart(message[1]);
            break;
        case "open":
            app.settings.logged ? openFile() : initLogin();
            break;
        case "print":
            sendDataToPrint()
            break;
        case "openSettings":
            animPopup('settings','in')
            break;

        case "update_checking":
            sendAToast('info','Suche nach Updates...', 4000)
            break;
        case "update_available":
            sendAToast('info','Update gefunden: <b>Gencestor '+JSON.parse(message[1]).version+'</b>', 3000)
            break;
        case "update_not_available":
            sendAToast('info','Sie sind auf dem neusten Stand!')
            break;
        case "update_downloaded":
            sendAToast('info','<b>Update wurde heruntergeladen!</b><br>Sie können das Programm jederzeit neustarten, um das Update zu installieren.', 8000)
            break;
        case "update_error":
            sendAToast('error','Update Fehler:<br>'+message[1])
            break;
        default:
            changeToStartView()
    }
});
