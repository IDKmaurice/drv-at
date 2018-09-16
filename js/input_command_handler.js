const {ipcRenderer} = require('electron');

require('electron').ipcRenderer.on('ping', function(event, message) {
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
        default:
            changeToStartView();
            console.log('default')
    }
});
