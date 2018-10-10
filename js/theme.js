settings.watch('theme', (val) => {
    setTheme(val)
});

function setTheme(theme) {
    for (let i = 0; i < app.themes[theme].props.length; i++) {
        let prop = app.themes[theme].props[i];
        document.documentElement.style.setProperty("--"+prop.prop, prop.value)
    }
}