function ipLicenseNext(event){

    event.preventDefault()

    let value = $('#license-ip-value').val();
    settings.set('license',value);
    animInputPopup('license-ip-bg','out');
    animInputPopup('pass-ip-bg','in');
}




function ipPassNext(event){

    event.preventDefault()

    let pass = $('#pass-ip-value').val();
    let user = settings.get('user');
    animInputPopup('pass-ip-bg','out');

    $.post(app.API.auth.url, { user: user, pass: pass }, function (data) {

        if (data.response == 'OK') {

            app.settings.jwt = data.jwt
            app.settings.logged = true
            sendAToast('success','Erfolgreich eingeloggt!')

        } else {

            app.settings.jwt = null
            app.settings.logged = false
            // TODO: the response is just an error-code it need another api to be interpreted
            sendAToast('warning',data.response)
            initLogin()

        }

    }, 'json')
}



function initLogin(){

    if (settings.get('devMode')) {

        app.settings.jwt = 'DEVMODE'
        app.settings.logged = true
        sendAToast('success', '<b>DevMode:</b> Sie befinden sich im DevMode!<br>Sie können dies in den Einstellungen unter <i>Allgemein > devMode</i> ändern', 5000)
    
    } else {

        if(settings.get('license') == "" || settings.has('license') !== true) {
            animInputPopup('license-ip-bg', 'in')
        } else {
            animInputPopup('pass-ip-bg', 'in')
        }

        app.settings.jwt = null
        app.settings.logged = false
    }
}




function searchDogData() {
    app.request('read_animal_data_multiple', [$('#dog-data-search').val()], (data,err)=>{
        app.animal_data = data
        app.$forceUpdate()
        if(err) sendAToast('warning',err)
    })
}

function searchAutoComplete() {
    app.request('read_animal_data_autocomplete', [app.i.ac_animal_data.currentSearch, app.i.ac_animal_data.currentGender], (data,err)=>{
        app.animal_data_autocomplete = data
        if(err) sendAToast('warning',err)
    })
}


function openACpopup(column,row){

    let gender = (row%2 == 0) ? 'female' : 'male'

    $('.add-parent-holder').addClass('active')
    app.i.ac_animal_data.currentColumn = column
    app.i.ac_animal_data.currentRow = row
    app.i.ac_animal_data.currentGender = gender
    app.i.ac_animal_data.currentSearch = ''

}

function closeACpopup(){

    $('.add-parent-holder').removeClass('active')

}


function updateDogData(event) {

    
    event.preventDefault()
    let formData = $('#dog-data-editor').serializeArray()
    formData.push({name: 'jwt', value: app.settings.jwt})
    
    
    $.post("https://maurice-freuwoert.com/drvserverapi/updateDB.php", formData, function (data) {

        if(data.response == 'OK'){
            sendAToast('success','Hund erfolgreich geändert')
            app.settings.jwt = data.jwt
            searchDogData()
            app.$forceUpdate()
        } else {
            sendAToast('warning',data.response)
        }
        
    }, 'json')
}

function createDogData(event) {

    
    event.preventDefault()
    let formData = $('#dog-data-creator').serializeArray()
    formData.push({name: 'jwt', value: app.settings.jwt})
    
    
    $.post(app.API.create_animal_data_single.url, formData, function (data) {

        if(data.response == 'OK'){
            sendAToast('success','Erfolgreich hinzugefügt')
            animPopup('add-dog','out')
            app.settings.jwt = data.jwt
            searchDogData()
            app.$forceUpdate()
        } else {
            sendAToast('warning',data.response)
        }
        
    }, 'json')
}

function deleteDogData() {
    let id = $('.db-hidden-id').val()

    $.post("https://maurice-freuwoert.com/drvserverapi/deleteDB.php", {jwt: app.settings.jwt, id: id}, function (data) {
        
        if(data.response == 'OK'){
            sendAToast('success','Hund erfolgreich gelöscht')
            app.settings.jwt = data.jwt
            searchDogData()
            app.$forceUpdate()
        } else {
            sendAToast('warning',data.response)
        }
        
    })

    $('#dog-data-editor').trigger('reset')
}

function editDogData(obj){

    //im not proud of this section :(

    $('.db-hidden-id').val($(obj).children('.dbc-id').html())
    $('.db-edit-chip').val($(obj).children('.dbc-chip').html())
    $('.db-edit-zbn').val($(obj).children('.dbc-zbn').html())
    $('.db-edit-firstname').val($(obj).children('.dbc-firstname').html())
    $('.db-edit-lastname').val($(obj).children('.dbc-lastname').html())
    $('.db-edit-birthdate').val($(obj).children('.dbc-birthdate').html())
    $('.db-edit-gender').val($(obj).children('.dbc-gender').html())
    $('.db-edit-race').val($(obj).children('.dbc-race').html())
    $('.db-edit-hairtype').val($(obj).children('.dbc-hairtype').html())
    $('.db-edit-haircolor').val($(obj).children('.dbc-haircolor').html())
    $('.db-edit-mother').val($(obj).children('.dbc-mother').html())
    $('.db-edit-father').val($(obj).children('.dbc-father').html())
    $('.db-edit-breeder').val($(obj).children('.dbc-breeder').html())
    $('.db-edit-membernumber').val($(obj).children('.dbc-membernumber').html())
}

function enterSearchedDogData(i){
    let id = app.animal_data_autocomplete[i].id
    let column = app.i.ac_animal_data.currentColumn
    let row = app.i.ac_animal_data.currentRow
    
    enterDogDataRec(id,column,row)
    closeACpopup()
}

function enterDogDataRec(id, column, row){

    
    if(column <= 4){
        if(id != null){
        
            app.request('read_animal_data_single', [id], (data,err)=>{
                
                if(err){sendAToast('warning',err)}
                else{
    
                    let mother = data.mother
                    let father = data.father
    
                    if(data.firstname != '' && data.id != ''){
                        app.doc.tree[column-1][row-1].name = data.firstname
                        app.doc.tree[column-1][row-1].id = data.id
                    }
    
                    father = (father != undefined && father != "") ? father : null
                    enterDogDataRec(father, column+1, (row*2)-1)
    
                    mother = (mother != undefined && mother != "") ? mother : null
                    enterDogDataRec(mother, column+1, row*2)
    
                }
    
            })
            
        } else {
            app.doc.tree[column-1][row-1].name = null
            app.doc.tree[column-1][row-1].id = null
            enterDogDataRec(null, column+1, (row*2)-1)
            enterDogDataRec(null, column+1, row*2)
        }
    }
}