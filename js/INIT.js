let dir = fs.readdirSync(getTempName("temp/backup/",'folder'))
app = new Vue({
    el:'#app',
    data: {
        main: {},
        backup: dir,
        dogData: null,
        acDogData: null,
        settings: {
            activeView: 'start',
            activeTab: 0,
            popups: {
                settings: false,
            },
            tabLimit: 30,
            sessionKey: null,
            logged: false,
            hairtypes: [],
            devMode: true,
        },
        settingDefaults: [
            {option: 'theme', default: 'default_light'},
            {option: 'outputFolder', default: 'PDF'},
            {option: 'hairtypes', default: ''},
        ],
        themes: {},
        i:{
            settings:{
                license: '',
                theme: '',
                hairtypes: '',
            }
        }
    }
})

////////////////////////////////////////////////////////////////////////////////
// ATTENTION:
////////////////////////////////////////////////////////////////////////////////
// app.i.settings and vice versa are not in any kind related to app.settings
// app.i.settings are input settings to control the UI
// app.settings are settings for the API / loaded memory
//
// in app.i are only input-controllers!
////////////////////////////////////////////////////////////////////////////////




/////////////////////////////////////////////////
//               INITIALIZATION                //
/////////////////////////////////////////////////

checkForBackups()
loadThemeFromPath()
initSettings()
settingsToInput()
initLogin()
//openBackupUI();
changeTab()
tooltip({ style: { backgroundColor: '#292828', borderRadius: '4px' } })
unsavedProgress = false
savePath = ""
ipcRenderer.send('request-main', 'openedWithFile') //send a msg to main to let it know renderer has loaded