function selectTab(tabID = 0) {
    app.settings.activeTab = tabID
}




function openPuppyList() {
    animPopup('pl','in');
    app.$forceUpdate();
}

function openBackupUI() {
    animPopup('bu','in');
    app.$forceUpdate();
}



function changeTab(changeToTab = 0){
    app.settings.activeTab = changeToTab
}

function addTabs() {
    let i = db.getData("/puppy").length

    //check for puppy limit
    if(i < app.settings.tabLimit){
        db.push("/puppy[]",{})
        writeToInput()

        //select the newly created tab
        Vue.nextTick(function () {
            selectTab(db.getData("/puppy").length)
        })
    } else {
        sendAToast('warning',`Welpen Limit pro Wurf erreicht! (max. ${app.settings.tabLimit})`,2000)
    }
}

function removeTabs(tab = 'ACTIVE'){

    let proceed = (tab == 'ACTIVE' && app.settings.activeTab <= 0) ? false : true

    if(db.getData("/puppy").length > 0 && proceed){

        tabID = app.settings.activeTab

        if(tab != 'ACTIVE') tabID = tab
        
        
        db.delete(`/puppy[${tabID-1}]`)
        if(app.settings.activeTab > 1) app.settings.activeTab--
        if(db.getData("/puppy").length == 0) app.settings.activeTab = 0
        writeToInput()

    } else {
        sendAToast('warning','Kein Welpe ausgewählt!',2000)
    }
}
