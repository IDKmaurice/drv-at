function selectTab(tabID = "main") {

    $('.tab').each(function(){
        $(this).removeClass('tab-active')
    })

    $('.tab[data-change-tab="'+tabID+'"]').addClass('tab-active');

    changeTab(tabID);

}




function openPuppyList() {
    animatePuppyListIn();
    app.$forceUpdate();
}

function openBackupUI() {
    animateBackupIn();
    vBackup.$forceUpdate();
}



function changeTab(changeToTab = "main"){

    $('.edit-tab').removeClass('edit-tab-active')



    if($('.edit-tab[data-tab-page="'+changeToTab+'"]').length){

        $('.edit-tab[data-tab-page="'+changeToTab+'"]').addClass('edit-tab-active')

    } else {

        $('.edit-tab[data-tab-page="main"]').addClass('edit-tab-active')
    }


    if ($('.puppy-tab.tab-active').length) {

        var tabSelector = $('.puppy-tab.tab-active').attr('data-puppy-tab')
        var tab = $('.edit-tab[data-tab-page="puppy"]')
        tab.children('h1').html("Welpenseite: "+tabSelector)

    }

}

function addTabs() {
    var i = db.getData("/puppy").length;

    //check for 20 puppy limit
    if(i < 20){
        db.push("/puppy[]",{});
        writeToInput();

        //select the newly created tab
        Vue.nextTick(function () {
            selectTab(db.getData("/puppy").length);
        });
    } else {
        sendAToast('warning','Welpen Limit pro Wurf erreicht! (max. 20)',2000);
    }
}

function removeTabs(arg = 'active'){
    var pta = $('.puppy-tab.tab-active');
    var i = db.getData("/puppy").length;
    var canDelete = true

    if(i > 0){

        if(arg == 'active'){

            //if selected tab is a puppytab
            if (pta.length == 1) {
                arg = parseInt(pta.attr('data-change-tab')) - 1;
            } else {
                canDelete = false;
            }
        }

        if (canDelete) {

            db.delete("/puppy["+arg+"]");
            writeToInput();

            sendAToast('success','Tab erfolgreich gelöscht!',2000);
        } else {
            sendAToast('warning','Kein Welpe ausgewählt!',2000);
        }

    }
}
