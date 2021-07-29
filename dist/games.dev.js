"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var words = ["Agile", "Alan Turing", "Algorithm", "Array", "Big Data", "Boolean", "Cloud Computing", "Coding", "Compiler", "Computer", "Cryptography", "Database", "Data Lake", "Data Warehouse", "Ethernet", "Fibonacci", "Generalization", "Hangman", "Hardware", "Heuristic", "Integer", "Interface", "JavaScript", "Machine Learning", "Metadata", "Pattern", "Processor", "Python", "Race Condition", "Recursion", "Repository", "Reverse Engineering", "Security", "Semaphore", "Software", "Specialization", "Syntax", "von Neumann architecture"];
var inputline;
var inputbox;
var stream;

function ordinal_suffix(n) {
  var od = n % 10,
      td = Math.floor(n % 100 / 10);
  if (td == 1) return n + "th";
  if (od == 1) return n + "st";
  if (od == 2) return n + "nd";
  if (od == 3) return n + "rd";
  return n + "th";
}

var Game =
/*#__PURE__*/
function () {
  function Game(name) {
    _classCallCheck(this, Game);

    this.name = name;
    this.numMissed = 0;
    this.round = 0;
    this.solved = false;
    this.over = false;
  }

  _createClass(Game, null, [{
    key: "initNewRound",
    value: function initNewRound(obj) {
      obj.round++;
      inputline.css("display", "none");
      stream.append('<div class="line"><br></div>');
      stream.append("<div class=\"line\" style=\"font-size: 1.5em;\">Welcome to\xA0<span style=\"color: var(--color-" + obj.color + '); font-weight: bold;">' + obj.name.replace(/^./, obj.name[0].toUpperCase()) + '</span>!</div>');
      stream.append('<div class="line">This is your ' + ordinal_suffix(obj.round) + ' round.</div>');
      stream.append('<div class="line">' + obj.msg + ' Type ' + "'exit' to leave the game prematurely. </div>");
      stream.append('<div class="line"><br></div>');
      stream.append('<div class="line" id="' + obj.name + 'Output-' + obj.round + '" style="display: inline-block;"></div>');
      stream.append('<div class="line"><br></div>');
      stream.append('<div class="line" id="' + obj.name + 'Answer-' + obj.round + '"></div>');
      stream.append('<div class="line"><br></div>');
      stream.append('<div class="line ' + obj.name + '">Input:</div>');
      stream.append('<div class="line ' + obj.name + ' customInput" id="' + obj.name + 'Input-' + obj.round + '" contenteditable="true" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"></div>');
      obj.output = $("#" + obj.name + "Output-" + obj.round);
      obj.answer = $("#" + obj.name + "Answer-" + obj.round);
      obj.input = $("#" + obj.name + "Input-" + obj.round);
      obj.input.focus();
      setTimeout(function () {
        obj.input.text("");
      }, 1);
      obj.output.html(obj.getOutput());
      obj.answer.html("Started a new round of " + obj.name.replace(/^./, obj.name[0].toUpperCase()) + "!");
      obj.input.keydown(function (e) {
        if (e.which != 13) return;
        var input = obj.input.text();

        if (input == "exit" || input == "quit" || input == "end") {
          Game.endRound(obj);
          obj.over = true;
          obj.output.html(obj.getOutput());
          obj.answer.html("You left the game. You can start a new round.");
          return;
        }

        obj.answer.html(obj.guess(input));
        obj.output.html(obj.getOutput());
        setTimeout(function () {
          obj.input.text("");
        }, 1);

        if (obj.roundOver()) {
          Game.endRound(obj);
        }
      });
    }
  }, {
    key: "endRound",
    value: function endRound(obj) {
      $("." + obj.name).remove();
      obj.answer.html(obj.roundOverMessage());
      inputline.css("display", "");
      inputbox.focus();
      setTimeout(function () {
        inputbox.html("");
      }, 1);
    }
  }]);

  return Game;
}();

