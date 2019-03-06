let dir = fs.readdirSync(getTempName("temp/backup/",'folder'))
app = new Vue({
    el:'#app',
    data: {
        main: {},
        backup: dir,
        dogData: null,
        acDogData: null,
        doc: {},
        settings: {
            savePath: '',
            unsavedProgress: false,
            reset: false,
            justLoaded: false,
            activeView: 'start',
            activeTab: 0,
            popups: {
                login: false,
                backups: false,
                settings: false,
                editOverview: false,
                addToDatabase: false,
            },
            tabLimit: 30,
            sessionKey: null,
            logged: false,
            hairtypes: [],
            devMode: false
        },
        settingDefaults: [
            {option: 'theme', default: 'default_light'},
            {option: 'outputFolder', default: 'PDF'},
            {option: 'hairtypes', default: ''},
            {option: 'dateFormat', default: 'DMY'},
            {option: 'dateDivider', default: '.'},
        ],
        themes: {},
        i:{
            settings:{
                license: '',
                theme: '',
                hairtypes: '',
                dateFormat: '',
                dateDivider: '',
            }
        }
    },
    methods: {
        formatDate: function(date){
            let splitDate = date.split('-')

            let year = splitDate[0]
            let month = splitDate[1]
            let day = splitDate[2]

            let div = settings.get('dateDivider')

            if(settings.get('dateFormat') == 'DMY') date = day+div+month+div+year
            if(settings.get('dateFormat') == 'MDY') date = month+div+day+div+year
            if(settings.get('dateFormat') == 'YMD') date = year+div+month+div+day

            return date
        },
        resetDocument: function(){
            this.doc = {
                name: '',
                date: '',
                race: '',
                hairtype: '',
                tree: [
                    [{chip: null, name: null},{chip: null, name: null}],
                    [{chip: null, name: null},{chip: null, name: null},{chip: null, name: null},{chip: null, name: null}],
                    [{chip: null, name: null},{chip: null, name: null},{chip: null, name: null},{chip: null, name: null},{chip: null, name: null},{chip: null, name: null},{chip: null, name: null},{chip: null, name: null}],
                    [{chip: null, name: null},{chip: null, name: null},{chip: null, name: null},{chip: null, name: null},{chip: null, name: null},{chip: null, name: null},{chip: null, name: null},{chip: null, name: null},{chip: null, name: null},{chip: null, name: null},{chip: null, name: null},{chip: null, name: null},{chip: null, name: null},{chip: null, name: null},{chip: null, name: null},{chip: null, name: null}],
                ],
                entries: []
            }

            this.settings.unsavedProgress = false
            this.settings.savePath = ''
            this.settings.activeTab = 0
            this.settings.reset = true
        }
    },
    created: function(){
        // This initializes the document
        this.resetDocument()
    },
    watch: {
        doc: {
            handler(){
                if(this.settings.reset){
                    this.settings.reset = false
                    this.settings.unsavedProgress = false
                } else if(this.settings.justLoaded) {
                    this.settings.justLoaded = false
                    this.settings.unsavedProgress = false
                } else {
                    this.settings.unsavedProgress = true
                }
            },
            deep: true
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
initLogin()
tooltip({ style: { backgroundColor: '#292828', borderRadius: '4px' } })
ipcRenderer.send('request-main', 'openedWithFile') //send a msg to main to let it know renderer has loaded