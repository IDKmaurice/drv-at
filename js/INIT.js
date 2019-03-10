let dir = fs.readdirSync(getTempName("temp/backup/",'folder'))
app = new Vue({
    el:'#app',
    data: {
        main: {},
        backup: dir,
        animal_data: null,
        animal_data_autocomplete: null,
        doc: {},
        settings: {
            savePath: '',
            unsavedProgress: false,
            reset: false,
            justLoaded: false,
            activeView: 'start',
            activeSetting: 'GENERAL',
            activeTab: 0,
            popups: {
                login: false,
                backups: false,
                settings: false,
                editOverview: false,
                addToDatabase: false,
            },
            tabLimit: 30,
            jwt: '',
            logged: false,
            hairtypes: []
        },
        API: {
            auth: {url:'https://api.nttc.it/clients/drv/auth.php', param: ['user','pass']},
            read_animal_data_single: {url:'https://api.nttc.it/clients/drv/read/animal_data_single.php', param: ['id']},
            read_animal_data_multiple: {url:'https://api.nttc.it/clients/drv/read/animal_data_multiple.php', param: ['searchString']},
            read_animal_data_autocomplete: {url:'https://api.nttc.it/clients/drv/read/animal_data_autocomplete.php', param: ['searchString','searchGender']},
            create_animal_data_single: {url:'https://api.nttc.it/clients/drv/create/animal_data_single.php', param: []},
            update_animal_data_single: {url:'https://api.nttc.it/clients/drv/update/animal_data_single.php', param: []},
            delete_animal_data_single: {url:'https://api.nttc.it/clients/drv/delete/animal_data_single.php', param: []},
        },
        settingDefaults: [
            {option: 'theme', default: 'default_light'},
            {option: 'outputFolder', default: 'PDF'},
            {option: 'hairtypes', default: ''},
            {option: 'dateFormat', default: 'DMY'},
            {option: 'dateDivider', default: '.'},
            {option: 'proxyType', default: 'NONE'},
            {option: 'proxyIP', default: ''},
            {option: 'proxyPort', default: ''},
            {option: 'proxyUser', default: ''},
            {option: 'proxyPass', default: ''},
            {option: 'user', default: ''},
            {option: 'devMode', default: false},
        ],
        themes: {},
        i:{
            ac_animal_data: {
                currentColumn: 1,
                currentRow: 1,
                currentGender: 'male',
                currentSearch: ''
            },
            create_animal_data: {

            },
            settings:{
                user: '',
                theme: '',
                devMode: false,
                hairtypes: '',
                dateFormat: '',
                dateDivider: '',
                proxyType: '',
                proxyIP: '',
                proxyPort: '',
                proxyUser: '',
                proxyPass: '',
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
                    [{id: null, name: null},{id: null, name: null}],
                    [{id: null, name: null},{id: null, name: null},{id: null, name: null},{id: null, name: null}],
                    [{id: null, name: null},{id: null, name: null},{id: null, name: null},{id: null, name: null},{id: null, name: null},{id: null, name: null},{id: null, name: null},{id: null, name: null}],
                    [{id: null, name: null},{id: null, name: null},{id: null, name: null},{id: null, name: null},{id: null, name: null},{id: null, name: null},{id: null, name: null},{id: null, name: null},{id: null, name: null},{id: null, name: null},{id: null, name: null},{id: null, name: null},{id: null, name: null},{id: null, name: null},{id: null, name: null},{id: null, name: null}],
                ],
                entries: []
            }

            this.settings.unsavedProgress = false
            this.settings.savePath = ''
            this.settings.activeTab = 0
            this.settings.reset = true
        },
        request: function(script,param,callback) {
            if(this.API.hasOwnProperty(script)){

                if(this.API[script].param.length <= param.length){

                    let params = {jwt: this.settings.jwt}

                    for (let i = 0; i < param.length; i++) {
                        params[this.API[script].param[i]] = param[i]
                    }
    
                    $.post(this.API[script].url, params, function (data) {
            
                        if(data.response == 'OK'){
                            app.settings.jwt = data.jwt
                            callback(data.data, null)
                        } else {
                            callback(null, data.response)
                        }
                
                    }, 'json')

                } else {
                    callback(null, 'parameters missing')
                }

            } else {
                callback(null, 'script missing')
            }
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