function ipUserNext(event){

    event.preventDefault()

    let value = $('#user-ip-value').val();
    settings.set('user',value);
    animInputPopup('user-ip-bg','out');
    animInputPopup('pass-ip-bg','in');
}




function ipPassNext(event){

    event.preventDefault()

    let pass = $('#pass-ip-value').val();
    let user = settings.get('user');
    animInputPopup('pass-ip-bg','out');

    app.request('auth', [user, pass], (data, err) => {

        if (err) {
            app.settings.jwt = ''
            app.settings.logged = false
            sendAToast('warning', err)
            initLogin()
        } else {
            app.settings.logged = true
            sendAToast('success', 'Erfolgreich eingeloggt!')
        }
    })
}



function initLogin(){

    if (settings.get('devMode')) {

        app.settings.jwt = 'DEVMODE'
        app.settings.logged = true
        sendAToast('success', '<b>DevMode:</b> Sie befinden sich im DevMode!<br>Sie können dies in den Einstellungen unter <i>Erweitert > devMode</i> ändern.', 8000)
    
    } else {

        if(settings.get('user') == "" || settings.has('user') !== true) {
            animInputPopup('user-ip-bg', 'in')
        } else {
            animInputPopup('pass-ip-bg', 'in')
        }

        app.settings.jwt = null
        app.settings.logged = false
    }
}




function sendDataToPrint() {
    let printData = {
        doc: app.doc
    }
    for (let i = 0; i < printData.doc.tree.length; i++) {
        for (let h = 0; h < printData.doc.tree[i].length; h++) {
            const id = printData.doc.tree[i][h].id;
            app.request('read_animal_data_single',[id],(data,err)=>{
                console.log(data);
                
            })
        }
    }
    ipcRenderer.send('print-info', JSON.stringify(printData))
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


// Pre-Setup for autocomplete
function openACpopup(column,row){

    let gender = (row%2 == 0) ? 'FEMALE' : 'MALE'

    $('.add-parent-holder').addClass('active')
    app.i.ac_animal_data.currentColumn = column
    app.i.ac_animal_data.currentRow = row
    app.i.ac_animal_data.currentGender = gender
    app.i.ac_animal_data.currentSearch = ''

}

function closeACpopup(){

    $('.add-parent-holder').removeClass('active')

}


function createAnimalData() {

    let formData = JSON.parse(JSON.stringify(app.i.create_animal_data))
    formData['jwt'] = app.settings.jwt

    formData.LNF = (formData.LNF == true) ? 'YES' : 'NO'
    
    
    $.post(app.API.create_animal_data_single.url, formData, function (data) {

        if(data.response == 'OK'){
            sendAToast('success','Erfolgreich hinzugefügt')
            animPopup('add-dog','out')
            app.settings.jwt = data.jwt
            searchAnimalData()
            app.$forceUpdate()
        } else {
            sendAToast('warning',data.response)
        }
        
    }, 'json')
}

function deleteAnimalData(id) {
    app.request('delete_animal_data_single', [id], (data, err) => {
        sendAToast('success','Eintrag erfolgreich gelöscht')
        searchAnimalData()
        app.$forceUpdate()
        if (err) sendAToast('warning', err)
    })
}

function enterACAnimalData(dataObj, insertPath = 'tree'){
    if(insertPath == 'tree'){
        let column = app.i.ac_animal_data.currentColumn
        let row = app.i.ac_animal_data.currentRow
        
        enterAnimalDataRec(dataObj.id,column,row)
        closeACpopup()
    } else if (insertPath == 'addParent') {

        if(dataObj.gender == 'MALE'){
            app.i.create_animal_data.father = dataObj.id
            app.i.create_animal_data.fatherName = app.formatLNF(dataObj.firstname, dataObj.lastname, dataObj.LNF)
        } else {            
            app.i.create_animal_data.mother = dataObj.id
            app.i.create_animal_data.motherName = app.formatLNF(dataObj.firstname, dataObj.lastname, dataObj.LNF)
        }
        
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