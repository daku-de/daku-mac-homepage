
$(document).ready(function(e) {

   var stream =$(".stream")
   var inputbox = $(".inputline .inputbox");
   var root = document.documentElement;
   
   console.clear();
   var commandlist = [
      ["help", "Show commands"],
      ["style", "Change the style of the console"],
      ["video", "Show youtube video"],
      ["echo", "Display given input"],
      ["socials", "Linktree to all of my socials"],
      ["fact", "Display a random fact"],
      ["clear", "Clear the console"],
      ["reset", "Reset the whole console"],
   ];
   var previouscommands = [];
   var currentcommand = 0;
   
   var terminalstyles = { //Custom Terminal Styles ([TerminalBackground, TerminalText, InputlineBackground])
      default: ["#3A3A3A", "#EFEFAE", "#262626"],
      hacker: ["#000000", "#0ed400","#000000"],
      white: ["#ffffff", "#000000", "#ffffff"],
      pink: ["#ffcbe4", "#df0069", "#ffa4cf"]
   };

   var pageindex = ["index", "about", "connect"];
   var currentpage = "landing";

   var facts = ["'rm -rf /' will close this website", "About 92% of the world’s currency exists only on hard drives", "The new Texas Instrument calculators have ABC keyboards as the standardised tool for tests", 
      "Sister Mary K. Keller was the first woman in the US to be awarded a PhD in Computer Science"];
   var url = "http://daku.im"

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
      setInterval(time);
      lastlogin();
      console.clear();
      console.log(new Date().getTime());
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
      printLine("You can use this interface just like a normal terminal!", "important", "<b>Info</b>", "red");
      printLine("For help type 'help'", "important", "<b>Info</b>", "red");
   }

   var timestring = "";
   var datestring = "";
   function time() {
      var d = new Date();

      var hours = d.getHours();
      var minutes = d.getMinutes();
      var seconds = d.getSeconds();
      var weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

      if (hours < 10) {
         hours = "0" + hours;
      }
      if (minutes < 10) {
         minutes = "0" + minutes;
      }
      if (seconds < 10) {
         seconds = "0" + seconds;
      }
     var temptimestring = "[" + hours + ":" + minutes + ":" + seconds + "]";
     var tempdatestring = "";
     if (hours > 12) {
         tempdatestring = weekdays[d.getDay()] + " " + (hours-12) + ":" + minutes + " PM"
     } else {
         tempdatestring = weekdays[d.getDay()] + " " + hours + ":" + minutes + " AM";
     }
	  if (temptimestring != timestring) {
        timestring = temptimestring;
        datestring = tempdatestring;
         $(".inputline .time").text(timestring);
         $(".date").text(datestring);
     }
   }

   inputbox.keydown(function(e) {
      var text = inputbox.text();
      console.log(e.which);
      if (e.which == 13) {
         var command = text.split(' ')[0];
         var output = "";

         text = text.replace(/</g, "&lt;");
         text = text.replace(/>/g, "&gt;");

         inputbox.text("");
         printLine(text, null, "User");
         if (text !== "") {
            previouscommands[currentcommand] = text;
            currentcommand = previouscommands.length;
            cmd(command, text);
         }
         //Remove newline
         setTimeout(() => {
            inputbox.text("");
         }, 1);

      }
      if (e.which == 38) { //previous command
         if (currentcommand > 0) {
            currentcommand--;
            inputbox.text(previouscommands[currentcommand]);
         }
      }
      if (e.which == 40) { //next command

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
            for (var i = 0; i < commandlist.length; i++) {
               output = commandlist[i][0] + " : " + commandlist[i][1];
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
            init();
            setStyle("default");
            break;

         case "video":
            var ID = "GgoGrwes4cA";
            var title = "YouTube-Video";
            
            playVideo(ID, title);
            break;
         
         case "fact":
            if (Math.random() < 0.2) {
               printLine(facts[0], null, "Fun Fact", "white");
            } else {
               printLine(facts[Math.floor(Math.random()*facts.length)], null, "Fun Fact", "white");
            }
            break;
         
         case "rm":
            var file = line.substr([line.split(' ')[0].length]);
            var sad_mac = "https://i.imgur.com/2uex9Hc.png";
            if (file.localeCompare("-rf /")) {
               console.log("Closing the page");
               $(".wrapper").addClass('macwrapper')
               $(".wrapper").append('<div class="macerror"></div>');
               setTimeout(func => {window.location.replace("https://www.google.com/");}, 4500);
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
                  printLine("Successfully changed style to: " + "'" + style + "'");
               }
            } else {
               printLine("Usage: style [style]");
               printLine("Available styles:");
               Object.keys(terminalstyles).forEach(style => printLine(style));
            }
            break;

         default:
            output = "Unrecognised command '" + command + "'.";
            printLine(output, null, "Client");
      }
   }

   function setStyle(style) {
      if (Object.keys(terminalstyles).indexOf(style) <= -1) {
         printLine("Style '" + style + "' not known");
         return;
      }
      root.style.setProperty('--terminal-background', terminalstyles[style][0]);
      root.style.setProperty('--terminal-text', terminalstyles[style][1]);
      root.style.setProperty('--terminal-inputline', terminalstyles[style][2]);

      return true;
   }

   var random_date;
   function lastlogin() { //generate Last Login message with random date (within last ten years)
      if (random_date == null) {
         var date = new Date();
         var start = new Date(date.getTime());
         start.setFullYear(start.getFullYear() - 10);
         random_date = new Date(start.getTime() + Math.random() * (date.getTime() - start.getTime()));
      }
      
      var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
      var weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

      var sec = random_date.getSeconds();
      var hour = random_date.getHours();
      var min = random_date.getMinutes();
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
      lastlogin += weekdays[random_date.getDay()] + " " + months[random_date.getMonth()] + " " + random_date.getDate() + " " + random_date.getFullYear() +  " " + hour + ":" + min + ":" + sec;
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
      printLine("A! - Twitch:  [^https://twitter.com/daku_lol](FatG_Daku)");
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
            content = content.replace(content.substring(start, end + 1), "").splice(start, 0, '<a href="' + url + '" target="_blank">' + uname + '</a>');
         } else {
            content = content.replace(content.substring(start, end + 1), "").splice(start, 0, '<a href="' + url + '">' + uname + '</a>');
         }
      }
      return content;
   }

   function playVideo(yt_id, windowtitle) {
      var videoElement = '<div class="video-popup-model">' + '<div class="video-layer">' + '<div class="video-model-close-layer">' + '</div>' + '<div class="model-wrapper">' + '<div class="draggable">' + '<div class="handle">' + '<div class="buttons popupbuttons"><div class="first"></div><div class="second"></div><div class="third"></div></div><span class="title">' + windowtitle +'</span>' + '</div>' + '<div class="videomodel">' + '<div class="videoscreen">';
      videoElement += '<iframe width="100%" height="auto" class="videlement"' + 'src="https://www.youtube.com/embed/' + yt_id + '?rel=0&amp;controls=1&amp;showinfo=0&amp;autoplay=1' + '" frameborder="0"' + 'allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"' + 'allowfullscreen></iframe>' + '</div>';
      videoElement += '</div>' + '</div>' + '</div>' + '</div>' + '</div>';
      $(".video").append(videoElement);
      var videoWidth = $('.video-popup-model .videlement').width();
      var videHeight = (9 / 16) * videoWidth;
      $(".video-popup-model .videlement").height(videHeight);
      $(".video").find('.video-popup-model').addClass('smooth_show');

      function closeVideo() {
         $(".video").on('click', '.video-model-close-layer', function(event) {
            var model = $(this).parents('.video-popup-model')
            model.removeClass('smooth_show');
            setTimeout(function() {
               model.remove();
            }, 500);
            $(".video").removeClass('no-reload');
         });
      }

      function buttonCloseVideo() {
         $(".video").on('click', ' .popupbuttons', function(event) {
            $( ".video-model-close-layer").click();
         })
      }

      $(function() {
      $(".draggable" ).draggable({
         iframeFix: true
      });
      } );

      closeVideo();
      buttonCloseVideo();
   }

   function printLine(content, style, service, servicestyle) {
      if (content == null) {
         stream.append('<div class="line">' +
            '<p class="information">' + '<br/>' + '</p>' +
            '</div>');
         return;
      }

      if (content[0] == "A" && content[1] == "!") {
         content = content.substr(2);
         content = content.replace(/ /g, '\u00A0');
      }

      content = parseURL(content);
      if (service == null) {
         stream.append('<div class="line">' +
            '<p class="information" style="color:var(--color-' + style + ')">' + content + '</p>' +
            '</div>');
         return;
      }

      var d = new Date();
      var hours = ((d.getHours() < 10) ? "0" : "") + d.getHours();
      var minutes = ((d.getMinutes() < 10) ? "0" : "") + d.getMinutes();
      var seconds = ((d.getSeconds() < 10) ? "0" : "") + d.getSeconds();

      if (servicestyle == null) {
         switch (service) {
            case "Website":
               servicestyle = "red";
               break;
            case "Server":
               servicestyle = "blue";
               break;
            case "Client":
               servicestyle = "blue";
               break;
            case "User":
               servicestyle = "green";
               break;
            default:
               servicestyle = "";
         }
      } else {
      }
      stream.append('<div class="line">' +
         '<p class="time">[' + hours + ":" + minutes + ":" + seconds + ']</p>' +
         '<p class="name" style="color:var(--color-'+ servicestyle +')">' + service + '</p>' +
         '<p class="content" style="color:var(--color-'+ style +')">' + content + '</p>' +
         '</div>');
      //$(document).scrollTop($(document).height() - $(window).height());
   }

   String.prototype.splice = function(idx, rem, str) {
         return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
      };
   init();
   
});