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

    const videoContainer = document.querySelector(".video");
    videoContainer.insertAdjacentHTML("beforeend", videoElement);

    const vidElement = document.querySelector(".video-popup-model .videlement");
    var videoWidth = vidElement.offsetWidth;
    var videHeight = (9 / 16) * videoWidth;
    vidElement.style.height = videHeight + "px";

    const popupModel = videoContainer.querySelector(".video-popup-model");
    popupModel.classList.add("smooth_show");

    videoContainer.addEventListener("click", function (event) {
        if (event.target.closest(".video-model-close-layer")) {
            var model = event.target.closest(".video-popup-model");
            model.classList.remove("smooth_show");
            setTimeout(function () {
                model.remove();
            }, 500);
            videoContainer.classList.remove("no-reload");
            inputbox.focus();
        }
    });

    videoContainer.addEventListener("click", function (event) {
        if (event.target.closest(".popupbuttons")) {
            const closeBtn = document.querySelector(".video-model-close-layer");
            if (closeBtn) closeBtn.click();
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.which == 27 || event.key === "Escape") {
            const closeBtn = document.querySelector(".video-model-close-layer");
            if (closeBtn) closeBtn.click();
        }
    });

    if (typeof jQuery !== "undefined" && typeof jQuery.ui !== "undefined") {
        $(".draggable").draggable({
            iframeFix: true,
            cursor: "grabbing",
            handle: ".handle",
        });
    }
}

var backgrounds = [
    //format [bg-url, bg-name, bg-night-url]
    [
        "https://i.imgur.com/eEZ2YgX.jpg",
        "Mojave",
        "https://i.imgur.com/9G8q5cM.jpg",
    ],
    [
        "https://i.imgur.com/U95zyMS.jpg",
        "Catalina",
        "https://i.imgur.com/47xbeoM.jpg",
    ],
    ["https://i.imgur.com/VCmkUHl.jpg", "Mars"],
    ["https://picsum.photos/1920/1080?t=0", "Random"],
];

function showBackgrounds() {
    var stream = document.querySelector(".stream");

    document
        .querySelectorAll(".backgrounds, .backgroundinfo")
        .forEach((el) => el.remove());

    backgrounds[backgrounds.length - 1][0] += "0";

    stream.insertAdjacentHTML(
        "beforeend",
        '<div class="line backgroundinfo">' +
            '<p class="information">Click an image to change your background.</p>' +
            "</div>",
    );
    stream.insertAdjacentHTML("beforeend", '<div class="backgrounds"></div>');

    const backgroundsContainer = document.querySelector(".backgrounds");

    for (let i = 0; i < backgrounds.length; i++) {
        let cycle = "";
        if (backgrounds[i].length == 3) cycle = " (Dynamic)";

        backgroundsContainer.insertAdjacentHTML(
            "beforeend",
            '<div class="bg-wrapper" id="bg-' +
                i +
                '"><img src="' +
                backgrounds[i][0] +
                '"><span>' +
                backgrounds[i][1] +
                cycle +
                "</span></div>",
        );

        document
            .getElementById("bg-" + i)
            .addEventListener("click", function () {
                setBackground(i);
            });
    }
}

function populateWallpaperMenu() {
    const wallpaperList = document.getElementById("wallpaper-list");

    wallpaperList.innerHTML = "";

    for (let i = 0; i < backgrounds.length; i++) {
        let bgName = backgrounds[i][1];

        if (backgrounds[i].length === 3) {
            bgName += " (Dynamic)";
        }

        let li = document.createElement("li");
        let a = document.createElement("a");
        a.innerText = bgName;
        a.style.cursor = "Pointer";

        a.addEventListener("click", function (e) {
            e.preventDefault();
            setBackground(i);
        });

        li.appendChild(a);
        wallpaperList.appendChild(li);
    }
}

function setBackground(i) {
    var root = document.documentElement;
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

document.addEventListener("DOMContentLoaded", function () {
    var stream = document.querySelector(".stream");
    var inputbox = document.getElementById("terminalinput");
    var root = document.documentElement;

    var radioPlaying = false;
    let radio = document.getElementById("radio");
    radio.volume = 0.03;

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
        time();
        setInterval(time, 1000);
        bg_cycle();
        setInterval(bg_cycle, 1000);
        setCookie("lastlogin", new Date().toUTCString());

        inputbox.focus();

        populateWallpaperMenu();

        let bg_cookie = getCookie("background");
        if (bg_cookie != "") {
            var i = parseInt(bg_cookie);
            setBackground(i);
        } else {
            setBackground(0);
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

            document
                .querySelectorAll(".inputline .time")
                .forEach((el) => (el.innerText = timestring));
            document
                .querySelectorAll(".date")
                .forEach((el) => (el.innerText = datestring));
        }
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

    function initWindows() {
        if (typeof jQuery !== "undefined" && typeof jQuery.ui !== "undefined") {
            $(".window").draggable({
                containment: "parent",
                handle: ".handle",
                cursor: "grabbing",
                cancel: ".terminal",
                iframeFix: true,
            });
        }

        document.querySelectorAll(".window").forEach((win) => {
            win.addEventListener("mousedown", function () {
                windowOnTop(this);
            });
        });
    }

    const fullscreenBtn = document.getElementById("menu-fullscreen");

    fullscreenBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((err) => {
                console.warn("Fullscreen request failed:", err);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    });

    document.addEventListener("fullscreenchange", () => {
        if (document.fullscreenElement) {
            fullscreenBtn.innerHTML = "Exit Full Screen";
        } else {
            fullscreenBtn.innerHTML = "Enter Full Screen";
        }
    });
});
