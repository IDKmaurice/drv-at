function ipUserNext(event){

    event.preventDefault()

    let value = document.getElementById('user-ip-value').value
    settings.set('user',value)
    app.MEMORY.UI.inputUser = false
    app.MEMORY.UI.inputPass = true
}

function ipPassNext(event){

    event.preventDefault()

    let pass = document.getElementById('pass-ip-value').value
    let user = settings.get('user')
    app.MEMORY.UI.inputPass = false

    app.request('auth', [user, pass], (data, err) => {

        if (err) {
            app.MEMORY.jwt = ''
            app.MEMORY.logged = false
            sendAToast('warning', err)
            initLogin()
        } else {
            app.MEMORY.logged = true
            sendAToast('success', 'Erfolgreich eingeloggt!')
        }
    })
}

function initLogin(){

    if (settings.get('devMode')) {

        app.MEMORY.jwt = 'DEVMODE'
        app.MEMORY.logged = true
        sendAToast('success', '<b>DevMode:</b> Sie befinden sich im DevMode!<br>Sie können dies in den Einstellungen unter <i>Erweitert > devMode</i> ändern.', 8000)
    
    } else {

        if(settings.get('user') == "" || settings.has('user') !== true) {
            app.MEMORY.UI.inputUser = true
        } else {
            app.MEMORY.UI.inputPass = true
        }

        app.MEMORY.jwt = null
        app.MEMORY.logged = false
    }
}



function sendDataToPrint() {

    let DOC = JSON.parse(JSON.stringify(app.doc))
    let PARENT_ARRAY = []
    let PRINT_DATA = []
    let TREE_DATA = {}
    let FEMALE = 0
    let MALE = 0

    
    
    for (let i = 0; i < DOC.tree.length; i++) {
        for (let h = 0; h < DOC.tree[i].length; h++) {

            if(DOC.tree[i][h].id){ PARENT_ARRAY.push( DOC.tree[i][h].id )}

        }
    }


    app.request('read_animal_data_array',[JSON.stringify( PARENT_ARRAY )],(data,err)=>{

        data.forEach(item => {
            TREE_DATA[item.id] = item
        })

        for (let i = 0; i < DOC.tree.length; i++) {
            for (let h = 0; h < DOC.tree[i].length; h++) {

                if(DOC.tree[i][h].id){
                    
                    let desc = (DOC.tree[i][h].desc) ? DOC.tree[i][h].desc.replace(/\n/g, '<br>') : ''

                    desc = desc.replace(/\*\*\*/g, '</span><span class="blue">')
                    desc = desc.replace(/\*\*/g, '</span><span class="red">')
                    desc = desc.replace(/\*/g, '</span><span class="black">')

                    if(desc.startsWith('</span>')){ desc = desc.slice(7) }
                    if(desc.startsWith('<span') == false){ desc = '<span class="black">' + desc}
                    if(desc.endsWith('</span>') == false){ desc = desc + '</span>'}

                    DOC.tree[i][h] = JSON.parse(JSON.stringify(TREE_DATA[DOC.tree[i][h].id]))
                    DOC.tree[i][h].desc = desc
                    DOC.tree[i][h].birthdate_ = app.formatDate(DOC.tree[i][h].birthdate)

                } else {

                    // Defaulting
                    DOC.tree[i][h] = {
                        LNF: "YES",
                        birthdate: "1970-01-01",
                        birthdate_: app.formatDate("1970-01-01"),
                        chipnumber: "",
                        desc: "",
                        father: "",
                        firstname: "",
                        gender: "MALE",
                        haircolor: "",
                        id: "",
                        lastname: "",
                        membernumber: "",
                        mother: "",
                        race: "",
                        size: 0,
                        zbn:""
                    }
                }
            }
        }

        DOC.entries.forEach(entry => {
            
            if(entry.gender == 'MALE'){ MALE++ } else { FEMALE++ }
            
        })
        
        DOC.entries.forEach(entry => {

            let name_1 = (DOC.LNF) ? DOC.name        : entry.firstname
            let name_2 = (DOC.LNF) ? entry.firstname : DOC.name
            let gender = (entry.gender == 'MALE') ? 'Rüde' : 'Hündin'

            let address = (DOC.address) ? DOC.address.replace(/\n/g,'<br>') : ''
            let comment = (entry.comment) ? entry.comment.replace(/\n/g,'<br>') : ''

            PRINT_DATA.push({
                name_1: name_1,
                name_2: name_2,
                firstname: entry.firstname,
                lastname: DOC.name,
                race: DOC.race,
                male: MALE,
                female: FEMALE,
                gender: gender,
                haircolor: entry.haircolor,
                address: address,
                zbn: entry.zbn,
                chipnumber: entry.chip,
                comment: comment,
                selected: true,
                birthdate: app.formatDate(DOC.date),
                tree: DOC.tree,
            })
            
        })
        
        ipcRenderer.send('print-info', JSON.stringify(PRINT_DATA))
        
    })

}



