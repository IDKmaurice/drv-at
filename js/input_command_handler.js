require('electron').ipcRenderer.on('msgFromMain', function(event, message) {
    switch (message[0]) {
        case "save":
            saveFile();
            break;
        case "saveas":
            saveFile('saveas');
            break;
        case "new":
            changeToEditView();
            break;
        case "home":
            changeToStartView();
            break;
        case "startupOpen":
            openOnStart(message[1]);
            break;
        case "open":
            openFile();
            break;
        case "print":
            ipcRenderer.send('print-info', JSON.stringify(db.getData('/')))
            break;
        case "openSettings":
            animPopup('settings','in');
            break;
        default:
            changeToStartView();
    }
});
