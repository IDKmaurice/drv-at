$('body').on('change','.sIn', writeToTemp);

function clearInputs() {
    $('.sIn').each(function() {
        $(this).val("");
    });
}

function updateVueArr() {
    app.main = db.getData("/");
}

function writeToTemp() {

    $('.sIn').each(function() {

        var saveName = $(this).data('save-name');
        var value = $(this).val();
        db.push(saveName,value);

    });

    unsavedProgress = true;
    db.save();
    updateVueArr();
}

function writeToInput() {
    clearInputs();
    updateVueArr();

    //after finishing the DOM render prozess
    Vue.nextTick(function () {
        $('.sIn').each(function() {

            var saveName = $(this).attr('data-save-name');

            //checks if name exists => prevents errors
            if(db.exists(saveName) == true){
                var value = db.getData(saveName);
                $(this).val(value);
            }

        });

        unsavedProgress = false;
        changeView('edit');
    });

}
