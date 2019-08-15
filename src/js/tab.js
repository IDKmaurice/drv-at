function setTab(tab) {
    app.MEMORY.activeTab = tab   
}



function addTab() {
    let i = app.doc.entries.length

    // Checks for entry limit
    if(i < app.MEMORY.tabLimit){

        // Pushes new entry to memory
        app.doc.entries.push({firstname: '', haircolor: '', gender: 'MALE', chip: '', zbn: '', comment: ''})

        // Selects the created entry-tab
        app.MEMORY.activeTab = i+1
    } else {
        sendAToast('warning',`Welpen Limit pro Wurf erreicht! (max. ${app.MEMORY.tabLimit})`)
    }
}



function removeTab(tab = 'ACTIVE'){

    let proceed = (tab == 'ACTIVE' && app.MEMORY.activeTab <= 0) ? false : true
    let len = app.doc.entries.length

    if(len > 0 && proceed){

        // Only really needed if removeTabs doesn't get any value
        let tabID = (tab == 'ACTIVE') ? app.MEMORY.activeTab : tab
        
        // This deletes the entry from memory
        app.doc.entries.splice((tabID-1), 1)

        if(tabID <= len-1) app.MEMORY.activeTab = tabID
        else if(tabID > 1) app.MEMORY.activeTab = tabID - 1
        else if(len-1 == 0) app.MEMORY.activeTab = 0

    } else {
        sendAToast('warning','Kein Welpe ausgewählt!')
    }
}
