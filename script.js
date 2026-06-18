function playVideo(yt_id, windowtitle) {
    var videoElement =
        '<div class="video-popup-model">' +
        '<div class="video-layer">' +
        '<div class="video-model-close-layer">' +
        "</div>" +
        '<div class="model-wrapper">' +
        '<div class="draggable">' +
        '<div class="handle">' +
        '<div class="buttons popupbuttons"><div class="first"></div><div class="second"></div><div class="third"></div></div><span class="title">' +
        windowtitle +
        "</span>" +
        "</div>" +
        '<div class="videomodel">' +
        '<div class="videoscreen">';
    videoElement +=
        '<iframe width="100%" height="auto" class="videlement"' +
        'src="https://www.youtube.com/embed/' +
        yt_id +
        "?rel=0&amp;controls=1&amp;showinfo=0&amp;autoplay=1" +
        '" frameborder="0"' +
        'allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"' +
        "allowfullscreen></iframe>" +
        "</div>";
    videoElement += "</div>" + "</div>" + "</div>" + "</div>" + "</div>";
    $(".video").append(videoElement);
    var videoWidth = $(".video-popup-model .videlement").width();
    var videHeight = (9 / 16) * videoWidth;
    $(".video-popup-model .videlement").height(videHeight);
    $(".video").find(".video-popup-model").addClass("smooth_show");

    $(".video").on("click", ".video-model-close-layer", function (event) {
        var model = $(this).parents(".video-popup-model");
        model.removeClass("smooth_show");
        setTimeout(function () {
            model.remove();
        }, 500);
        $(".video").removeClass("no-reload");
        inputbox.focus();
    });

    $(".video").on("click", " .popupbuttons", function (event) {
        $(".video-model-close-layer").click();
    });

    $(document).on("keydown", function (event) {
        if (event.which == 27) {
            $(".video-model-close-layer").click();
        }
    });

    $(function () {
        $(".draggable").draggable({
            iframeFix: true,
            cursor: "grabbing",
            handle: ".handle",
        });
    });
}

