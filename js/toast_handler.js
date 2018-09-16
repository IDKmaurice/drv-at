toastReady = true;
function sendAToast(type,msg,delay) {

    if(toastReady == true){

        var toast = $('.toast')

        toastReady = false;

        if(['success','warning','error'].indexOf(type) !== -1){

            arr={'error':'error','warning':'warning','success':'check'};

            toast.removeClass('toast-error')
            toast.removeClass('toast-warning')
            toast.removeClass('toast-success')
            toast.addClass('toast-'+type)
            toast.children('.toast-msg').html(msg)
            toast.children('.toast-icon').html(arr[type])
        }

        toast.animate({
            bottom: '10px',
            opacity: 1
        },300).delay(delay).animate({
            bottom: '-110px',
            opacity: 0
        }, 300, function(){
            toastReady = true;
        })
    }
}
