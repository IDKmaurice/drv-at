function initSettings(){
    initOptions = [
        {name: 'theme', init: 'default'},
        {name: 'outputFolder', init: 'PDF'},
        {name: 'hairtypes', init: ''},
    ];

    for (let i = 0; i < initOptions.length; i++) {
        if(settings.has(initOptions[i].name) == false){
            settings.set(initOptions[i].name,initOptions[i].init);
        }
    }

    settingsToInput();
    setTheme(settings.get('theme'));
    app.settings.hairtypes = settings.get('hairtypes').split(',');
}

function settingsToInput(){
    $('.settings-input').each(function(){
        let optionName = $(this).attr('data-option-name');

        if(settings.has(optionName)){
            $(this).val(settings.get(optionName));
        }
    })
}

function applySettings(){
    $('.settings-input').each(function(){
        let optionName = $(this).attr('data-option-name');
        let optionValue = $(this).val();
        
        settings.set(optionName, optionValue);
    })
}

function resetSettings(){
    $('.settings-input').each(function(){
        $(this).val('');
    })
    settings.deleteAll();
    initSettings();
}

settings.watch('hairtypes', (val) => {
    let hairArr = val.split(',');
    app.settings.hairtypes = hairArr;
});