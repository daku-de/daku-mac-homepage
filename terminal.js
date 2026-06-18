class Terminal {
    constructor() {
        this.stream = document.querySelector(".stream");
        this.inputbox = document.getElementById("terminalinput");

        this.previousCommands = [];
        this.currentCommandIndex = 0;
        this.readFacts = [];
        this.radioPlaying = false;
        this.radio = document.getElementById("radio");
        if (this.radio) this.radio.volume = 0.03;

        this.commandHelpData = {
            shell: [
                ["help", "Show help for a specific topic", "<topic>"],
                ["commands", "List all commands", ""],
                ["clear", "Clear the console", ""],
                ["reset", "Reset the whole page", ""],
            ],
            about: [
                ["video", "Show youtube video", ""],
                ["socials", "Linktree to all of my socials", ""],
            ],
            features: [
                ["hangman", "Start a game of hangman", ""],
                ["wiki", "Get information about a specific topic", "<topic>"],
                ["hlgame", "Start a game of HigherLower", ""],
                [
                    "guestbook",
                    "Adds/Displays names in the guest book",
                    "[name]",
                ],
                ["echo", "Display given input", ""],
                ["calc", "Opens the calculator", ""],
                ["mail", "Opens the contact form", ""],
                ["radio", "Listen to ILoveRadio.de", "<volume|pause>"],
                ["fact", "Displays a random fact", ""],
            ],
            layout: [
                ["style", "Change the look of the console", ""],
                ["background", "Choose a different background image", ""],
            ],
            filesystem: [
                [
                    "tree",
                    "Prints directory structure in the form of a tree",
                    "",
                ],
                ["pwd", "Print name of current directory", ""],
                ["ls", "List contents of the current directory", ""],
                ["cd", "Change the current directory", "<directory>"],
                ["mkdir", "Create a new directory", "<directory-name>"],
                [
                    "create",
                    "Create a file with custom content",
                    "<file-name> <content>",
                ],
                ["touch", "Create an empty file", "<file-name>"],
                ["cat", "Print contents of a file", "<file>"],
                ["rm", "Remove a file or directory", "<name>"],
            ],
        };

        this.facts = [
            "'rm -rf /' will close this website",
            "About 92% of the world’s currency exists only on hard drives",
            "The new Texas Instrument calculators have ABC keyboards as the standardised tool for tests",
            "Sister Mary K. Keller was the first woman in the US to be awarded a PhD in Computer Science",
            "Solving one of the remaining six Millennium Prize Problems will award you 1 million USD",
            "The first hard disk drive, the IBM Model 350, stored 3.75 MB of data",
        ];

        this.commands = {
            help: (args) => this.help(args[0]),
            commands: () => this.help("commands"),
            echo: (args, rawLine) => {
                let out = rawLine.substr(rawLine.split(" ")[0].length).trim();
                this.printLine(out);
            },
            clear: () => {
                this.stream.innerHTML = "";
            },
            reset: () => {
                this.stream.innerHTML = "";
                this.previousCommands = [];
                this.printTerminalWelcome();
            },
            video: () => playVideo("LXb3EKWsInQ", "Placeholder"),
            fact: () => this.printFact(),
            wiki: (args) => this.fetchWiki(args),
            hangman: () => newGame("hangman"),
            hlgame: () => newGame("hlgame"),
            radio: (args) => this.handleRadio(args),
            calc: () => document.querySelector(".open-calculator").click(),
            math: () => document.querySelector(".open-calculator").click(),
            mail: () => document.querySelector(".open-mail").click(),
            email: () => document.querySelector(".open-mail").click(),
            contact: () => document.querySelector(".open-mail").click(),
            guestbook: (args) => this.handleGuestbook(args),
            wallpaper: () => showBackgrounds(),
            background: () => showBackgrounds(),
            socials: () => this.printSocials(),
            style: (args) => {
                if (args.length === 1 && setStyle(args[0].toLowerCase())) {
                    this.printLine(
                        `Successfully changed style to: '<b>${args[0]}</b>'`,
                    );
                } else {
                    this.printLine("Usage: style &lt;style&gt;");
                }
            },
            pwd: () => this.printLine(dir.getDirectory()),
            tree: () => this.printLine(fs_root.getString()),
            ls: (args) => this.handleLs(args),
            cd: (args) => this.handleCd(args),
            mkdir: (args) => this.handleMkdir(args),
            touch: (args) => this.handleTouch(args),
            create: (args, rawLine) => this.handleCreate(args, rawLine),
            cat: (args) => this.handleCat(args),
            rm: (args) => this.handleRm(args),
            kappa: () =>
                this.printLine(
                    '<img src="https://img.redbull.com/images/c_fill,g_auto,w_1030,h_1030/q_auto,f_auto/redbullcom/2017/06/19/2a7635e1-c005-4a7a-a707-3238f36ccc00/kappa-twitch.png" width="60" height="60">',
                ),
            kekw: () =>
                this.printLine(
                    '<img src="https://www.streamscheme.com/wp-content/uploads/2020/07/kekw-emote.jpg" width="60" height="60">',
                ),
        };

        this.init();
    }

    init() {
        this.inputbox.addEventListener("keydown", (e) => this.handleKeydown(e));

        document
            .querySelector(".close-terminal")
            ?.addEventListener("click", () => {
                closeWindow(document.getElementById("terminal"));
            });

        document
            .querySelector(".open-terminal")
            ?.addEventListener("click", () => {
                var zindex = document.getElementById("terminal").style.zIndex;
                if (zindex != String(openedwindows.length) || zindex == "0") {
                    windowOnTop(document.getElementById("terminal"));
                    this.inputbox.focus();
                } else {
                    document.querySelector(".close-terminal").click();
                }
            });

        let mousedownTime;
        document
            .querySelector(".terminal")
            .addEventListener(
                "mousedown",
                (e) => (mousedownTime = e.timeStamp),
            );
        document.querySelector(".terminal").addEventListener("mouseup", (e) => {
            if (e.timeStamp - mousedownTime <= 160) this.inputbox.focus();
        });

        this.printTerminalWelcome();
    }

    handleKeydown(e) {
        let text = this.inputbox.innerText;

        if (e.key === "Enter") {
            e.preventDefault();
            text = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");

            this.printLine(text, null, "User");

            if (text.trim() !== "") {
                this.previousCommands.push(text);
                this.currentCommandIndex = this.previousCommands.length;
                this.executeCommand(text);
            }

            setTimeout(() => (this.inputbox.innerText = ""), 1);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (this.currentCommandIndex > 0) {
                this.currentCommandIndex--;
                this.inputbox.innerText =
                    this.previousCommands[this.currentCommandIndex];
            }
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            if (this.currentCommandIndex < this.previousCommands.length - 1) {
                this.currentCommandIndex++;
                this.inputbox.innerText =
                    this.previousCommands[this.currentCommandIndex];
            } else {
                this.currentCommandIndex = this.previousCommands.length;
                this.inputbox.innerText = "";
            }
        } else if (e.key === "Tab") {
            e.preventDefault();
            this.handleTabCompletion();
        }
    }

    executeCommand(line) {
        console.log("Input: " + line);

        let cleanLine = line.replace(
            new RegExp(String.fromCharCode(160), "g"),
            " ",
        );
        let args = cleanLine.split(" ").filter((e) => e !== "");
        let commandName = args.shift().toLowerCase().replace(/\//g, "");

        if (this.commands[commandName]) {
            try {
                this.commands[commandName](args, cleanLine);
            } catch (err) {
                console.error("Command Execution Error:", err);
                this.printLine(
                    "An error occurred executing that command.",
                    null,
                    "Server",
                );
            }
        } else {
            this.printLine(
                `Unrecognised command '${commandName}'.`,
                null,
                "Client",
            );
        }
    }

    printLine(content, style, service, servicestyle) {
        if (!content && !service) {
            this.stream.insertAdjacentHTML(
                "beforeend",
                '<div class="line"><p class="information"><br/></p></div>',
            );
            return;
        }

        if (content.startsWith("A!")) {
            content =
                "<b>" + content.substr(2).replace(/ /g, "\u00A0") + "</b>";
        }

        content = this.parseURL(content);

        if (!service) {
            this.stream.insertAdjacentHTML(
                "beforeend",
                `<div class="line"><p class="information" style="color:var(--color-${style})">${content}</p></div>`,
            );
            return;
        }

        let d = new Date();
        let hours = String(d.getHours()).padStart(2, "0");
        let minutes = String(d.getMinutes()).padStart(2, "0");
        let seconds = String(d.getSeconds()).padStart(2, "0");

        if (service === "Info") service = "<b>Info</b>";

        if (!servicestyle) {
            const styles = {
                Website: "red",
                Server: "darkblue",
                Client: "blue",
                User: "green",
                "<b>Info</b>": "red",
            };
            servicestyle = styles[service] || "";
        }

        let html = `
            <div class="line">
                <p class="time">[${hours}:${minutes}:${seconds}]</p>
                <p class="name" style="color:var(--color-${servicestyle})">${service}</p>
                <p class="content" style="color:var(--color-${style})">${content}</p>
            </div>
        `;
        this.stream.insertAdjacentHTML("beforeend", html);

        window.scrollTo(0, document.body.scrollHeight);
    }

    printTerminalWelcome() {
        if (typeof lastlogin === "function") lastlogin();
        this.printLine(
            "A! ________      ________      ___  __        ___  ___     ",
            "logo",
        );
        this.printLine(
            "A!|\\   ___ \\    |\\   __  \\    |\\  \\|\\  \\     |\\  \\|\\  \\    ",
            "logo",
        );
        this.printLine(
            "A!\\ \\  \\_|\\ \\   \\ \\  \\|\\  \\   \\ \\  \\/  /|_   \\ \\  \\\\\\  \\   ",
            "logo",
        );
        this.printLine(
            "A! \\ \\  \\ \\\\ \\   \\ \\   __  \\   \\ \\   ___  \\   \\ \\  \\\\\\  \\  ",
            "logo",
        );
        this.printLine(
            "A!  \\ \\  \\_\\\\ \\   \\ \\  \\ \\  \\   \\ \\  \\\\ \\  \\   \\ \\  \\\\\\  \\ ",
            "logo",
        );
        this.printLine(
            "A!   \\ \\_______\\   \\ \\__\\ \\__\\   \\ \\__\\\\ \\__\\   \\ \\_______\\",
            "logo",
        );
        this.printLine(
            "A!    \\|_______|    \\|__|\\|__|    \\|__| \\|__|    \\|_______|",
            "logo",
        );
        this.printLine();
        this.printLine("Welcome to [^https://daku.de](<b>daku.de</b>)!");
        this.printLine();
        this.printLine(
            "You can use this interface just like a normal Unix shell!",
            "important",
            "Info",
        );
        this.printLine("For help type 'help'", "important", "Info");
    }

    parseURL(content) {
        while (content.indexOf("](") >= 0) {
            let uname = /\(([^)]+)\)/.exec(content)[1];
            let url = /\[([^)]+)\]/.exec(content)[1];
            let newpage = url.startsWith("^");
            if (newpage) url = url.substr(1);

            let start = content.indexOf("[");
            let end = content.indexOf(")");

            let linkHTML = `<a href="${url}" ${newpage ? 'target="_blank"' : ""} tabindex="-1"><b>${uname}</b></a>`;
            content =
                content.substring(0, start) +
                linkHTML +
                content.substring(end + 1);
        }
        return content;
    }

    printFact() {
        if (this.readFacts.length === this.facts.length) this.readFacts = [];
        let r;
        do {
            r = Math.floor(Math.random() * this.facts.length);
        } while (this.readFacts.includes(r));
        this.printLine(this.facts[r], null, "Fun Fact", "gold");
        this.readFacts.push(r);
    }

    printSocials() {
        this.printLine(
            "A!   ____  ____   _____   ____   ___    __    ____",
            "blue",
        );
        this.printLine(
            "A!  / __/ / __ \\ / ___/  /  _/  / _ |  / /   / __/",
            "blue",
        );
        this.printLine(
            "A! _\\ \\  / /_/ // /__   _/ /   / __ | / /__ _\\ \\  ",
            "blue",
        );
        this.printLine(
            "A!/___/  \\____/ \\___/  /___/  /_/ |_|/____//___/  ",
            "blue",
        );
        this.printLine();
        this.printLine("A! - Twitter: ");
        this.printLine("A! - YouTube: ");
        this.printLine("A! - Twitch:  ");
        this.printLine();
    }

    help(topic) {
        const printCommandlist = (commands) => {
            this.printLine("Available commands:");
            this.printLine();

            let maxlen = "Command".length;
            let maxlen_desc = "Description".length;

            for (let e of commands) {
                let fullCmdLen = e[0].length + (e[2] ? 1 + e[2].length : 0);
                if (fullCmdLen > maxlen) maxlen = fullCmdLen;
                if (e[1].length > maxlen_desc) maxlen_desc = e[1].length;
            }

            let c1_width = maxlen + 2;
            let c2_width = maxlen_desc + 2;

            let cmd_table = "";
            let box_top =
                "┌" +
                "─".repeat(c1_width) +
                "┬" +
                "─".repeat(c2_width) +
                "┐<br>";
            let box_mid =
                "├" +
                "─".repeat(c1_width) +
                "┼" +
                "─".repeat(c2_width) +
                "┤<br>";
            let box_bot =
                "└" +
                "─".repeat(c1_width) +
                "┴" +
                "─".repeat(c2_width) +
                "┘<br>";

            cmd_table += box_top;

            let c1_pad_l = Math.floor((c1_width - "Command".length) / 2);
            let c1_pad_r = Math.ceil((c1_width - "Command".length) / 2);
            let c2_pad_l = Math.floor((c2_width - "Description".length) / 2);
            let c2_pad_r = Math.ceil((c2_width - "Description".length) / 2);

            cmd_table +=
                "│" +
                "\u00A0".repeat(c1_pad_l) +
                "<b>Command</b>" +
                "\u00A0".repeat(c1_pad_r) +
                "│" +
                "\u00A0".repeat(c2_pad_l) +
                "<b>Description</b>" +
                "\u00A0".repeat(c2_pad_r) +
                "│<br>";

            cmd_table += box_mid;

            for (let e of commands) {
                let fullCmd = e[0] + (e[2] ? "\u00A0" + e[2] : "");

                let pad1_l = Math.floor((c1_width - fullCmd.length) / 2);
                let pad1_r = Math.ceil((c1_width - fullCmd.length) / 2);
                let pad2_l = Math.floor((c2_width - e[1].length) / 2);
                let pad2_r = Math.ceil((c2_width - e[1].length) / 2);

                let displayCmd = fullCmd
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;");
                let displayDesc = e[1]
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;");

                let row =
                    "│" +
                    "\u00A0".repeat(pad1_l) +
                    displayCmd +
                    "\u00A0".repeat(pad1_r) +
                    "│" +
                    "\u00A0".repeat(pad2_l) +
                    displayDesc +
                    "\u00A0".repeat(pad2_r) +
                    "│<br>";

                cmd_table += row;
            }

            cmd_table += box_bot;
            this.printLine(cmd_table);
            this.printLine(`${commands.length} commands`);
            this.printLine();
        };

        topic = topic ? topic.toLowerCase() : "commands";
        let keys = Object.keys(this.commandHelpData);
        let topicsStr =
            "<b>commands</b>, " + keys.map((k) => `<b>${k}</b>`).join(", ");

        this.printLine();

        if (topic === "commands") {
            this.printLine("HELP - Commands");
            this.printLine();
            this.printLine(
                "Here is a list of all available commands, you can get more specific info by using 'help &lt;topic&gt;'!",
            );
            this.printLine("These are the topics: " + topicsStr);
            this.printLine();

            let allCommands = [];
            for (let key of keys) {
                allCommands = allCommands.concat(this.commandHelpData[key]);
            }
            printCommandlist(allCommands);
        } else if (this.commandHelpData[topic]) {
            this.printLine(
                `HELP - ${topic.charAt(0).toUpperCase() + topic.slice(1)}`,
            );
            this.printLine();

            if (topic === "features") {
                this.printLine(
                    "This page offers you different functionalities. E.g. you can use a calculator.<br><br>",
                );
            }
            if (topic === "layout") {
                this.printLine(
                    "It is possible for you to change the look of this interface. Your settings will be saved as cookies.",
                );
                this.printLine(
                    "You can change the wallpaper as well as the style of the shell.<br>",
                );
            }
            if (topic === "filesystem") {
                this.printLine(
                    "You can work with this filesystem with basic UNIX commands like 'mkdir' and 'cd'.",
                );
                this.printLine(
                    "Right now it only allows you to alter the files in your current working directory (cwd). You can't use a path yet, this may be implemented at a later date!",
                );
                this.printLine(
                    "To change your current directory you can go up by using 'cd ..' or down by using 'cd folder'.<br>",
                );
            }

            printCommandlist(this.commandHelpData[topic]);
        } else {
            this.printLine(
                `There is no help for '${topic.charAt(0).toUpperCase() + topic.slice(1)}'!`,
            );
            this.printLine(
                "You can type 'help [topic]' for these topics: " + topicsStr,
            );
            this.printLine();
        }
    }

    async fetchWiki(args) {
        let title = args.join("%20");
        let searchUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${title}&limit=1&format=json&explaintext&origin=*`;

        try {
            let res = await fetch(searchUrl);
            let data = await res.json();
            let page = data[1][0];

            if (!page) return this.printLine("No suitable page found.");

            let extractUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext&format=json&titles=${page}&redirects&origin=*`;
            let extractRes = await fetch(extractUrl);
            let extractData = await extractRes.json();

            let pages = extractData.query.pages;
            let pageData = pages[Object.keys(pages)[0]];

            this.printLine();
            this.printLine(
                `<span style="font-size: 1.5em; font-weight: bold;"><a href="http://en.wikipedia.org/wiki?curid=${pageData.pageid}" target="_blank">${pageData.title}</a></span>`,
            );
            this.printLine();
            this.printLine(pageData.extract.split("\n\n")[0]);
            this.printLine();
        } catch (e) {
            this.printLine("Error contacting Wikipedia.");
        }
    }

    async handleGuestbook(args) {
        let url =
            "https://script.google.com/macros/s/AKfycbygfOwFB8CXAFusWQtOJwTalzNX22AD_MQrB7epbm4wP8i_7pMHabygQQ2ApoSziTtP/exec";
        if (args.length === 0) {
            try {
                let res = await fetch(url);
                let text = await res.text();
                this.printLine(
                    "These people have registered in the guest book:",
                );
                this.printLine(text);
            } catch (e) {
                this.printLine("Error fetching guestbook.");
            }
        } else {
            let name = args.join(" ");
            if (!/^[\w\d]{3,10}( [\w\d]{3,10})?$/g.test(name)) {
                return this.printLine(
                    "Invalid name. Max two words, 3-10 characters each.",
                );
            }
            try {
                let res = await fetch(url, { method: "POST", body: name });
                let text = await res.text();
                if (text === "DONE")
                    this.printLine("Your name was added to the guest book!");
                if (text === "NAME ALREADY USED")
                    this.printLine("This name is already registered!");
            } catch (e) {
                this.printLine("Error signing guestbook.");
            }
        }
    }

    handleRadio(args) {
        if (!this.radio) return this.printLine("Radio component is missing.");

        if (args.length > 1) {
            return this.printLine(
                `Usage: radio &lt;volume&gt;. The value has to be between 0 and 100. Current volume is ${this.radio.volume * 1000}.`,
            );
        }

        if (args.length === 1) {
            if (args[0] === "pause") {
                this.radio.pause();
                this.radioPlaying = false;
                return;
            }
            let v = args[0];
            if (!/^\d+$/.test(v) || v > 100 || v < 0) {
                return this.printLine(
                    `Usage: radio &lt;volume&gt;. The value has to be between 0 and 100. Current volume is ${this.radio.volume * 1000}.`,
                );
            }

            this.radio.volume = v / 1000;
            this.radio.play();

            if (!this.radioPlaying) {
                this.printLine(
                    "Now listening to [^https://www.ilovemusic.de/](ILoveRadio.de). To pause the radio use 'radio pause' or just 'radio'.",
                );
                this.printLine(
                    `To change the volume use 'radio &lt;volume&gt;'. The value has to be between 0 and 100. Current volume is ${this.radio.volume * 1000}.`,
                );
            } else {
                this.printLine(
                    `Changed the volume to ${this.radio.volume * 1000}.`,
                );
            }
            this.radioPlaying = true;
            return;
        }

        if (this.radioPlaying) {
            this.radio.pause();
            this.radioPlaying = false;
            this.printLine("No longer listening to the radio.");
        } else {
            this.radio.play();
            this.radioPlaying = true;
            this.printLine(
                "Now listening to [^https://www.ilovemusic.de/](ILoveRadio.de). To pause the radio use 'radio pause' or just 'radio'.",
            );
            this.printLine(
                `To change the volume use 'radio &lt;volume&gt;'. The value has to be between 0 and 100. Current volume is ${this.radio.volume * 1000}.`,
            );
        }
    }

    handleLs(args) {
        let showHidden = args.includes("-a");
        let pathArg = args.find((a) => a !== "-a");

        let targetDir = pathArg ? resolvePath(dir, pathArg) : dir;

        if (!targetDir)
            return this.printLine(
                `ls: cannot access '${pathArg}': No such file or directory`,
            );

        if (!(targetDir instanceof Folder))
            return this.printLine(targetDir.getName());

        let output = targetDir.getChildren(showHidden);
        this.printLine(output || " ");
    }

    handleCd(args) {
        if (args.length !== 1)
            return this.printLine("Usage: cd &lt;directory&gt;");

        let target = resolvePath(dir, args[0]);

        if (!target)
            return this.printLine(`cd: ${args[0]}: No such file or directory`);
        if (!(target instanceof Folder))
            return this.printLine(`cd: ${args[0]}: Not a directory`);

        dir = target;
        this.printLine("Changed directory to: " + dir.getDirectory());
    }

    async handleCat(args) {
        if (args.length !== 1) return this.printLine("Usage: cat &lt;file&gt;");

        let target = resolvePath(dir, args[0]);

        if (!target)
            return this.printLine(`cat: ${args[0]}: No such file or directory`);
        if (target instanceof Folder)
            return this.printLine(`cat: ${args[0]}: Is a directory`);

        // If it's an ImageFile, we DO NOT want to escape it. We want it to render the image tag!
        if (target instanceof ImageFile) {
            return this.printLine(target.getContent());
        }

        // Await the content (Works for both normal Textfiles and async HostedTextFiles)
        let content = await target.getContent();

        // Split the document by newlines and print line by line
        let lines = content.split("\n");
        for (let line of lines) {
            // 1. Escape < and > so the terminal doesn't render them as actual HTML elements
            let escapedLine = line.replace(/</g, "&lt;").replace(/>/g, "&gt;");

            // 2. Replace regular spaces with non-breaking spaces so code indentation is preserved
            escapedLine = escapedLine.replace(/ /g, "&nbsp;");

            // 3. Ensure totally blank lines still render with height
            if (escapedLine === "") escapedLine = "&nbsp;";

            this.printLine(escapedLine);
        }
    }

    handleMkdir(args) {
        if (args.length !== 1)
            return this.printLine("Usage: mkdir &lt;directory&gt;");

        let parts = args[0].split("/");
        let newFolderName = parts.pop();
        let targetDirPath = parts.join("/");

        let targetDir =
            targetDirPath === ""
                ? args[0].startsWith("/")
                    ? fs_root
                    : dir
                : resolvePath(dir, targetDirPath);

        if (!targetDir || !(targetDir instanceof Folder))
            return this.printLine(
                `mkdir: cannot create directory '${args[0]}': No such file or directory`,
            );
        if (!File.validName(newFolderName))
            return this.printLine("mkdir: Invalid folder name");

        let success = targetDir.addChild(new Folder(newFolderName));
        if (!success)
            this.printLine(
                `mkdir: cannot create directory '${args[0]}': File exists`,
            );
    }

    handleTouch(args) {
        if (args.length !== 1)
            return this.printLine("Usage: touch &lt;file&gt;");

        let parts = args[0].split("/");
        let newFileName = parts.pop();
        let targetDirPath = parts.join("/");

        let targetDir =
            targetDirPath === ""
                ? args[0].startsWith("/")
                    ? fs_root
                    : dir
                : resolvePath(dir, targetDirPath);

        if (!targetDir || !(targetDir instanceof Folder))
            return this.printLine(
                `touch: cannot touch '${args[0]}': No such file or directory`,
            );
        if (!File.validName(newFileName))
            return this.printLine("touch: Invalid file name");

        targetDir.addChild(new Textfile(newFileName, ""));
    }

    handleCreate(args, rawLine) {
        if (args.length < 2)
            return this.printLine("Usage: create &lt;file&gt; &lt;content&gt;");

        let fileArg = args[0];
        let contentStartIndex = rawLine.indexOf(fileArg) + fileArg.length;
        let content = rawLine.substring(contentStartIndex).trim();

        let parts = fileArg.split("/");
        let newFileName = parts.pop();
        let targetDirPath = parts.join("/");

        let targetDir =
            targetDirPath === ""
                ? fileArg.startsWith("/")
                    ? fs_root
                    : dir
                : resolvePath(dir, targetDirPath);

        if (!targetDir || !(targetDir instanceof Folder))
            return this.printLine(
                `create: cannot create '${fileArg}': No such file or directory`,
            );
        if (!File.validName(newFileName))
            return this.printLine("create: Invalid file name");

        targetDir.addChild(new Textfile(newFileName, content));
    }

    handleRm(args) {
        if (args.length === 2 && args[0] === "-rf" && args[1] === "/") {
            console.log("Closing the page");
            let wrapper = document.querySelector(".wrapper");
            wrapper.classList.add("macwrapper");
            wrapper.insertAdjacentHTML(
                "beforeend",
                '<div class="macerror"></div>',
            );
            setTimeout(() => {
                window.location.replace(
                    "https://www.linkedin.com/in/daniel-kurtz-1a8544197/",
                );
            }, 4500);
            new Audio("files/sadmac.mp3").play();
            return;
        }

        if (args.length !== 1)
            return this.printLine("Usage: rm &lt;file|directory&gt;");

        let parts = args[0].split("/");
        let targetName = parts.pop();
        let targetDirPath = parts.join("/");

        let targetDir =
            targetDirPath === ""
                ? args[0].startsWith("/")
                    ? fs_root
                    : dir
                : resolvePath(dir, targetDirPath);

        if (!targetDir || !(targetDir instanceof Folder)) {
            return this.printLine(
                `rm: cannot remove '${args[0]}': No such file or directory`,
            );
        }

        let success = targetDir.removeChild(targetName);
        if (!success)
            this.printLine(
                `rm: cannot remove '${args[0]}': No such file or directory`,
            );
    }

    handleTabCompletion() {
        let text = this.inputbox.innerText.replace(
            new RegExp(String.fromCharCode(160), "g"),
            " ",
        );
        let args = text.split(" ");
        let matches = [];
        let isCommand = args.length === 1;

        if (isCommand) {
            let partialCmd = args[0].toLowerCase();
            let allCommands = Object.keys(this.commands);
            matches = allCommands.filter((cmd) => cmd.startsWith(partialCmd));
        } else {
            let partialPath = args[args.length - 1];

            let parts = partialPath.split("/");
            let prefix = parts.pop();
            let targetDirPath = parts.join("/");

            let targetDir =
                targetDirPath === ""
                    ? partialPath.startsWith("/")
                        ? fs_root
                        : dir
                    : resolvePath(dir, targetDirPath);

            if (targetDir && targetDir instanceof Folder) {
                matches = targetDir.children
                    .filter((child) => child.getName().startsWith(prefix))
                    .map((child) => {
                        return child instanceof Folder
                            ? child.getName() + "/"
                            : child.getName();
                    });
            }
        }

        if (matches.length === 1) {
            if (isCommand) {
                this.inputbox.innerText = matches[0] + " ";
            } else {
                let parts = args[args.length - 1].split("/");
                parts.pop();
                parts.push(matches[0]);
                args[args.length - 1] = parts.join("/");
                this.inputbox.innerText = args.join(" ");
            }
            this.placeCaretAtEnd(this.inputbox);
        } else if (matches.length > 1) {
            this.printLine(text, null, "User");

            let displayMatches = matches.map((m) =>
                m.endsWith("/")
                    ? `<span style="color: var(--color-blue)">${m}</span>`
                    : m,
            );
            this.printLine(displayMatches.join("&nbsp;&nbsp;&nbsp;"));

            this.placeCaretAtEnd(this.inputbox);
        }
    }

    placeCaretAtEnd(el) {
        el.focus();
        if (
            typeof window.getSelection !== "undefined" &&
            typeof document.createRange !== "undefined"
        ) {
            let range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
            let sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    window.terminal = new Terminal();

    windowOnTop(document.getElementById("terminal"));

    document.getElementById("terminalinput").focus();
});
