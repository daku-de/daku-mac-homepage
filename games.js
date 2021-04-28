let words = ["Ethernet", "Agile", "Algorithm", "Processor", "Hangman", "Computer", "Database", "Coding", "Boolean", "Syntax", "Compiler", "Array", "JavaScript", "Python",
"Software", "Interface", "Security", "Heuristic", "Pattern", "Integer", "Hardware", "Generalization", "Specialization", "Alan Turing", "Reverse Engineering", "Cloud Computing",
"Big Data", "Recursion", "Machine Learning", "von Neumann architecture", "Race Condition", "Cryptography"];

let inputline;
let inputbox;
let stream;

function ordinal_suffix(n) {
    let od = n%10, td = Math.floor((n%100)/10);
    if (td == 1) return n + "th";
    if (od == 1) return n + "st";
    if (od == 2) return n + "nd";
    if (od == 3) return n + "rd";
    return n + "th";
}

class Game {

    constructor(name) {
        this.name = name;
        this.numMissed = 0;
        this.round = 0;
        this.solved = false;
        this.over = false;
    }

    static initNewRound(obj) {
        obj.round++;
        inputline.css("display", "none");
        stream.append('<div class="line"><br></div>');
        stream.append('<div class="line" style="font-size: 1.5em;">Welcome to\u00A0<span style="color: var(--color-' + obj.color + '); font-weight: bold;">' + obj.name.replace(/^./, obj.name[0].toUpperCase()) + '</span>!</div>');
        stream.append('<div class="line">This is your ' + ordinal_suffix(obj.round)  + ' round.</div>');
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
        setTimeout(() => {
            obj.input.text("");
        }, 1);

        obj.output.html(obj.getOutput());
        obj.answer.html("Started a new round of " + obj.name.replace(/^./, obj.name[0].toUpperCase()) + "!");

        obj.input.keydown((e) => {
            if (e.which != 13) return;
            let input = obj.input.text();

            if (input == "exit" || input == "quit" || input == "end") {
                Game.endRound(obj);
                obj.over = true;
                obj.output.html(obj.getOutput());
                obj.answer.html("You left the game. You can start a new round.");
                return;
            }
            obj.answer.html(obj.guess(input));
            obj.output.html(obj.getOutput());
            setTimeout(() => {
                obj.input.text("");
            }, 1);

            if (obj.roundOver()) {
                Game.endRound(obj);
            }
        });
    }

    static endRound(obj) {
        $("." + obj.name).remove();
        obj.answer.html(obj.roundOverMessage());
        inputline.css("display", "");
        inputbox.focus();
        setTimeout(() => {
            inputbox.html("");
        }, 1);
    }
}

class Hangman extends Game {
    
    constructor() {
        super("Hangman");
        this.index = Math.floor(Math.random() * words.length);
        this.word = words[this.index];
        this.guesses = [];
        this.misses = [];
        this.numMissed = 1;
        this.color = "red";
        this.msg = "You can input single chars or guess for a complete word.";
    }

    newGame() {
        this.index = Math.floor(Math.random() * words.length);
        this.word = words[this.index];
        this.guesses = [];
        this.misses = [];
        this.numMissed = 1;
        this.solved = false;
        this.over = false;
        Game.initNewRound(this);
    }

    guess(c) {
        c = c.toLowerCase();
        let msg;
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

    checkWord(w) {
        let msg;
        if (this.word.toLowerCase() == w) {
            msg = "You guessed the word!"
            this.solved = true;
            this.over = true;
        } else {
            msg = "That is not the correct word!";
            this.numMissed++;
        }
        return msg;
    }

    getOutput() {
        let res = "";

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
        this.misses.forEach((v, index) => {
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
            for (let i = 0; i < this.word.length; ++i) {
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
        res = res.replace(/ /g, "\u00A0");
        return res;
    }

    roundOver() {
        return this.win() || this.dead();
    }

    roundOverMessage() {
        if (this.win()) return "Congrats you guessed the word!";
        return "Sadly you were not able to find the correct word! The correct word was:\u00A0<b>" + hangman.getWord() + "</b>";

    }

    win() {
        if (this.solved) {
            words.splice(this.index, 1);
            return true;
        }
        for (let i = 0; i < this.word.length; ++i) {
            if (!this.guesses.includes(this.word.toLowerCase().charAt(i)) && this.word.toLowerCase().charAt(i) != " " && this.word.toLowerCase().charAt(i) != "-") {
                return false;
            }
        }
        this.solved = true;
        this.over = true;
        words.splice(this.index, 1);
        return true;
    }

    dead() {
        if (this.numMissed >= 9) {
            return true;
        } else {
            return false;
        }
    }

    getWord() {
        return this.word;
    }
}

class HigherLower extends Game {

    constructor() {
        super("HigherLower");
        this.guesses = [];
        this.number = Math.floor(Math.random()*101);
        this.color = "blue";
        this.msg = "You can input a number between 0 and 100, both included.";
    }

    newGame() {
        this.number = Math.floor(Math.random()*101);
        this.guesses = [];
        this.numMissed = 0;
        this.solved = false;
        this.over = false;
        console.log(this.number);

        Game.initNewRound(this);
    }

    guess(n) {
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

    getOutput() {
        let res;
        if (this.roundOver()) return '<span style="font-size: 2em;">The number was ' + this.number + '.</span>';
        if (this.guesses.length == 0) res = "Make a guess!";
        let n = this.guesses[this.guesses.length-1];
        if (n > this.number) res = n + " > ?";
        if (n < this.number) res = n + " < ?";
        if (n == this.number) res = n + " = " + this.number;
        return '<span style="font-size: 4em;">' + res + '</span>';
    }

    roundOver() {
        return this.solved || this.over;
    }

    roundOverMessage() {
        if (this.numMissed == 1) return "Congratulations! You guessed the right number on your first try! Impressive!";
        if (this.numMissed < 5) return "Good job. You guessed the number! It took you\u00A0<b>" + this.numMissed + "</b>\u00A0tries. That's pretty good.";
        if (this.numMissed <= 10) return "You guessed the number after\u00A0<b>" + this.numMissed + "</b>\u00A0tries.";
        return "It took you\u00A0<b>" + this.numMissed + "</b>\u00A0tries to guess the correct number. Play a new round, I'm sure you can do better!";
    }


}

const hangman = new Hangman();
const hlgame = new HigherLower();

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
    }
}