// Get Animal_Data for DB
function searchAnimalData(search = '') {

    app.request('read_animal_data_multiple', [search], (data,err)=>{
        data.forEach(item => {
            item.LNF_ = (item.LNF == 'YES') ? 'ZWINGER - HUND' : 'HUND - ZWINGER'
            item.gender_ = (item.gender == 'MALE') ? 'RÜDE' : 'HÜNDIN'
            item.birthdate_ = app.formatDate(item.birthdate)
            item.fullname = app.formatLNF(item.firstname, item.lastname, item.LNF)
        })
        app.animal_data = data
        app.$forceUpdate()
        if(err) sendAToast('warning',err)
    })
}

// Get Autocomplete_Data for edit-view
function searchAnimalAC(gender = app.i.ac_animal_data.currentGender) {

    app.request('read_animal_data_autocomplete', [app.i.ac_animal_data.currentSearch, gender], (data,err)=>{
        data.forEach(item => {
            item.LNF_ = (item.LNF == 'YES') ? 'ZWINGER - HUND' : 'HUND - ZWINGER'
            item.gender_ = (item.gender == 'MALE') ? 'RÜDE' : 'HÜNDIN'
            item.fullname = app.formatLNF(item.firstname, item.lastname, item.LNF)
        })
        app.animal_data_autocomplete = data
        if(err) sendAToast('warning',err)
    })
}

function enterACAnimalData(dataObj, insertPath = 'tree'){
    
    if(insertPath == 'tree'){
        let column = app.i.ac_animal_data.currentColumn
        let row = app.i.ac_animal_data.currentRow
        
        enterAnimalDataRec(dataObj.id,column,row)
        closeAutocomplete()
    } else if (insertPath == 'addParent') {

        if(dataObj.gender == 'MALE'){
            app.i.create_animal_data.father = dataObj.id
            app.i.create_animal_data.fatherName = app.formatLNF(dataObj.firstname, dataObj.lastname, dataObj.LNF)
        } else {            
            app.i.create_animal_data.mother = dataObj.id
            app.i.create_animal_data.motherName = app.formatLNF(dataObj.firstname, dataObj.lastname, dataObj.LNF)
        }

        app.$forceUpdate()
        
    } else {
        sendAToast('warning','Konnte Eintrag nicht hinzufügen')
    }
}

function enterAnimalDataRec(id, column, row){

    
    if(column <= 4){
        if(id != null){
        
            app.request('read_animal_data_single', [id], (data,err)=>{
                
                if(err){sendAToast('warning',err)}
                else{
    
                    let mother = data.mother
                    let father = data.father
                    let fullname = app.formatLNF(data.firstname, data.lastname, data.LNF)
    
                    if(fullname != '' && data.id){
                        app.doc.tree[column-1][row-1].name = fullname
                        app.doc.tree[column-1][row-1].id = data.id
                    }
    
                    father = (father != undefined && father != "") ? father : null
                    enterAnimalDataRec(father, column+1, (row*2)-1)
    
                    mother = (mother != undefined && mother != "") ? mother : null
                    enterAnimalDataRec(mother, column+1, row*2)
    
                }
    
            })
            
        } else {
            app.doc.tree[column-1][row-1].name = null
            app.doc.tree[column-1][row-1].id = null
            enterAnimalDataRec(null, column+1, (row*2)-1)
            enterAnimalDataRec(null, column+1, row*2)
        }
    }
}



function canProceed(callback) {
    if(app.MEMORY.unsavedProgress == false){

        app.MEMORY.savePath = ''
        callback()

    } else {

        let electron = require('electron').remote
        let dialog = electron.dialog
        
        dialog.showMessageBox( electron.getCurrentWindow(),{
            type: 'warning',
            buttons: ['Speichern', 'Verwerfen', 'Abbrechen'],
            title: 'Ungespeicherter Fortschritt',
            message: 'Wollen Sie Ihren ungespeicherten Fortschritt speichern?'
        }).then((ret)=>{

            let choice = ret.response

            if(choice == 0)
            {
                file.save()
                app.MEMORY.savePath = ''
                app.MEMORY.unsavedProgress = false
                callback()
            }
            else if(choice == 1)
            {
                app.resetDocument()
                app.MEMORY.savePath = ''
                app.MEMORY.unsavedProgress = false
                callback()
            }
        })
        

    }
}