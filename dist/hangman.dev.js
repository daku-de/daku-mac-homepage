"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var words = ["Ethernet", "Agile", "Algorithm", "Processor", "Hangman", "Computer", "Database", "Coding", "Boolean", "Syntax", "Compiler", "Array", "JavaScript", "Python", "Software", "Interface", "Security", "Heuristic", "Pattern", "Integer", "Hardware", "Generalization", "Specialization", "Alan Turing", "Reverse Engineering", "Cloud Computing", "Big Data", "Recursion", "Machine Learning", "von Neumann architecture", "Race Condition", "Cryptography"];

var Hangman =
/*#__PURE__*/
function () {
  function Hangman() {
    _classCallCheck(this, Hangman);

    this.solved = false;
    this.index = Math.floor(Math.random() * words.length);
    this.word = words[this.index];
    this.guesses = [];
    this.misses = [];
    this.numMissed = 1;
  }

  _createClass(Hangman, [{
    key: "checkChar",
    value: function checkChar(c) {
      c = c.toLowerCase();
      var msg;
      if (c.length > 1) return this.checkWord(c);

      if (c.length != 1 || !c.match(/[a-z]/i)) {
        msg = "Only letters are allowed!";
      } else if (this.guesses.includes(c)) {
        msg = "You have already checked this letter!";
      } else if (this.misses.includes(c)) {
        msg = "You have already checked this letter!";
        this.numMissed++;
      } else if (this.word.toLowerCase().indexOf(c) != -1) {
        msg = "Good job. This letter is part of the word!";
        this.guesses.push(c);
      } else {
        msg = "The word doesn't contain this letter!";
        this.misses.push(c);
        this.numMissed++;
      }

      return msg;
    }
  }, {
    key: "checkWord",
    value: function checkWord(w) {
      var msg;

      if (this.word.toLowerCase() == w) {
        msg = "You guessed the word!";
        this.solved = true;
      } else {
        msg = "That is not the correct word!";
        this.numMissed++;
      }

      return msg;
    }
  }, {
    key: "getHangman",
    value: function getHangman() {
      var res = "";

      if (this.numMissed < 2) {
        res = res.concat("|       <br>");
      } else {
        res = res.concat("|  +==+  <br>");
      }

      if (this.numMissed < 3) {
        res = res.concat("|     |<br>");
      } else {
        res = res.concat("|  |  |<br>");
      }

      if (this.numMissed < 4) {
        res = res.concat("|     |<br>");
      } else {
        res = res.concat("|  o  |<br>");
      }

      if (this.numMissed < 5) {
        res = res.concat("|     |");
      } else if (this.numMissed < 6) {
        res = res.concat("|  |  |");
      } else if (this.numMissed < 7) {
        res = res.concat("| /|  |");
      } else {
        res = res.concat("| /|\\ |");
      }

      res = res.concat("<br>");

      if (this.numMissed < 8) {
        res = res.concat("|     |");
      } else if (this.numMissed < 9) {
        res = res.concat("| /   |");
      } else {
        res = res.concat("| / \\ |");
      }

      res = res.concat("   Not contained: ");
      this.misses.forEach(function (v, index) {
        if (index == 0) {
          res = res.concat(v);
        } else {
          res = res.concat(", ");
          res = res.concat(v);
        }
      });
      res = res.concat("<br>");
      res = res.concat("|_____|  ");
      res = res.concat("<br><br>");
      res = res.concat('Word: <b>');

      if (this.solved) {
        res = res.concat(this.word);
      } else {
        for (var i = 0; i < this.word.length; ++i) {
          if (this.guesses.includes(this.word.toLowerCase().charAt(i))) {
            res = res.concat(this.word.charAt(i));
          } else {
            if (this.word.toLowerCase().charAt(i) == " " || this.word.toLowerCase().charAt(i) == "-") {
              res = res.concat(this.word.toLowerCase().charAt(i));
            } else {
              res = res.concat("*");
            }
          }
        }
      }

      res = res.concat("</b>");
      res = res.replace(/ /g, "\xA0");
      return res;
    }
  }, {
    key: "win",
    value: function win() {
      if (this.solved) {
        words.splice(this.index, 1);
        return true;
      }

      for (var i = 0; i < this.word.length; ++i) {
        if (!this.guesses.includes(this.word.toLowerCase().charAt(i)) && this.word.toLowerCase().charAt(i) != " " && this.word.toLowerCase().charAt(i) != "-") {
          return false;
        }
      }

      this.solved = true;
      words.splice(this.index, 1);
      return true;
    }
  }, {
    key: "dead",
    value: function dead() {
      if (this.numMissed >= 9) {
        return true;
      } else {
        return false;
      }
    }
  }, {
    key: "getWord",
    value: function getWord() {
      return this.word;
    }
  }]);

  return Hangman;
}();