$(document).ready(function (e) {
    var stream = $(".stream");
    var inputbox = $("#terminalinput");
    var root = document.documentElement;

    var radioPlaying = false;
    let radio = document.getElementById("radio");
    radio.volume = 0.03;

    var backgrounds = [
        //format [bg-url, bg-name, bg-night-url]
        [
            "https://i.imgur.com/eEZ2YgX.jpg",
            "Mojave",
            "https://i.imgur.com/9G8q5cM.jpg",
        ],
        ["https://i.imgur.com/ZMGL5nP.jpg", "Abstract"],
        ["https://i.imgur.com/psAgyeh.jpg", "Mountain"],
        [
            "https://i.imgur.com/U95zyMS.jpg",
            "Catalina",
            "https://i.imgur.com/47xbeoM.jpg",
        ],
        ["https://i.imgur.com/VCmkUHl.jpg", "Mars"],
        ["https://picsum.photos/1920/1080?t=0", "Random"],
    ];
    var previouscommands = [];
    var currentcommand = 0;

    /*
         Custom Text Styles
            red
            green
            blue
            logo
            important
            white
      */

    /*
         Custom Text Syntax
         Links:      
            [URLPATH](NAME) - regular
            [^URLPATH](NAME) - open in new tab
            
         Styles:
            *TEXT* - bold text
            A! - spaces are converted to non-breaking spaces (it's for ascii art - after all, this is a text based website)
      */

    function init() {
        initWindows();
        setInterval(time);
        bg_cycle();
        setInterval(bg_cycle, 1000);
        setCookie("lastlogin", new Date().toUTCString());

        inputbox.focus();

        let bg_cookie = getCookie("background");
        if (bg_cookie != "") {
            var i = parseInt(bg_cookie);
            setBackground(i);
        } else {
            setBackground(0);
        }

        let style_cookie = getCookie("style");
        if (style_cookie != "") {
            setStyle(style_cookie);
        }
    }

    function bg_cycle() {
        //day & night cycle for background
        let d = new Date();
        let hours = d.getHours();
        let minutes = d.getMinutes();
        let seconds = d.getSeconds();
        let totmin = hours * 60 + minutes;
        let night_opacity = 0;
        if (totmin >= 22 * 60 || totmin <= 6 * 60) night_opacity = 1;
        if (totmin >= 11 * 60 && totmin <= 17 * 60) night_opacity = 0;
        if (totmin > 6 * 60 && totmin < 11 * 60)
            night_opacity =
                ((10 * 60 + 30 - totmin) * 60 - seconds) / (5 * 60 * 60);
        if (totmin > 17 * 60 && totmin < 22 * 60)
            night_opacity = ((totmin - 17 * 60) * 60 + seconds) / (5 * 60 * 60);
        night_opacity = (Math.round(night_opacity * 1000) / 1000).toFixed(3);
        document
            .getElementById("night-bg")
            .style.setProperty("opacity", night_opacity);
    }

    var timestring = "";
    var datestring = "";
    function time() {
        var d = new Date();

        var hours = d.getHours();
        var minutes = d.getMinutes();
        var seconds = d.getSeconds();
        var weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        if (hours < 10) hours = "0" + hours;
        if (minutes < 10) minutes = "0" + minutes;
        if (seconds < 10) seconds = "0" + seconds;
        var temptimestring = "[" + hours + ":" + minutes + ":" + seconds + "]";
        var tempdatestring = "";
        var ending = hours >= 12 ? "PM" : "AM";
        if (hours >= 12) hours -= 12;
        if (hours == 0) hours = 12;
        if (hours < 10 && hours[0] != "0") hours = "0" + hours;
        var tempdatestring =
            weekdays[d.getDay()] + " " + hours + ":" + minutes + " " + ending;

        if (temptimestring != timestring) {
            timestring = temptimestring;
            datestring = tempdatestring;
            $(".inputline .time").text(timestring);
            $(".date").text(datestring);
        }
    }

    function setBackground(i) {
        var url = "url(" + backgrounds[i][0] + ")";
        root.style.setProperty("--background-image", url);
        if (backgrounds[i].length == 3) {
            var night_url = "url(" + backgrounds[i][2] + ")";
            root.style.setProperty("--background-night-image", night_url);
        } else {
            root.style.setProperty("--background-night-image", "url()");
        }
        setCookie("background", i);
    }

    function showBackgrounds() {
        $(".backgrounds").remove();
        $(".backgroundinfo").remove();
        backgrounds[backgrounds.length - 1][0] += "0";
        stream.append(
            '<div class="line backgroundinfo">' +
                '<p class="information">Click an image to change your background.</p>' +
                "</div>",
        );
        stream.append('<div class="backgrounds">');
        for (var i = 0; i < backgrounds.length; i++) {
            let cycle = "";
            if (backgrounds[i].length == 3) cycle = " (Dynamic)";
            $(".backgrounds").append(
                '<div class="bg-wrapper" id="bg-' +
                    i +
                    '"><img src="' +
                    backgrounds[i][0] +
                    '"><span>' +
                    backgrounds[i][1] +
                    cycle +
                    "</span></div>",
            );
            $("#bg-" + i).on("click", i, function (e) {
                var i = e.data;
                setBackground(i);
            });
        }
    }

    function setStyle(style) {
        if (Object.keys(terminalstyles).indexOf(style) <= -1) {
            printLine("Style '" + style + "' not known");
            return false;
        }
        setCookie("style", style);
        root.style.setProperty(
            "--terminal-background",
            terminalstyles[style][0],
        );
        root.style.setProperty("--terminal-text", terminalstyles[style][1]);
        root.style.setProperty(
            "--terminal-inputline",
            terminalstyles[style][2],
        );
        root.style.setProperty("--color-logo", terminalstyles[style][3]);
        root.style.setProperty("--color-important", terminalstyles[style][4]);
        return true;
    }

    function lastlogin() {
        var lastlogin_date;
        let lastlogin_cookie = getCookie("lastlogin");
        if (lastlogin_cookie != "") {
            lastlogin_date = new Date(lastlogin_cookie);
        }
        if (lastlogin_date == null) {
            printLine("Last Login: never");
            printLine();
            return;
        }

        var months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sept",
            "Oct",
            "Nov",
            "Dec",
        ];
        var weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        var sec = lastlogin_date.getSeconds();
        var hour = lastlogin_date.getHours();
        var min = lastlogin_date.getMinutes();
        if (sec < 10) {
            sec = "0" + sec;
        }
        if (hour < 10) {
            hour = "0" + hour;
        }
        if (min < 10) {
            min = "0" + min;
        }
        var lastlogin = "Last Login: ";
        lastlogin +=
            weekdays[lastlogin_date.getDay()] +
            " " +
            months[lastlogin_date.getMonth()] +
            " " +
            lastlogin_date.getDate() +
            " " +
            lastlogin_date.getFullYear() +
            " " +
            hour +
            ":" +
            min +
            ":" +
            sec;
        lastlogin += " on ttys000";
        printLine(lastlogin);
        printLine();
    }

    String.prototype.splice = function (idx, rem, str) {
        return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
    };
    init();

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
        document.cookie =
            key + "=" + value + ";expires=" + exp_date.toUTCString();
        console.log("Cookie set. " + key + "=" + value);
    }

    function initWindows() {
        $(function () {
            $(".window").draggable({
                containment: "parent",
                handle: ".handle",
                cursor: "grabbing",
                cancel: ".terminal",
                iframeFix: true,
            });
        });
        $(".window").mousedown(function () {
            windowOnTop($(this)[0]);
        });
    }
});
