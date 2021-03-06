window.createFileIfSignedIn = ()=>{
    if(app.MEMORY.logged){
        canProceed(()=>{
            app.MEMORY.activeView = 'EDIT'
            app.resetDocument()
        })
    }else{
        initLogin()
    }
}

window.openFileIfSignedIn = ()=>{
    if(app.MEMORY.logged){
        canProceed(()=>{
            file.open(()=>{
                app.MEMORY.activeView = 'EDIT'
            })
        })
    }else{
        initLogin()
    }
}

window.databaseIfSignedIn = ()=>{
    if(app.MEMORY.logged){
        canProceed(()=>{
            app.MEMORY.activeView = 'DATABASE'
            app.resetDocument()

            searchAnimalData('')
        })
    }else{
        initLogin()
    }
}

window.layoutIfSignedIn = ()=>{
    if(app.MEMORY.logged){
        canProceed(()=>{
            app.MEMORY.activeView = 'LAYOUT'
            app.resetDocument()
        })
    }else{
        initLogin()
    }
}

window.homescreenIfSignedIn = ()=>{
    if(app.MEMORY.logged){
        canProceed(()=>{
            app.MEMORY.activeView = 'START'
            app.resetDocument()
        })
    }else{
        initLogin()
    }
}



window.openSettings = ()=>{
    app.MEMORY.UI.settings = true
}

window.closeSettings = ()=>{
    app.MEMORY.UI.settings = false
}



window.openPuppyList = ()=>{
    app.MEMORY.UI.puppyList = true
}

window.closePuppyList = ()=>{
    app.MEMORY.UI.puppyList = false
}



window.openAutocomplete = (column, row)=>{

    let gender = (row % 2 == 0) ? 'FEMALE' : 'MALE'

    app.i.ac_animal_data.currentColumn = column
    app.i.ac_animal_data.currentRow = row
    app.i.ac_animal_data.currentGender = gender
    app.i.ac_animal_data.currentSearch = ''
    app.MEMORY.UI.autocomplete = true
}

window.closeAutocomplete = ()=>{
    app.MEMORY.UI.autocomplete = false
}



window.openAnimalInfo = (i = null)=>{
    if(i != null) app.i.loaded_animal_data = app.animal_data[i]
    app.MEMORY.UI.showAnimal = true
}

window.closeAnimalInfo = ()=>{
    app.MEMORY.UI.showAnimal = false
}



window.openCreateAnimal = ()=>{
    app.MEMORY.UI.addAnimal = true
}

window.closeCreateAnimal = ()=>{
    app.MEMORY.UI.addAnimal = false
}

window.createAnimal = ()=>{
    let formData = JSON.parse(JSON.stringify(app.i.create_animal_data))
    formData['jwt'] = app.MEMORY.jwt

    formData.LNF = (formData.LNF == true) ? 'YES' : 'NO'
    
    
    $.post(app.API.create_animal_data_single.url, formData, function (data) {

        if(data.response == 'OK'){
            app.MEMORY.jwt = data.jwt
            app.resetCreateAnimalData()
            app.$forceUpdate()
            closeCreateAnimal()
            searchAnimalData()
            sendAToast('success','Erfolgreich hinzugefügt')
        } else {
            sendAToast('warning',data.response)
        }
        
    }, 'json')
}



window.openEditAnimal = (i = null)=>{

    let animal = app.animal_data[i]
    app.i.create_animal_data = animal
    app.i.create_animal_data.LNF = (app.i.create_animal_data.LNF == 'YES') ? true : false
    
    app.request('read_animal_data_array',[JSON.stringify( [animal.father, animal.mother] )],(data,err)=>{

        let DATA = {}

        data.forEach(item => { DATA[item.id] = item })
        
        if(DATA[animal.father]) app.i.create_animal_data.fatherName = DATA[animal.father].firstname
        if(DATA[animal.mother]) app.i.create_animal_data.motherName = DATA[animal.mother].firstname

        app.$forceUpdate()
        app.MEMORY.UI.editAnimal = true
    })
}

window.closeEditAnimal = ()=>{
    app.MEMORY.UI.editAnimal = false
}

window.editAnimal = ()=>{

    let formData = JSON.parse(JSON.stringify(app.i.create_animal_data))
    formData['jwt'] = app.MEMORY.jwt

    formData.LNF = (formData.LNF == true) ? 'YES' : 'NO'
    
    $.post(app.API.update_animal_data_single.url, formData, function (data) {

        if(data.response == 'OK'){
            sendAToast('success','Erfolgreich bearbeitet')
            app.MEMORY.UI.editAnimal = false
            app.MEMORY.jwt = data.jwt
            searchAnimalData()
            app.resetCreateAnimalData()
            app.$forceUpdate()
        } else {
            sendAToast('warning',data.response)
        }
        
    }, 'json')
}



window.openSelectAndDeleteAnimal = (id, confirmation)=>{
    if(confirmation){
        deleteAnimal(app.i.delete_animal_data)
        app.MEMORY.UI.deleteAnimal = false
    } else if(id){
        app.i.delete_animal_data = id
        app.MEMORY.UI.deleteAnimal = true
    }
}

window.closeDeleteAnimal = ()=>{
    app.MEMORY.UI.deleteAnimal = false
}

window.deleteAnimal = (i = null)=>{
    app.request('delete_animal_data_single', [app.animal_data[i].id], (data, err) => {
        sendAToast('success','Eintrag erfolgreich gelöscht')
        searchAnimalData()
        app.$forceUpdate()
        if (err) sendAToast('warning', err)
    })
}



require('electron').ipcRenderer.on('msgFromMain', function(event, args) {

    const commandsFromMain = {
        save:           (args)=>{ app.MEMORY.logged ? file.save() : initLogin() },
        saveas:         (args)=>{ app.MEMORY.logged ? file.save('SAVEAS') : initLogin() },
        new:            (args)=>{ createFileIfSignedIn() },
        home:           (args)=>{ homescreenIfSignedIn() },
        startupOpen:    (args)=>{ file.openOnStart(args[1]) },
        open:           (args)=>{ openFileIfSignedIn() },
        print:          (args)=>{ sendDataToPrint() },
        openSettings:   (args)=>{ openSettings() },

        update_checking:        (args)=>{ sendAToast('info','Suche nach Updates...', 4000) },
        update_available:       (args)=>{ sendAToast('info','Update gefunden: <b>Gencestor '+ JSON.parse(args[1]).version +'</b>', 3000) },
        update_not_available:   (args)=>{ sendAToast('info','Sie sind auf dem neusten Stand!') },
        update_downloaded:      (args)=>{ sendAToast('info','<b>Update wurde heruntergeladen!</b><br>Sie können das Programm jederzeit neustarten, um das Update zu installieren.', 8000) },
        update_error:           (args)=>{ sendAToast('error','Update Fehler:<br>' + args[1]) },
    }

    if( commandsFromMain.hasOwnProperty(args[0]) ){
        commandsFromMain[args[0]](args)
    }
    
})