function resetSettings(){
    for (const option in app.i.settings) {
        app.i.settings[option] = ''
    }
    settings.deleteAll()
    initSettings()
}



function initSettings(){

    for (let i = 0; i < app.settingDefaults.length; i++) {
        if(settings.has(app.settingDefaults[i].option) == false){
            settings.set(app.settingDefaults[i].option, app.settingDefaults[i].default)
        }
    }

    for (const option in app.i.settings) {
        if(settings.has(option)){
            app.i.settings[option] = settings.get(option)
        }
    }
    
    setTheme(settings.get('theme'))
    app.settings.hairtypes = settings.get('hairtypes').split(',')
}

function applySettings(){
    for (const option in app.i.settings) {
        settings.set(option, app.i.settings[option])
    }
}

settings.watch('hairtypes', (val) => {
    app.settings.hairtypes = val.split(',')
});