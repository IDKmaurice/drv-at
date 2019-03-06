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
            app.settings.logged ? ipcRenderer.send('print-info', JSON.stringify(app.doc)) : initLogin()
            break;
        case "openSettings":
            animPopup('settings','in');
            break;
        default:
            changeToStartView();
    }
});