var round = 0;

function newHangmanGame() {
  var inputline = $(".inputline");
  var inputbox = $(".inputline .inputbox");
  var stream = $(".stream");

  if (words.length == 0) {
    stream.append('<div class="line">You managed to guess every word! Congratulations! There are no more words left!</div>');
    return;
  }

  round++;
  inputline.css("display", "none");
  var hangman = new Hangman();
  stream.append('<div class="line"><br></div>');
  stream.append("<div class=\"line\" style=\"font-size: 1.5em;\">Welcome to\xA0<span style=\"color: var(--color-logo); font-weight: bold;\"> Hangman</span>!</div>");
  stream.append('<div class="line">This is round number ' + round + '.</div>');
  stream.append('<div class="line">You can input single chars or guess for a complete word. Type ' + "'exit' to leave the game prematurely. </div>");
  stream.append('<div class="line"><br></div>');
  stream.append('<div class="line" id="hangmanOutput-' + round + '" style="display: inline-block;"></div>');
  stream.append('<div class="line"><br></div>');
  stream.append('<div class="line" id="hangmanAnswer-' + round + '"></div>');
  stream.append('<div class="line"><br></div>');
  stream.append('<div class="line hangman">Input:</div>');
  stream.append('<div class="line hangman hangmanInput" id="hangmanInput-' + round + '" contenteditable="true" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" autofocus="autofocus"></div>');
  var hangmanOutput = $("#hangmanOutput-" + round);
  var hangmanAnswer = $("#hangmanAnswer-" + round);
  var hangmanInput = $("#hangmanInput-" + round);
  hangmanInput.focus();
  setTimeout(function () {
    hangmanInput.text("");
  }, 1);
  hangmanOutput.html(hangman.getHangman());
  hangmanAnswer.html("Started a new round of Hangman!");
  hangmanInput.keydown(function (e) {
    var text = hangmanInput.text();

    if (e.which == 13) {
      if (text == "exit" || text == "quit" || text == "end") {
        $(".hangman").remove();
        hangmanAnswer.html("You left the game. You can start a new round.");
        inputline.css("display", "");
        inputbox.focus();
        setTimeout(function () {
          inputbox.html("");
        }, 1);
        return;
      }

      var answer = hangman.checkChar(text);
      hangmanAnswer.html(answer);
      hangmanOutput.html(hangman.getHangman());
      setTimeout(function () {
        hangmanInput.text("");
      }, 1);

      if (hangman.dead()) {
        $(".hangman").remove();
        hangmanAnswer.html("Sadly you were not able to find the correct word! The correct word was:\xA0<b>" + hangman.getWord() + "</b>");
        inputline.css("display", "");
        inputbox.focus();
        setTimeout(function () {
          inputbox.text("");
        }, 1);
      }

      if (hangman.win()) {
        $(".hangman").remove();
        hangmanAnswer.html("Congrats you guessed the word!");
        inputline.css("display", "");
        inputbox.focus();
        setTimeout(function () {
          inputbox.text("");
        }, 1);
      }
    }
  });
}