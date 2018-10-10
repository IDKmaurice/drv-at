function animPopup(id, opt) {

    if(opt == 'in'){

        anime.timeline().add({
            targets: `.${id}-bg`,
            backgroundColor: 'rgba(0,0,0,0.6)',
            easing: 'easeInOutCubic',
            duration: 400,
            begin: function(){
                $(`.${id}-bg`).css('pointer-events','all')
            }
        }).add({
            targets: `.${id}-holder`,
            translateY: [50, 0],
            easing: 'easeInOutCubic',
            opacity: [0,1],
            duration: 300,
            offset: 100
        }).add({
            targets: `.${id}-header`,
            translateY: [-60, 0],
            easing: 'easeInOutCubic',
            opacity: 1,
            duration: 400,
            offset: 100
        }).add({
            targets: `.${id}-footer`,
            translateY: [50, 0],
            easing: 'easeInOutCubic',
            opacity: 1,
            duration: 400,
            offset: 100
        }).add({
            targets: `.${id}-content`,
            translateX: [50,0],
            easing: 'easeInOutCubic',
            opacity: [0,1],
            duration: 400,
            offset: 300
        });

    } else if(opt == 'out'){

        anime.timeline().add({
            targets: `.${id}-content`,
            translateX: 50,
            opacity: 0,
            easing: 'easeInOutCubic',
            duration: 400
        }).add({
            targets: `.${id}-footer`,
            translateY: 50,
            easing: 'easeInOutCubic',
            duration: 400,
            offset: 100
        }).add({
            targets: `.${id}-header`,
            translateY: -60,
            easing: 'easeInOutCubic',
            duration: 400,
            offset: 100
        }).add({
            targets: `.${id}-holder`,
            translateY: 50,
            opacity: [1,0],
            easing: 'easeInOutCubic',
            duration: 300,
            offset: 100,
            begin: function(){
                $(`.${id}-bg`).css('pointer-events','none')
            }
        }).add({
            targets: `.${id}-bg`,
            backgroundColor: 'rgba(0,0,0,0)',
            easing: 'easeInOutCubic',
            duration: 400,
            offset: 300
        });
    }
}



function animInputPopup(id, opt) {

    if(opt == 'in'){

        $(`.${id}`).children('input').first().focus();

        anime.timeline().add({
            targets: `.${id}`,
            top: 0,
            easing: 'easeInOutCubic',
            duration: 400
        })

    } else if(opt == 'out'){

        anime.timeline().add({
            targets: `.${id}`,
            top: -140,
            easing: 'easeInOutCubic',
            duration: 400
        })
    }
}