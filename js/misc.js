function ipLicenseNext(){
    let value = $('#license-ip-value').val();
    settings.set('license',value);
    animInputPopup('license-ip-bg','out');
    animInputPopup('pass-ip-bg','in');
}

function ipPassNext(){
    let pass = $('#pass-ip-value').val();
    let license = settings.get('license');
    animInputPopup('pass-ip-bg','out');

    $.post("https://maurice-freuwoert.com/drvserverapi/login.php", { license: license, password: pass }, function (data) {
        let returnValues = JSON.parse(data);
        if (returnValues.success) {
            app.data.sessionKey = returnValues.key;
            $.post("https://maurice-freuwoert.com/drvserverapi/readDB.php", { license: license, sessionKey: returnValues.key, filtervalue: 'G' }, function (data) {
                console.log(JSON.parse(data));
            });
        } else {
            console.warn(returnValues.error)
        }
    });
}