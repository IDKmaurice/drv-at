function initSettings(){
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