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
    let license = settings.get('license');
    animInputPopup('pass-ip-bg','out');

    if (app.settings.devMode) {

        app.settings.sessionKey = 'DEVMODE'
        app.settings.logged = true
        sendAToast('success', 'DevMode: Sie haben sich in den DevMode eingeloggt!<br>Das heißt es steht ihnen nur ein begrentzter Teil der Software zur Verfügung', 5000)

    } else {

        $.post("https://maurice-freuwoert.com/drvserverapi/login.php", { license: license, password: pass }, function (data) {

            let returnValues = JSON.parse(data);

            if (returnValues.success && app.settings.devMode == false) {

                app.settings.sessionKey = returnValues.key
                app.settings.logged = true
                sendAToast('success','Erfolgreich eingeloggt!')

            } else {

                app.settings.sessionKey = null
                app.settings.logged = false
                sendAToast('warning',returnValues.error)
                initLogin()

            }
        })
    }
}



function initLogin(){
    
    
    if(settings.get('license') == "" || settings.has('license') !== true) {
        animInputPopup('license-ip-bg', 'in')
    } else {
        animInputPopup('pass-ip-bg', 'in')
    }
    app.settings.sessionKey = null;
    app.settings.logged = false;
}




function searchDogData() {
    $.post("https://maurice-freuwoert.com/drvserverapi/readDB.php", { license: settings.get('license'), sessionKey: app.settings.sessionKey, filtervalue: $('#dog-data-search').val() }, function (data) {
            try {
                let returnValue = JSON.parse(data)
                if(returnValue.success){
                    app.dogData = returnValue.data;
                    app.$forceUpdate();
                } else {
                    sendAToast('warning',returnValue.error);
                }
            } catch (error) {
                console.warn(error);
            }
    });
}

function searchAutoComplete() {
    $.post("https://maurice-freuwoert.com/drvserverapi/ACreadDB.php", { license: settings.get('license'), sessionKey: app.settings.sessionKey, filtervalue: $('.ac-name-input').val(), filtergender: $('.ac-gender-input').val() }, function (data) {
            try {
                let returnValue = JSON.parse(data)
                if(returnValue.success){
                    app.acDogData = returnValue.data;
                } else {
                    sendAToast('warning',returnValue.error);
                }
            } catch (error) {
                console.warn(error);
            }
    });
}

function updateDogData(event) {

    
    event.preventDefault()
    let formData = $('#dog-data-editor').serializeArray()
    formData.push({name: 'license', value: settings.get('license')})
    formData.push({name: 'sessionKey', value: app.settings.sessionKey})
    
    
    $.post("https://maurice-freuwoert.com/drvserverapi/updateDB.php", formData, function (data) {
        try {
            let returnValue = JSON.parse(data)
            if(returnValue.success){
                sendAToast('success','Hund erfolgreich geändert')
            } else {
                sendAToast('warning',returnValue.error);
            }
            
            
            app.settings.sessionKey = returnValue.sessionKey;
            searchDogData();
            app.$forceUpdate();
        } catch (error) {
            console.warn(error);
        }
    });
}

function createDogData(event) {

    
    event.preventDefault()
    let formData = $('#dog-data-creator').serializeArray()
    formData.push({name: 'license', value: settings.get('license')})
    formData.push({name: 'sessionKey', value: app.settings.sessionKey})
    
    
    $.post("https://maurice-freuwoert.com/drvserverapi/createDB.php", formData, function (data) {
        try {
            let returnValue = JSON.parse(data)
            if(returnValue.success){
                sendAToast('success','Hund erfolgreich hinzugefügt')
                animPopup('add-dog','out')
            } else {
                sendAToast('warning',returnValue.error);
            }
            
            
            app.settings.sessionKey = returnValue.sessionKey;
            searchDogData();
            app.$forceUpdate();
        } catch (error) {
            console.warn(error);
        }
    });
}

function deleteDogData() {
    let chip = $('.db-hidden-chip').val()
    $.post("https://maurice-freuwoert.com/drvserverapi/deleteDB.php", {license: settings.get('license'), sessionKey: app.settings.sessionKey, chipnumber: chip}, function (data) {
        try {
            let returnValue = JSON.parse(data)
            if(returnValue.success){
                sendAToast('success','Hund erfolgreich gelöscht')
            } else {
                sendAToast('warning',returnValue.error);
            }
            
            
            app.settings.sessionKey = returnValue.sessionKey;
            searchDogData();
            app.$forceUpdate();
        } catch (error) {
            console.warn(error);
        }
    });
    $('#dog-data-editor').trigger('reset')
}

function editDogData(obj){

    //im not proud of this section :(

    $('.db-hidden-chip').val($(obj).children('.dbc-chip').html())
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


function openACpopup(column,row,gender){

    $('.ac-bg').addClass('active');
    $('.ac-gen-column-input').val(column)
    $('.ac-gen-row-input').val(row)
    $('.ac-gender-input').val(gender)
    $('.ac-name-input').val('')

}

function closeACpopup(){

    $('.ac-bg').removeClass('active');
    $('.ac-gen-column-input').val(1)
    $('.ac-gen-row-input').val(1)
    $('.ac-gender-input').val('female')
    $('.ac-name-input').val('')

}

function enterSearchedDogData(obj){
    let chip = $(obj).attr('chip')
    let column = parseInt($('.ac-gen-column-input').val())
    let row = parseInt($('.ac-gen-row-input').val())

    function enterDogDataRec(chip, column, row){
        
        if(column <= 4){

            $.post("https://maurice-freuwoert.com/drvserverapi/readDBsingle.php", { license: settings.get('license'), sessionKey: app.settings.sessionKey, chipnumber: chip }, function (data) {
                try {
                    let returnValue = JSON.parse(data)
                    if (returnValue.success) {

                        let mother = returnValue.data.mother;
                        let father = returnValue.data.father;

                        if(returnValue.data.firstname != '' && returnValue.data.chipnumber != ''){
                            $(`.gen-${column}-${row}`).children('.gen-name').val(returnValue.data.firstname)
                            $(`.gen-${column}-${row}`).children('.gen-chip').val(returnValue.data.chipnumber)
                        }
                        //console.log(returnValue.data.firstname + ' ' + column + ' ' + row)

                        if (father != undefined && father != "") {
                            enterDogDataRec(father, column+1, (row*2)-1)
                        } else {
                            enterDogDataRec('', column+1, (row*2)-1)
                        }

                        if (mother != undefined && mother != "") {
                            enterDogDataRec(mother, column+1, row*2)
                        } else {
                            enterDogDataRec('', column+1, row*2)
                        }


                    } else {
                        console.warn(returnValue.error);
                    }

                } catch (error) {
                    console.warn(error);
                }
            });
        }

    }
    
    enterDogDataRec(chip,column,row)
    closeACpopup()

}