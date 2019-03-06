function setTab(tab) {
    app.settings.activeTab = tab   
}



function addTab() {
    let i = app.doc.entries.length

    // Checks for entry limit
    if(i < app.settings.tabLimit){

        // Pushes new entry to memory
        app.doc.entries.push({firstname: '', haircolor: '', gender: '', chip: '', zbn: ''})

        // Selects the created entry-tab
        app.settings.activeTab = i+1
    } else {
        sendAToast('warning',`Welpen Limit pro Wurf erreicht! (max. ${app.settings.tabLimit})`,2000)
    }
}



function removeTab(tab = 'ACTIVE'){

    let proceed = (tab == 'ACTIVE' && app.settings.activeTab <= 0) ? false : true
    let len = app.doc.entries.length

    if(len > 0 && proceed){

        // Only really needed if removeTabs doesn't get any value
        let tabID = (tab == 'ACTIVE') ? app.settings.activeTab : tab
        
        // This deletes the entry from memory
        app.doc.entries.splice((tabID-1), 1)

        if(tabID <= len-1) app.settings.activeTab = tabID
        else if(tabID > 1) app.settings.activeTab = tabID - 1
        else if(len-1 == 0) app.settings.activeTab = 0

    } else {
        sendAToast('warning','Kein Welpe ausgewählt!',2000)
    }
}
