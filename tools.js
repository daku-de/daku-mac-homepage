function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(";");
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            let val = c.substring(name.length, c.length);
            console.log("Cookie read. " + name + "=" + val);
            return val;
        }
    }
    return "";
}

function setCookie(key, value) {
    var exp_date = new Date();
    exp_date.setTime(exp_date.getTime() + 10 * 365 * 24 * 60 * 1000);
    document.cookie = key + "=" + value + ";expires=" + exp_date.toUTCString();
    console.log("Cookie set. " + key + "=" + value);
}
