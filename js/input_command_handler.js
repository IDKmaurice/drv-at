require('electron').ipcRenderer.on('msgFromMain', function(event, message) {
    switch (message[0]) {
        case "save":
            saveFile();
            console.log('save')
            break;
        case "saveas":
            saveFile('saveas');
            console.log('save as')
            break;
        case "new":
            changeToEditView();
            console.log('new')
            break;
        case "home":
            changeToStartView();
            console.log('home')
            break;
        case "startupOpen":
            openOnStart(message[1]);
            console.log('open on startup')
            break;
        case "open":
            openFile();
            console.log('open')
            break;
        case "print":
            ipcRenderer.send('print-info', JSON.stringify(db.getData('/')))
            console.log('print')
            break;
        default:
            changeToStartView();
            console.log('default')
    }
});
