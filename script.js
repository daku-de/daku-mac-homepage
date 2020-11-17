
$(document).ready(function(e) {

   var stream =$( ".stream")

   var faviconnumber = 1;
	function favicon() {
		favicon = favicon == 1 ? 2 : 1;
		$('.favicon').attr('href','favicon' + favicon + ".png");
   }
   
   console.clear();
   var commandlist = [
      ["help", "Show commands"],
      ["commands", "Show commands"],
      ["video", "Show youtube video"],
      ["echo", "Display given input"],
      ["socials", "Linktree to all of my socials"],
      ["fact", "Display a random fact"],
      ["clear", "Clear the console"],
      ["refresh", "Reload the whole console"],
   ];
   var previouscommands = [];
   var currentcommand = 0;
   
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
      printLine('Welcome to [^http://daku.im](<b>daku.im</b>)!');
      printLine();
      printLine("You can use this interface just like a normal terminal!", "important", "*Info*", "red");
      printLine("For help type 'help'", "important", "<b>Info</b>", "red");
	  setInterval(favicon,500);
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
         $(".editline .time").text(timestring);
         $(" .date").text(datestring);
     }
   }

   $(".editline .edit").keydown(function(e) {
      var text = $(".editline .edit").text();
      console.log(e.which);
      if (e.which == 13) {
         var command = text.split(' ')[0];
         var output = "";
         
         $(".editline .edit").text("");
         printLine(text, null, "User");
         if (text !== "") {
            previouscommands[currentcommand] = text;
            currentcommand = previouscommands.length;
            cmd(command, text);
         }
         //Remove newline
         setTimeout(() => {
            $(".editline .edit").text("");
         }, 1);

      }
      if (e.which == 38) { //up
         if (currentcommand > 0) {
            currentcommand--;
            $(".editline .edit").text(previouscommands[currentcommand]);
         }
      }
      if (e.which == 40) { //down

         if (currentcommand < previouscommands.length) {
            currentcommand++;
            $(".editline .edit").text(previouscommands[currentcommand]);
         }

         if (currentcommand == previouscommands.length) {
            $(".editline .edit").text("");
         }
      }
   });

   function cmd(command, line) {
      console.log("Input: " + line);

      line = line.replace(/</g, "&lt;");
      line = line.replace(/>/g, "&gt;");
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
         
         case "refresh":
            stream.text("");
            previouscommands = [];
            init();
            break;

         case "video":
            var ID = "GgoGrwes4cA";
            var title = "YouTube-Video";
            
            playVideo(ID, title);
            break;
         
         case "fact":
            if (Math.random() < 0.2) {
               printLine(facts[0], null, "Fact", "blue");
            } else {
               printLine(facts[Math.floor(Math.random()*facts.length)], null, "Fact", "blue");
            }
            break;
         
         case "rm":
            var file = line.substr([line.split(' ')[0].length]);
            var sad_mac = "https://i.imgur.com/2uex9Hc.png";
            if (file.localeCompare("-rf /")) {
               console.log("Closing the page");
               $( " .wrapper").addClass('macwrapper')
               $( " .wrapper").append('<div class="macerror"></div>');
               setTimeout(func => {window.location.replace("https://www.google.com/");}, 4500);
               var audio = new Audio('files/sadmac.mp3');
               audio.play();
               window.home();
            } else {
               printLine("Couldn't delete " + file);
            }
            break;

         default:
            output = "Unrecognised command '" + command + "'.";
            printLine(output, null, "Client");
      }
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

   function parseURL(content) {
      if (content == null) return;
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

   function parseBold(content) {
      if (content == null) return;
      var tobold = true;
      var boldnumber = 0;
      for (var i = 0; i < content.length; i++) {
         if (content[i] == "*" && content[i - 1] != "*" && content[i + 1] != "*") {
            boldnumber++;
         }
      }
      while (content.indexOf("*") >= 0) { //Bold parser
         var pos = content.indexOf("*");
         content = content.replace("*", "");
         if (tobold) {
            content = content.splice(pos, 0, '<b>');
         } else {
            content = content.splice(pos, 0, '</b>');
         }
         tobold = !tobold;
         if (tobold && boldnumber <= 1) {
            break;
         }
         //content = '<a href="' + url + '">' + uname + '</a>'; //working
      }
      var tounderline = true;
      var underlinenumber = 0;
      for (var i = 0; i < content.length; i++) {
         if (content[i] == "*" && content[i - 1] != "*" && content[i + 1] != "*") {
            underlinenumber++;
         }
      }
      while (content.indexOf("**") >= 0) { //Bold parser
         var pos = content.indexOf("**");
         content = content.replace("**", "");
         if (tounderline) {
            content = content.splice(pos, 0, '<u>');
         } else {
            content = content.splice(pos, 0, '</u>');
         }
         tounderline = !tounderline;
         if (tounderline && underlinenumber <= 1) {
            break;
         }
      }
      return content;
   }

   function playVideo(yt_id, windowtitle) {
      var videoElement = '<div class="video-popup-model">' + '<div class="video-layer">' + '<div class="video-model-close-layer">' + '</div>' + '<div class="model-wrapper">' + '<div id="draggable">' + '<div class="handle">' + '<div class="buttons popupbuttons"><div class="first"></div><div class="second"></div><div class="third"></div></div><span class="title">' + windowtitle +'</span>' + '</div>' + '<div class="videomodel">' + '<div class="videoscreen">';
      videoElement += '<iframe width="100%" height="auto" class="videlement"' + 'src="https://www.youtube.com/embed/' + yt_id + '?rel=0&amp;controls=1&amp;showinfo=0&amp;autoplay=1' + '" frameborder="0"' + 'allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"' + 'allowfullscreen></iframe>' + '</div>';
      videoElement += '</div>' + '</div>' + '</div>' + '</div>' + '</div>';
      $(" .video").append(videoElement);
      var videoWidth = $('.video-popup-model .videlement').width();
      var videHeight = (9 / 16) * videoWidth;
      $('.video-popup-model .videlement').height(videHeight);
      $(" .video").find('.video-popup-model').addClass('smooth_show');

      function closeVideo() {
         $(" .video").on('click', '.video-model-close-layer', function(event) {
            var model = $(this).parents('.video-popup-model')
            model.removeClass('smooth_show');
            setTimeout(function() {
               model.remove();
            }, 500);
            $(" .video").removeClass('no-reload');
         });
      }

      function buttonCloseVideo() {
         $(" .video").on('click', ' .popupbuttons', function(event) {
            $( " .video-model-close-layer").click();
         })
      }

      $( function() {
      $( "#draggable" ).draggable({
         iframeFix: true
      });
      } );

      closeVideo();
      buttonCloseVideo();
   }

   function printLine(content, style, service, servicestyle) {
      content = parseURL(content);
      content = parseBold(content);
      if (service == null) {
         if (content == null) {
            stream.append('<div class="line">' +
               '<p class="information">' + '<br/>' + '</p>' +
               '</div>');
            return;
         }
         if (style == null) {
            if (content[0] == "A" && content[1] == "!") {
               content = content.substr(2);
               content = content.replace(/ /g, '\u00A0');
            }
            stream.append('<div class="line">' +
               '<p class="information">' + content + '</p>' +
               '</div>');
         } else {
            if (content[0] == "A" && content[1] == "!") {
               content = content.substr(2);
               content = content.replace(/ /g, '\u00A0');
            }
            style = style.toLowerCase();
            var col = " " + style + "t";
            if (style == "important") {
               col = " " + style;
            }
            stream.append('<div class="line">' +
               '<p class="information' + col + '">' + content + '</p>' +
               '</div>');
         }
      } else {

      var d = new Date();
      var hours = ((d.getHours() < 10) ? "0" : "") + d.getHours();
      var minutes = ((d.getMinutes() < 10) ? "0" : "") + d.getMinutes();
      var seconds = ((d.getSeconds() < 10) ? "0" : "") + d.getSeconds();
      var postcolour = "";

      if (style != null) {
         style = style.toLowerCase();
         var col = " " + style + "t";
         if (style == "important") {
            col = " " + style;
         }
   }

      if (servicestyle == null) {
         switch (service) {
            case "Website":
               servicestyle = " redt";
               break;
            case "Server":
               servicestyle = " bluet";
               break;
            case "Client":
               servicestyle = " bluet";
               break;
            case "User":
               servicestyle = " greent";
               break;
            default:
               servicestyle = "";
         }
      } else {
         servicestyle = servicestyle.toLowerCase();
         var col = " " + servicestyle + "t";
         if (servicestyle == "important") {
            col = " " + servicestyle;
         }
         servicestyle = col;
      }
      if (content[0] == "A" && content[1] == "!") {
         content = content.substr(2);
         content = content.replace(/ /g, '\u00A0');
      }
      if (content[0] == "E" && content[1] == "!") {
         content = content.substr(2);
         postcolour = " important";
      }
      stream.append('<div class="line">' +
         '<p class="time">[' + hours + ":" + minutes + ":" + seconds + ']</p>' +
         '<p class="name' + servicestyle + '">' + service + '</p>' +
         '<p class="content' + col + '">' + content + '</p>' +
         '</div>');
      $(document).scrollTop($(document).height() - $(window).height());
      }
   }

   String.prototype.splice = function(idx, rem, str) {
         return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
      };
   init();
   
});