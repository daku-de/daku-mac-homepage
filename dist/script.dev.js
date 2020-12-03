"use strict";

$(document).ready(function (e) {
  var stream = $(".stream");
  var inputbox = $(".inputline .inputbox");
  var root = document.documentElement;
  console.clear();
  var commandlist = [["help", "Show commands"], ["style", "Change the style of the console"], ["background", "Choose a different background image"], ["video", "Show youtube video"], ["echo", "Display given input"], ["socials", "Linktree to all of my socials"], ["fact", "Display a random fact"], ["clear", "Clear the console"], ["reset", "Reset the whole console"]];
  var backgrounds = [["https://i.imgur.com/ZMGL5nP.jpg", "Default"], ["https://i.imgur.com/psAgyeh.jpg", "Mountain"], ["https://i.imgur.com/0ylkqeZ.jpg", "Galaxy"], ["https://i.imgur.com/VCmkUHl.jpg", "Mars"], ["https://picsum.photos/1920/1080?t=0", "Random"]];
  var previouscommands = [];
  var currentcommand = 0;
  var terminalstyles = {
    //Custom Terminal Styles ([TerminalBackground, TerminalText, InputlineBackground, Logo, Important])
    "default": ["#3A3A3A", "#EFEFAE", "#262626", "#ffe419", "#E3A786"],
    hackerman: ["#000000", "#0ed400", "#000000", "#ff0fff", "#E3A786"],
    white: ["#ffffff", "#000000", "#ffffff", "#ff8205", "#c40000"],
    dark: ["#313F46", "#ffffff", "#23292C", "#60AA67", "#B9585D"],
    pink: ["#ffcbe4", "#df0069", "#ffa4cf", "#6a0067", "#3f3fff"],
    twitter: ['#162D40', '#FFFFFF', '#15202B', '#1A91DA', '#B9585D']
  };
  var pageindex = ["index", "about", "connect"];
  var currentpage = "landing";
  var facts = ["'rm -rf /' will close this website", "About 92% of the world’s currency exists only on hard drives", "The new Texas Instrument calculators have ABC keyboards as the standardised tool for tests", "Sister Mary K. Keller was the first woman in the US to be awarded a PhD in Computer Science"];
  var url = "http://daku.im";
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
        E! - Text is an error/notification
        A! - spaces are converted to non-breaking spaces (it's for ascii art - after all, this is a text based website)
  */

  function init() {
    initWindows();
    initTerminal();
    initCalc();
    initMail();
    setInterval(time);
    printTerminalWelcome();
    setCookie("lastlogin", new Date().toUTCString());

    if (getCookie("background") != "") {
      var i = parseInt(getCookie("background"));
      console.log("Cookie found: " + "background=" + i + ";");
      var url = "url(" + backgrounds[i][0] + ")";
      root.style.setProperty('--background-image', url);
    }

    if (getCookie("style") != "") {
      setStyle(getCookie("style"));
    }
  }

  function printTerminalWelcome() {
    lastlogin();
    printLine("A! ________      ________      ___  __        ___  ___     ", "logo");
    printLine("A!|\\   ___ \\    |\\   __  \\    |\\  \\|\\  \\     |\\  \\|\\  \\    ", "logo");
    printLine("A!\\ \\  \\_|\\ \\   \\ \\  \\|\\  \\   \\ \\  \\/  /|_   \\ \\  \\\\\\  \\   ", "logo");
    printLine("A! \\ \\  \\ \\\\ \\   \\ \\   __  \\   \\ \\   ___  \\   \\ \\  \\\\\\  \\  ", "logo");
    printLine("A!  \\ \\  \\_\\\\ \\   \\ \\  \\ \\  \\   \\ \\  \\\\ \\  \\   \\ \\  \\\\\\  \\ ", "logo");
    printLine('A!   \\ \\_______\\   \\ \\__\\ \\__\\   \\ \\__\\\\ \\__\\   \\ \\_______\\', "logo");
    printLine("A!    \\|_______|    \\|__|\\|__|    \\|__| \\|__|    \\|_______|", "logo");
    printLine();
    printLine('Welcome to [^https://daku.im](<b>daku.im</b>)!');
    printLine();
    printLine("You can use this interface just like a normal terminal!", "important", "Info");
    printLine("For help type 'help'", "important", "Info");
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
    var ending = hours >= 12 ? 'PM' : 'AM';
    if (hours >= 12) hours -= 12;
    if (hours == 0) hours = 12;
    if (hours < 10) hours = "0" + hours;
    var tempdatestring = weekdays[d.getDay()] + " " + hours + ":" + minutes + " " + ending;

    if (temptimestring != timestring) {
      timestring = temptimestring;
      datestring = tempdatestring;
      $(".inputline .time").text(timestring);
      $(".date").text(datestring);
    }
  }

  inputbox.keydown(function (e) {
    var text = inputbox.text();
    console.log(e.which);

    if (e.which == 13) {
      var command = text.split(' ')[0];
      var output = "";
      command = command.replace(/</g, "&lt;");
      command = command.replace(/>/g, "&gt;");
      text = text.replace(/</g, "&lt;");
      text = text.replace(/>/g, "&gt;");
      inputbox.text("");
      printLine(text, null, "User");

      if (text !== "") {
        previouscommands[currentcommand] = text;
        currentcommand = previouscommands.length;
        cmd(command, text);
      } //Remove newline


      setTimeout(function () {
        inputbox.text("");
      }, 1);
    }

    if (e.which == 38) {
      //previous command
      if (currentcommand > 0) {
        currentcommand--;
        inputbox.text(previouscommands[currentcommand]);
      }
    }

    if (e.which == 40) {
      //next command
      if (currentcommand < previouscommands.length) {
        currentcommand++;
        inputbox.text(previouscommands[currentcommand]);
      }

      if (currentcommand == previouscommands.length) {
        inputbox.text("");
      }
    }
  });

  function cmd(command, line) {
    console.log("Input: " + line);
    command = command.replace(/\//, '');
    command = command.toLowerCase();

    switch (command) {
      case "commands":
      case "help":
        var maxlen = 0;

        for (var i = 0; i < commandlist.length; i++) {
          if (commandlist[i][0].length > maxlen) {
            maxlen = commandlist[i][0].length;
          }
        }

        for (var i = 0; i < commandlist.length; i++) {
          output = commandlist[i][0];
          output += "\xA0".repeat(maxlen - commandlist[i][0].length);
          output += " - " + commandlist[i][1];
          console.log(output);
          printLine(output, null, "Client");
        }

        break;

      case "echo":
        var out = line.substr(line.split(' ')[0].length);
        printLine(out);
        break;

      case "clear":
        stream.text("");
        break;

      case "reset":
        stream.text("");
        previouscommands = [];
        printTerminalWelcome();
        break;

      case "video":
        var ID = "LXb3EKWsInQ";
        var title = "Placeholder";
        playVideo(ID, title);
        break;

      case "fact":
        printFact();
        break;

      case "background":
        showBackgrounds();
        break;

      case "rm":
        var file = line.substr([line.split(' ')[0].length]);
        var sad_mac = "https://i.imgur.com/2uex9Hc.png";

        if (file.localeCompare("-rf /")) {
          console.log("Closing the page");
          $(".wrapper").addClass('macwrapper');
          $(".wrapper").append('<div class="macerror"></div>');
          setTimeout(function (func) {
            window.location.replace("https://www.google.com/");
          }, 4500);
          var audio = new Audio('files/sadmac.mp3');
          audio.play();
          window.home();
        } else {
          printLine("Couldn't delete " + file);
        }

        break;

      case "socials":
        printSocials();
        break;

      case "style":
        if (line.split(' ').length == 2) {
          var style = line.split(' ')[1].toLowerCase();

          if (setStyle(style)) {
            printLine("Successfully changed style to: " + "'<b>" + style + "</b>'");
          }
        } else {
          printLine("Usage: style &lt;style&gt;");
          printLine("Available styles:");
          Object.keys(terminalstyles).forEach(function (style) {
            return printLine(style);
          });
        }

        break;

      case "kappa":
        printLine('<img src="https://img.redbull.com/images/c_fill,g_auto,w_1030,h_1030/q_auto,f_auto/redbullcom/2017/06/19/2a7635e1-c005-4a7a-a707-3238f36ccc00/kappa-twitch.png" width="60" height="60"');
        break;

      case "kekw":
        printLine('<img src="https://www.streamscheme.com/wp-content/uploads/2020/07/kekw-emote.jpg" width="60" height="60"');
        break;

      default:
        output = "Unrecognised command '" + command + "'.";
        printLine(output, null, "Client");
    }
  }

  function showBackgrounds() {
    $(".backgrounds").remove();
    $(".backgroundinfo").remove();
    backgrounds[backgrounds.length - 1][0] += "0";
    stream.append('<div class="line backgroundinfo">' + '<p class="information">Click an image to change your background.</p>' + '</div>');
    stream.append('<div class="backgrounds">');

    for (var i = 0; i < backgrounds.length; i++) {
      $(".backgrounds").append('<div class="bg-wrapper" id="bg-' + i + '"><img src="' + backgrounds[i][0] + '"><span>' + backgrounds[i][1] + '</span></div>');
      $("#bg-" + i).on('click', i, function (e) {
        var i = e.data;
        var url = "url(" + backgrounds[i][0] + ")";
        root.style.setProperty('--background-image', url);
        setCookie("background", i);
      });
    }
  }

  var readfacts = [];

  function printFact() {
    if (readfacts.length == facts.length) readfacts = []; //all facts displayed once, reset

    for (var r = Math.floor(Math.random() * facts.length); readfacts.includes(r); r = Math.floor(Math.random() * facts.length)) {
      ;
    }

    printLine(facts[r], null, "Fun Fact", "white");
    readfacts.push(r);
    console.log("Readfacts: " + readfacts);
  }

  function setStyle(style) {
    if (Object.keys(terminalstyles).indexOf(style) <= -1) {
      printLine("Style '" + style + "' not known");
      return;
    }

    setCookie("style", style);
    root.style.setProperty('--terminal-background', terminalstyles[style][0]);
    root.style.setProperty('--terminal-text', terminalstyles[style][1]);
    root.style.setProperty('--terminal-inputline', terminalstyles[style][2]);
    root.style.setProperty('--color-logo', terminalstyles[style][3]);
    root.style.setProperty('--color-important', terminalstyles[style][4]);
    return true;
  }

  function lastlogin() {
    var lastlogin_date;

    if (getCookie("lastlogin") != "") {
      lastlogin_date = new Date(getCookie("lastlogin"));
      console.log(lastlogin_date);
    }

    if (lastlogin_date == null) {
      printLine("Last Login: never");
      printLine();
      return;
    }

    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
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
    lastlogin += weekdays[lastlogin_date.getDay()] + " " + months[lastlogin_date.getMonth()] + " " + lastlogin_date.getDate() + " " + lastlogin_date.getFullYear() + " " + hour + ":" + min + ":" + sec;
    lastlogin += " on ttys000";
    printLine(lastlogin);
    printLine();
  }

  function printSocials() {
    printLine("A!   ____  ____   _____   ____   ___    __    ____", "blue");
    printLine("A!  / __/ / __ \\ / ___/  /  _/  / _ |  / /   / __/", "blue");
    printLine("A! _\\ \\  / /_/ // /__   _/ /   / __ | / /__ _\\ \\  ", "blue");
    printLine("A!/___/  \\____/ \\___/  /___/  /_/ |_|/____//___/  ", "blue");
    printLine();
    printLine("A! - Twitter: [^https://twitter.com/daku_lol](DakuuLoL)");
    printLine("A! - YouTube: [^https://www.youtube.com/channel/UCLcRQAp7hgOwfuPFFQBr8lw](Daku)");
    printLine("A! - Twitch:  [^https://www.twitch.tv/dakustream](DakuStream)");
    printLine();
  }

  function parseURL(content) {
    while (content.indexOf("](") >= 0) {
      var NAMEregExp = /\(([^)]+)\)/;
      var uname = NAMEregExp.exec(content)[1];
      var URLregExp = /\[([^)]+)\]/;
      var url = URLregExp.exec(content)[1];
      var newpage = false;

      if (url[0] == "^") {
        newpage = true;
        url = url.substr(1);
      }

      var start = content.indexOf("[");
      var end = content.indexOf(")");

      if (newpage) {
        content = content.replace(content.substring(start, end + 1), "").splice(start, 0, '<a href="' + url + '" target="_blank"><b>' + uname + '</b></a>');
      } else {
        content = content.replace(content.substring(start, end + 1), "").splice(start, 0, '<a href="' + url + '"><b>' + uname + '</b></a>');
      }
    }

    return content;
  }

  function playVideo(yt_id, windowtitle) {
    var videoElement = '<div class="video-popup-model">' + '<div class="video-layer">' + '<div class="video-model-close-layer">' + '</div>' + '<div class="model-wrapper">' + '<div class="draggable">' + '<div class="handle">' + '<div class="buttons popupbuttons"><div class="first"></div><div class="second"></div><div class="third"></div></div><span class="title">' + windowtitle + '</span>' + '</div>' + '<div class="videomodel">' + '<div class="videoscreen">';
    videoElement += '<iframe width="100%" height="auto" class="videlement"' + 'src="https://www.youtube.com/embed/' + yt_id + '?rel=0&amp;controls=1&amp;showinfo=0&amp;autoplay=1' + '" frameborder="0"' + 'allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"' + 'allowfullscreen></iframe>' + '</div>';
    videoElement += '</div>' + '</div>' + '</div>' + '</div>' + '</div>';
    $(".video").append(videoElement);
    var videoWidth = $('.video-popup-model .videlement').width();
    var videHeight = 9 / 16 * videoWidth;
    $(".video-popup-model .videlement").height(videHeight);
    $(".video").find('.video-popup-model').addClass('smooth_show');
    $(".video").on('click', '.video-model-close-layer', function (event) {
      var model = $(this).parents('.video-popup-model');
      model.removeClass('smooth_show');
      setTimeout(function () {
        model.remove();
      }, 500);
      $(".video").removeClass('no-reload');
      inputbox.focus();
    });
    $(".video").on('click', ' .popupbuttons', function (event) {
      $(".video-model-close-layer").click();
    });
    $(document).on('keydown', function (event) {
      if (event.which == 27) {
        $(".video-model-close-layer").click();
      }
    });
    $(function () {
      $(".draggable").draggable({
        iframeFix: true,
        cursor: "grabbing",
        handle: ".handle"
      });
    });
  }

  function printLine(content, style, service, servicestyle) {
    if (content == null) {
      stream.append('<div class="line">' + '<p class="information">' + '<br/>' + '</p>' + '</div>');
      return;
    }

    if (content[0] == "A" && content[1] == "!") {
      content = content.substr(2);
      content = content.replace(/ /g, "\xA0");
      content = "<b>" + content + "</b>";
    }

    content = parseURL(content);

    if (service == null) {
      stream.append('<div class="line">' + '<p class="information" style="color:var(--color-' + style + ')">' + content + '</p>' + '</div>');
      return;
    }

    var d = new Date();
    var hours = (d.getHours() < 10 ? "0" : "") + d.getHours();
    var minutes = (d.getMinutes() < 10 ? "0" : "") + d.getMinutes();
    var seconds = (d.getSeconds() < 10 ? "0" : "") + d.getSeconds();
    if (service == "Info") service = "<b>" + service + "</b>";

    if (servicestyle == null) {
      switch (service) {
        case "Website":
          servicestyle = "red";
          break;

        case "Server":
          servicestyle = "darkblue";
          break;

        case "Client":
          servicestyle = "blue";
          break;

        case "User":
          servicestyle = "green";
          break;

        case "<b>Info</b>":
          servicestyle = "red";
          break;

        default:
          servicestyle = "";
      }
    } else {}

    stream.append('<div class="line">' + '<p class="time">[' + hours + ":" + minutes + ":" + seconds + ']</p>' + '<p class="name" style="color:var(--color-' + servicestyle + ')">' + service + '</p>' + '<p class="content" style="color:var(--color-' + style + ')">' + content + '</p>' + '</div>');
  }

  String.prototype.splice = function (idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
  };

  init();

  function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');

    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];

      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }

      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }

    return "";
  }

  var calc_input = "";
  var calc_result = "";

  function calc() {
    $('.num').click(function () {
      if (calc_result != "") {
        resetCalc();
      }

      calc_input += $(this).text();
      $('.calculator .input').text(calc_input);
    });
    $('.op').click(function () {
      if (calc_result != "") {
        calc_input = calc_result;
        calc_result = "";
        $('.calculator .result').html("<br>");
      }

      if (calc_input == "") return;
      calc_input += $(this).text();
      $('.calculator .input').text(calc_input);
    });
    $('.equals').click(function () {
      try {
        if (calc_input == "") {
          $('.calculator .result').html("<br>");
          return;
        }

        calc_result = eval(calc_input);
      } catch (e) {
        resetCalc();
        $('.calculator .result').text("Error!");
        return;
      }

      $('.calculator .result').text(calc_result);
    });
    $('#del').click(function () {
      if (calc_result != "") {
        resetCalc();
        return;
      }

      if (calc_input.length <= 1) {
        calc_input = "";
        $('.calculator .input').html("<br>");
        return;
      }

      calc_input = calc_input.substring(0, calc_input.length - 1);
      $('.calculator .input').text(calc_input);
    });
    $('#ac').click(function () {
      resetCalc();
    });
  }

  function setCookie(key, value) {
    var exp_date = new Date();
    exp_date.setTime(exp_date.getTime() + 10 * 365 * 24 * 60 * 1000);
    document.cookie = key + "=" + value + ";expires=" + exp_date.toUTCString();
    console.log("Cookie set. " + key + "=" + value);
  }

  function resetCalc() {
    console.log("Resetting calculator");
    calc_input = "";
    calc_result = "";
    $('.calculator .input').html("<br>");
    $('.calculator .result').html("<br>");
  }

  function initCalc() {
    $("#calc .window-content").height("auto");
    $('#calc .window').click(function () {
      return false;
    });
    $(".open-calculator").click(function () {
      var calcVisibility = document.getElementById("calc").style.getPropertyValue("display");
      var calcZ = $('#calc .window').css("z-index");

      if (calcVisibility == "block" && calcZ == "2") {
        $(".close-calculator").click();
      } else {
        document.getElementById("calc").style.setProperty("display", "block");
        windowUp($('#calc .window'));
      }
    });
    $(".close-calculator").click(function () {
      $('.window').css("z-index", 2);
      $('#calc .window').css("z-index", 1);
      document.getElementById("calc").style.setProperty("display", "none");
      resetCalc();
    });
    calc();
  }

  function initMail() {
    $(".open-mail").click(function () {
      var user = "daku.im";
      var service = "mail";
      var tld = "de";
      window.location.href = service + "to:" + user + "@" + service + "." + tld;
    });
  }

  function initTerminal() {
    $(".close-terminal").on('click', function (e) {
      $('.window').css("z-index", 2);
      $('#terminal').css("z-index", 1);
      document.getElementById("terminal").style.setProperty("visibility", "hidden");
    });
    $(".open-terminal").on('click', function (e) {
      var terminalVisibility = document.getElementById("terminal").style.getPropertyValue("visibility");
      var terminalZ = $('#terminal').css("z-index");

      if (terminalVisibility == "hidden" || terminalZ != "2") {
        document.getElementById("terminal").style.setProperty("visibility", "visible");
        inputbox.focus();
        windowUp($('#terminal'));
      } else {
        $(".close-terminal").click();
      }
    });
    var mousedown;
    $('.terminal').mousedown(function (event) {
      mousedown = event.timeStamp;
    });
    $('.terminal').mouseup(function (event) {
      if (event.timeStamp - mousedown <= 160) inputbox.focus();
    });
  }

  function initWindows() {
    $('.window-content').height($("body").height() * 0.7);
    $(function () {
      $('.window').draggable({
        containment: "parent",
        handle: ".handle",
        cursor: "grabbing",
        cancel: ".terminal",
        iframeFix: true
      });
    });
    $('.window').mousedown(function () {
      windowUp($(this));
    });
  }

  function windowUp(window) {
    $('.window').css("z-index", 1);
    window.css("z-index", 2);
  }
});