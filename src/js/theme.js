settings.watch('theme', (val) => {
    setTheme(val)
});

function setTheme(theme) {
    if(app.themes[theme] != undefined){

        for (let i = 0; i < app.themes[theme].props.length; i++) {
            let prop = app.themes[theme].props[i];
            document.documentElement.style.setProperty("--"+prop.prop, prop.value)
        }

    }
}


function loadThemeFromPath(path = '__SELF__') {

    let themes = ''

    if(fs.existsSync(path) && fs.lstatSync(path).isFile()){
        themes = [path]
    }

    if(path == '__SELF__'){
        themes = glob.sync("src/themes/*.json")
    }

    for (const theme of themes) {
        try {
            let themeContent = JSON.parse(fs.readFileSync(theme, 'utf8'))
            let themeName = pn.basename(theme, '.json')
            
            app.themes[themeName] = themeContent
        } catch(e) {
            console.log(e)
        }
    }

    
}