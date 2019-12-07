const _ = require('lodash')

app = new Vue({
    el:'#app',
    data: {
        animal_data: null,
        animal_data_autocomplete: null,
        doc: {},
        info: {
            versionName: 'Founders Update',
            version: require('electron').remote.app.getVersion(),
            apiVersion: '0.11.2',
            electronVersion: process.versions.electron,
            nodeVersion: process.versions.node,
        },
        MEMORY: {
            savePath: '',
            unsavedProgress: false,
            reset: false,
            justLoaded: false,
            activeView: 'START',
            activeSetting: 'GENERAL',
            activeTab: 0,
            UI: {
                autocomplete: false,
                settings: false,
                puppyList: false,
                showAnimal: false,
                addAnimal: false,
                editAnimal: false,
                deleteAnimal: false,
                inputUser: false,
                inputPass: false,
                releaseNote: false,
            },
            notifications: {
                count: 0,
                contents: []
            },
            tabLimit: 30,
            jwt: '',
            logged: false,
        },
        API: {
            auth: {url:'https://api.nttc.it/clients/drv/auth.php', param: ['user','pass']},
            read_animal_data_single: {url:'https://api.nttc.it/clients/drv/read/animal_data_single.php', param: ['id']},
            read_animal_data_array: {url:'https://api.nttc.it/clients/drv/read/animal_data_array.php', param: ['arr']},
            read_animal_data_multiple: {url:'https://api.nttc.it/clients/drv/read/animal_data_multiple.php', param: ['searchString']},
            read_animal_data_autocomplete: {url:'https://api.nttc.it/clients/drv/read/animal_data_autocomplete.php', param: ['searchString','searchGender']},
            create_animal_data_single: {url:'https://api.nttc.it/clients/drv/create/animal_data_single.php', param: []},
            update_animal_data_single: {url:'https://api.nttc.it/clients/drv/update/animal_data_single.php', param: []},
            delete_animal_data_single: {url:'https://api.nttc.it/clients/drv/delete/animal_data_single.php', param: ['id']},
        },
        _settings: {
            categories: {
                categoryName: 'icon',
            },
            options: {
                theme:          {icon: '', default: 'default_light'},
                outputFolder:   {icon: '', default: 'PDF'},
                dateFormat:     {icon: '', default: 'DMY'},
                dataDivider:    {icon: '', default: '.'},
                user:           {icon: '', default: ''},
                devMode:        {icon: '', default: false},
            }
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
        // i = input... like v-model inputs
        i:{
            delete_animal_data: '',
            search_animal_data: '',
            loaded_animal_data: {},
            ac_animal_data: {
                currentColumn: 1,
                currentRow: 1,
                currentGender: 'MALE',
                currentSearch: ''
            },
            create_animal_data: {},
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
        formatLNF: function(FN,LN,LNF) {
            return (LNF == true || LNF == 'YES') ? LN + ' ' + FN : FN + ' ' + LN
        },
        resetDocument: function(){
            this.doc = {
                name: '',
                date: '1970-01-01',
                race: '',
                LNF: false,
                address: '',
                hairtype: '',
                tree: [
                    [{id: null, name: null, desc: null},{id: null, name: null, desc: null}],
                    [{id: null, name: null, desc: null},{id: null, name: null, desc: null},{id: null, name: null, desc: null},{id: null, name: null, desc: null}],
                    [{id: null, name: null, desc: null},{id: null, name: null, desc: null},{id: null, name: null, desc: null},{id: null, name: null, desc: null},{id: null, name: null, desc: null},{id: null, name: null, desc: null},{id: null, name: null, desc: null},{id: null, name: null, desc: null}],
                    [{id: null, name: null, desc: null},{id: null, name: null, desc: null},{id: null, name: null, desc: null},{id: null, name: null, desc: null},{id: null, name: null, desc: null},{id: null, name: null, desc: null},{id: null, name: null, desc: null},{id: null, name: null, desc: null},{id: null, name: null, desc: null},{id: null, name: null, desc: null},{id: null, name: null, desc: null},{id: null, name: null, desc: null},{id: null, name: null, desc: null},{id: null, name: null, desc: null},{id: null, name: null, desc: null},{id: null, name: null, desc: null}],
                ],
                entries: []
            }

            this.MEMORY.unsavedProgress = false
            this.MEMORY.savePath = ''
            this.MEMORY.activeTab = 0
            this.MEMORY.reset = true
        },
        resetCreateAnimalData: function(){
            this.i.create_animal_data = {
                chipnumber: '',
                zbn: '',
                firstname: '',
                lastname: '',
                LNF: false,
                birthdate: '1970-01-01',
                gender: 'MALE',
                size: null,
                race: '',
                hairtype: '',
                haircolor: '',
                father: '',
                mother: '',
                fatherName: '',
                motherName: ''
            }
        },
        request: function(script,param,callback) {
            if(this.API.hasOwnProperty(script)){

                if(this.API[script].param.length <= param.length){

                    let params = {jwt: this.MEMORY.jwt}

                    for (let i = 0; i < param.length; i++) {
                        params[this.API[script].param[i]] = param[i]
                    }
    
                    $.post(this.API[script].url, params, function (data) {
            
                        if(data.response == 'OK'){
                            app.MEMORY.jwt = data.jwt
                            callback(data.data, null)
                        } else {
                            callback(null, data.response+'test')
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
        // This initializes the create animal data popup
        this.resetCreateAnimalData()
    },
    watch: {
        'i.search_animal_data': _.debounce( function(search){
            searchAnimalData(search)
        }, 500),
        doc: {
            handler(){
                if(this.MEMORY.reset){
                    this.MEMORY.reset = false
                    this.MEMORY.unsavedProgress = false
                } else if(this.MEMORY.justLoaded) {
                    this.MEMORY.justLoaded = false
                    this.MEMORY.unsavedProgress = false
                } else {
                    this.MEMORY.unsavedProgress = true
                }
            },
            deep: true
        }
    }
})



/////////////////////////////////////////////////
//               INITIALIZATION                //
/////////////////////////////////////////////////

// TODO: Fix .asar theme load error
loadThemeFromPath()
initSettings()
initLogin()
tooltip({ style: { backgroundColor: '#292828', borderRadius: '4px' } })

//send a msg to main to let it know renderer has loaded
ipcRenderer.send('loaded')



const remote = require('electron').remote

// When document has loaded, initialise
document.onreadystatechange = () => {
    if (document.readyState == "complete")
    {
        handleWindowControls()

        // Show release notes after update
        if(settings.get('currentVersion') != app.info.version)
        {
            app.MEMORY.UI.releaseNote = true
            settings.set('currentVersion', app.info.version)
        }

        setTimeout(() => {
            document.getElementById('preloader').classList.add('loaded')
        }, 400)
    }
}

function handleWindowControls() {

    let win = remote.getCurrentWindow()
    // Make minimise/maximise/restore/close buttons work when they are clicked
    document.getElementById('min-button').addEventListener("click", event => {
        win.minimize()
    })

    document.getElementById('max-button').addEventListener("click", event => {
        win.maximize()
    })

    document.getElementById('restore-button').addEventListener("click", event => {
        win.unmaximize()
    })

    document.getElementById('close-button').addEventListener("click", event => {
        win.close()
    })

    // Toggle maximise/restore buttons when maximisation/unmaximisation occurs
    if (win.isMaximized()) {
        document.body.classList.add('maximized')
    } else {
        document.body.classList.remove('maximized')
    }

    win.on('maximize', function() {
        if (win.isMaximized()) {
            document.body.classList.add('maximized')
        } else {
            document.body.classList.remove('maximized')
        }
    })
    win.on('unmaximize', function() {
        if (win.isMaximized()) {
            document.body.classList.add('maximized')
        } else {
            document.body.classList.remove('maximized')
        }
    })

}