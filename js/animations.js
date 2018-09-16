function animateBackupIn() {
    anime.timeline().add({
        targets: '.backup-bg',
        backgroundColor: 'rgba(0,0,0,0.6)',
        easing: 'easeInOutCubic',
        duration: 400,
        begin: function(){
            $('.backup-bg').css('pointer-events','all')
        }
    }).add({
        targets: '.backup',
        translateY: [50, 0],
        easing: 'easeInOutCubic',
        opacity: [0,1],
        duration: 300,
        offset: 100
    }).add({
        targets: '.backup-header',
        translateY: [-60, 0],
        easing: 'easeInOutCubic',
        opacity: 1,
        duration: 400,
        offset: 100
    }).add({
        targets: '.backup-footer',
        translateY: [50, 0],
        easing: 'easeInOutCubic',
        opacity: 1,
        duration: 400,
        offset: 100
    }).add({
        targets: '.backup-holder',
        translateX: [50,0],
        easing: 'easeInOutCubic',
        opacity: [0,1],
        duration: 400,
        offset: 300
    });
}




function animateBackupOut() {
    anime.timeline().add({
        targets: '.backup-holder',
        translateX: 50,
        opacity: 0,
        easing: 'easeInOutCubic',
        duration: 400
    }).add({
        targets: '.backup-footer',
        translateY: 50,
        easing: 'easeInOutCubic',
        duration: 400,
        offset: 100
    }).add({
        targets: '.backup-header',
        translateY: -60,
        easing: 'easeInOutCubic',
        duration: 400,
        offset: 100
    }).add({
        targets: '.backup',
        translateY: 50,
        opacity: [1,0],
        easing: 'easeInOutCubic',
        duration: 300,
        offset: 100,
        begin: function(){
            $('.backup-bg').css('pointer-events','none')
        }
    }).add({
        targets: '.backup-bg',
        backgroundColor: 'rgba(0,0,0,0)',
        easing: 'easeInOutCubic',
        duration: 400,
        offset: 300
    });
}





function animatePuppyListIn() {
    anime.timeline().add({
        targets: '.puppy-list-bg',
        backgroundColor: 'rgba(0,0,0,0.6)',
        easing: 'easeInOutCubic',
        duration: 300,
        begin: function(){
            $('.puppy-list-bg').css('pointer-events','all')
        }
    }).add({
        targets: '.puppy-list',
        translateY: [50, 0],
        easing: 'easeInOutCubic',
        opacity: [0,1],
        duration: 300,
        offset: 100
    }).add({
        targets: '.puppy-list-header',
        translateY: [-60, 0],
        easing: 'easeInOutCubic',
        duration: 400,
        offset: 100
    }).add({
        targets: '.puppy-list-holder',
        translateY: [50,0],
        easing: 'easeInOutCubic',
        opacity: [0,1],
        duration: 400,
        offset: 200
    });
}

function animatePuppyListOut() {
    anime.timeline().add({
        targets: '.puppy-list-holder',
        translateY: 50,
        opacity: 0,
        easing: 'easeInOutCubic',
        duration: 300
    }).add({
        targets: '.puppy-list-header',
        translateY: -60,
        easing: 'easeInOutCubic',
        duration: 400,
        offset: 100
    }).add({
        targets: '.puppy-list',
        translateY: 50,
        opacity: [1,0],
        easing: 'easeInOutCubic',
        duration: 300,
        offset: 100,
        begin: function(){
            $('.puppy-list-bg').css('pointer-events','none')
        }
    }).add({
        targets: '.puppy-list-bg',
        backgroundColor: 'rgba(0,0,0,0)',
        easing: 'easeInOutCubic',
        duration: 400,
        offset: 300
    });
}
