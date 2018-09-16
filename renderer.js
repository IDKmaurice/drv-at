//debug + DevTools

const {getCurrentWindow, globalShortcut} = require('electron').remote;

var reload = ()=>{
    getCurrentWindow().reload()
}

globalShortcut.register('F5', reload);
globalShortcut.register('CommandOrControl+R', reload);
// here is the fix bug #3778, if you know alternative ways, please write them
window.addEventListener('beforeunload', ()=>{
    globalShortcut.unregister('F5', reload);
    globalShortcut.unregister('CommandOrControl+R', reload);
})