var Hangman =
/*#__PURE__*/
function (_Game) {
  _inherits(Hangman, _Game);

  function Hangman() {
    var _this;

    _classCallCheck(this, Hangman);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Hangman).call(this, "Hangman"));
    _this.index = Math.floor(Math.random() * words.length);
    _this.word = words[_this.index];
    _this.guesses = [];
    _this.misses = [];
    _this.numMissed = 1;
    _this.color = "red";
    _this.msg = "You can input single chars or guess for a complete word.";
    return _this;
  }

  _createClass(Hangman, [{
    key: "newGame",
    value: function newGame() {
      this.index = Math.floor(Math.random() * words.length);
      this.word = words[this.index];
      this.guesses = [];
      this.misses = [];
      this.numMissed = 1;
      this.solved = false;
      this.over = false;
      Game.initNewRound(this);
    }
  }, {
    key: "guess",
    value: function guess(c) {
      c = c.toLowerCase();
      c = c.replace(new RegExp(String.fromCharCode(160), "g"), "");
      c = c.replace(/ +/g, " ");
      c = c.replace(/ $/g, "");
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

      if (!w.match(/^[a-z ]*$/)) {
        msg = "Your answer contains invalid characters. Only letters are allowed!";
      } else if (this.word.toLowerCase() == w) {
        msg = "You guessed the word!";
        this.solved = true;
        this.over = true;
      } else {
        msg = "That is not the correct word!";
        this.numMissed++;
      }

      return msg;
    }
  }, {
    key: "getOutput",
    value: function getOutput() {
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
    key: "roundOver",
    value: function roundOver() {
      return this.win() || this.dead();
    }
  }, {
    key: "roundOverMessage",
    value: function roundOverMessage() {
      if (this.win()) return "Congrats you guessed the word!";
      return "Sadly you were not able to find the correct word! The correct word was:\xA0<b>" + hangman.getWord() + "</b>";
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
      this.over = true;
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
}(Game);

var HigherLower =
/*#__PURE__*/
function (_Game2) {
  _inherits(HigherLower, _Game2);

  function HigherLower() {
    var _this2;

    _classCallCheck(this, HigherLower);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(HigherLower).call(this, "HigherLower"));
    _this2.guesses = [];
    _this2.number = Math.floor(Math.random() * 101);
    _this2.color = "blue";
    _this2.msg = "You can input a number between 0 and 100, both included.";
    return _this2;
  }

  _createClass(HigherLower, [{
    key: "newGame",
    value: function newGame() {
      this.number = Math.floor(Math.random() * 101);
      this.guesses = [];
      this.numMissed = 0;
      this.solved = false;
      this.over = false;
      console.log(this.number);
      Game.initNewRound(this);
    }
  }, {
    key: "guess",
    value: function guess(n) {
      if (!/^\d+$/.test(n) || n > 100 || n < 0) return "Invalid input. Enter a number between 0 and 100, both included.";
      this.guesses.push(n);
      this.numMissed++;

      if (n < this.number) {
        return "The number is too low!";
      } else if (n > this.number) {
        return "The number is too high!";
      } else {
        this.solved = true;
        this.over = true;
      }
    }
  }, {
    key: "getOutput",
    value: function getOutput() {
      var res;
      if (this.roundOver()) return '<span style="font-size: 2em;">The number was ' + this.number + '.</span>';
      if (this.guesses.length == 0) res = "Make a guess!";
      var n = this.guesses[this.guesses.length - 1];
      if (n > this.number) res = n + " > ?";
      if (n < this.number) res = n + " < ?";
      if (n == this.number) res = n + " = " + this.number;
      return '<span style="font-size: 4em;">' + res + '</span>';
    }
  }, {
    key: "roundOver",
    value: function roundOver() {
      return this.solved || this.over;
    }
  }, {
    key: "roundOverMessage",
    value: function roundOverMessage() {
      if (this.numMissed == 1) return "Congratulations! You guessed the right number on your first try! Impressive!";
      if (this.numMissed < 5) return "Good job. You guessed the number! It took you\xA0<b>" + this.numMissed + "</b>\xA0tries. That's pretty good.";
      if (this.numMissed <= 10) return "You guessed the number after\xA0<b>" + this.numMissed + "</b>\xA0tries.";
      return "It took you\xA0<b>" + this.numMissed + "</b>\xA0tries to guess the correct number. Play a new round, I'm sure you can do better!";
    }
  }]);

  return HigherLower;
}(Game);

var Anagrams =
/*#__PURE__*/
function (_Game3) {
  _inherits(Anagrams, _Game3);

  function Anagrams(sec) {
    var _this3;

    _classCallCheck(this, Anagrams);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(Anagrams).call(this, "Anagrams"));
    _this3.time = sec;
    var i = 30;
    var timer = setInterval(function () {
      //console.log(i);
      i = i - 1;
      if (i <= -1) clearInterval(timer);
    }, 1000);
    return _this3;
  }

  _createClass(Anagrams, [{
    key: "newGame",
    value: function newGame() {}
  }, {
    key: "guess",
    value: function guess() {}
  }, {
    key: "getOutput",
    value: function getOutput() {}
  }, {
    key: "roundOver",
    value: function roundOver() {}
  }, {
    key: "roundOverMessage",
    value: function roundOverMessage() {}
  }]);

  return Anagrams;
}(Game);

var hangman = new Hangman();
var hlgame = new HigherLower();
var anagrams = new Anagrams(45);

function newGame(name) {
  stream = $(".stream");
  inputbox = $(".inputline .inputbox");
  inputline = $(".inputline");
  name = name.toLowerCase();

  switch (name) {
    case "hangman":
      hangman.newGame();
      break;

    case "hlgame":
      hlgame.newGame();
      break;

    case "anagrams":
      anagrams.newGame();
      break;
  }
}