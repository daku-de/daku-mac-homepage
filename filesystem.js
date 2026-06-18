class File {
    constructor(name) {
        this.name = name;
        this.parent = null;
        this.createdAt = new Date();
        this.modifiedAt = new Date();
    }

    static validName(name) {
        let regex = /^\.?(\w+([\-_]\w+)?)+(\.[a-z]{1,4})?$/;
        return regex.test(name);
    }

    setParent(parent) {
        this.parent = parent;
    }

    getParent() {
        return this.parent;
    }

    getName() {
        return this.name;
    }

    isHidden() {
        return this.name.startsWith(".");
    }

    getSize() {
        return 0;
    }
}

class Folder extends File {
    constructor(name) {
        super(name);
        this.children = [];
    }

    addChild(child) {
        if (!(child instanceof File)) {
            return false;
        }
        for (let i = 0; i < this.children.length; ++i) {
            if (this.children[i].name === child.name) {
                return false;
            }
        }
        this.children.push(child);
        child.setParent(this);

        this.modifiedAt = new Date();

        this.children.sort((a, b) => a.getName().localeCompare(b.getName()));
        return true;
    }

    removeChild(name) {
        for (let i = 0; i < this.children.length; ++i) {
            if (this.children[i].name === name) {
                this.children.splice(i, 1);
                this.modifiedAt = new Date();
                return true;
            }
        }
        return false;
    }

    getDirectory() {
        if (this.parent == null) return "/";
        let result = "/" + this.getName();
        if (this.parent.getName() !== "root") {
            result = this.parent.getDirectory() + "/" + this.getName();
        }
        return result.replace(/\/\//g, "/");
    }

    getSize() {
        return this.children.reduce(
            (total, child) => total + child.getSize(),
            0,
        );
    }

    getChildren(showHidden = false) {
        let result = "";
        for (let i = 0; i < this.children.length; ++i) {
            let child = this.children[i];
            if (child.isHidden() && !showHidden) continue;

            if (child instanceof Folder) {
                result += ` <span style="color: var(--color-blue);text-decoration: underline;">${child.getName()}</span>`;
            } else {
                result += " " + child.getName();
            }
        }
        return result.trim();
    }

    getChild(name) {
        return this.children.find((child) => child.name === name) || null;
    }

    getHeight() {
        if (this.children.length === 0) return 0;
        let values = this.children
            .filter((c) => c instanceof Folder)
            .map((c) => c.getHeight());
        return values.length > 0 ? Math.max(...values) + 1 : 0;
    }

    getString(depth = 0, arr = []) {
        let res = "";
        let name = this.name;

        if (this === dir)
            name = `<span style="font-weight: bold; text-decoration: underline">${this.name}</span> (CWD)`;

        let last = false;
        if (
            depth !== 0 &&
            this.parent.children[this.parent.children.length - 1] === this
        ) {
            last = true;
        }

        if (depth !== 0) arr.push(last);

        let pref = "";
        for (let i = 0; i < arr.length - 1; ++i) {
            pref += arr[i] ? "\u00A0\u00A0\u00A0\u00A0" : "|\u00A0\u00A0\u00A0";
        }
        pref += last ? "`-- " : "|-- ";
        if (depth === 0) pref = "";

        res = `${pref}<i class="far fa-folder"></i> ${name}<br>`;

        for (let i = 0; i < this.children.length; ++i) {
            res += this.children[i].getString(depth + 1, arr.slice());
        }
        return res;
    }
}

class Textfile extends File {
    constructor(name, content = "") {
        super(name);
        this.content = content;
    }

    getContent() {
        return this.content || "";
    }

    setContent(newContent) {
        this.content = newContent;
        this.modifiedAt = new Date();
    }

    getSize() {
        return this.content.length;
    }

    getString(depth, arr) {
        let last =
            this.parent.children[this.parent.children.length - 1] === this;
        let pref = "";
        for (let i = 0; i < arr.length; ++i) {
            pref += arr[i] ? "\u00A0\u00A0\u00A0\u00A0" : "|\u00A0\u00A0\u00A0";
        }
        pref += last ? "`-- " : "|-- ";

        let sizeStr = ` <span style="color: gray; font-size: 0.8em;">(${this.getSize()}b)</span>`;
        return `${pref}<i class="far fa-file"></i> ${this.name}${sizeStr}<br>`;
    }
}

class ImageFile extends File {
    constructor(name, url) {
        super(name);
        this.url = url;
    }

    getContent() {
        return `<br><img src="${this.url}" alt="${this.name}" style="max-width: 300px; border: 1px solid #555; border-radius: 4px; display: block; margin: 10px 0;"><br>`;
    }

    getSize() {
        return 2048;
    }

    getString(depth, arr) {
        let last =
            this.parent.children[this.parent.children.length - 1] === this;
        let pref = "";
        for (let i = 0; i < arr.length; ++i) {
            pref += arr[i] ? "\u00A0\u00A0\u00A0\u00A0" : "|\u00A0\u00A0\u00A0";
        }
        pref += last ? "`-- " : "|-- ";
        let sizeStr = ` <span style="color: gray; font-size: 0.8em;">(IMG)</span>`;
        return `${pref}<i class="far fa-file-image"></i> ${this.name}${sizeStr}<br>`;
    }
}

class HostedTextFile extends File {
    constructor(name, url) {
        super(name);
        this.url = url;
    }

    async getContent() {
        try {
            let response = await fetch(this.url);
            if (!response.ok) return `Error 404: Could not read ${this.name}`;

            return await response.text();
        } catch (e) {
            return `Error: Failed to fetch ${this.name}. Check your network or URL.`;
        }
    }

    getSize() {
        return 4096;
    }

    getString(depth, arr) {
        let last =
            this.parent.children[this.parent.children.length - 1] === this;
        let pref = "";
        for (let i = 0; i < arr.length; ++i) {
            pref += arr[i] ? "\u00A0\u00A0\u00A0\u00A0" : "|\u00A0\u00A0\u00A0";
        }
        pref += last ? "`-- " : "|-- ";
        let sizeStr = ` <span style="color: gray; font-size: 0.8em;">(WEB)</span>`;
        return `${pref}<i class="far fa-file"></i> ${this.name}${sizeStr}<br>`;
    }
}

const fileSystemBlueprint = {
    name: "root",
    type: "folder",
    children: [
        {
            name: "home",
            type: "folder",
            children: [
                {
                    name: "info.txt",
                    type: "text",
                    content:
                        "You can work with this filesystem with these commands:\ntree\npwd\nls\ncd <directory>\nrm <file|directory>\nmkdir <directory>\ncreate <file> <content>\ncat <file>\ntouch <file>\n\nThis filesystem is not persistent!",
                },
                {
                    name: ".config",
                    type: "text",
                    content:
                        "User configuration settings. You found a hidden file!",
                },
                {
                    name: "projects",
                    type: "folder",
                    children: [{ name: "daku_de", type: "folder" }],
                },
            ],
        },
        {
            name: "assets",
            type: "folder",
            children: [
                {
                    name: "scripts",
                    type: "folder",
                    children: [
                        {
                            name: "calculator.js",
                            type: "hosted",
                            url: "/calculator.js",
                        },
                        {
                            name: "mail.js",
                            type: "hosted",
                            url: "/mail.js",
                        },
                        {
                            name: "window-manager.js",
                            type: "hosted",
                            url: "/window-manager.js",
                        },
                        {
                            name: "games.js",
                            type: "hosted",
                            url: "/games.js",
                        },
                        {
                            name: "terminal.js",
                            type: "hosted",
                            url: "/terminal.js",
                        },
                        {
                            name: "script.js",
                            type: "hosted",
                            url: "/script.js",
                        },
                    ],
                },
                {
                    name: "style.css",
                    type: "hosted",
                    url: "/style/style.css",
                },
                {
                    name: "index.html",
                    type: "hosted",
                    url: "/index.html",
                },
            ],
        },
    ],
};

function resolvePath(startDir, pathString) {
    if (!pathString) return startDir;

    let current = pathString.startsWith("/") ? fs_root : startDir;

    let parts = pathString.split("/").filter((p) => p !== "");

    for (let part of parts) {
        if (part === ".") continue;

        if (part === "..") {
            if (current.parent) current = current.parent;
        } else {
            if (!(current instanceof Folder)) return null;
            let next = current.getChild(part);
            if (!next) return null;
            current = next;
        }
    }

    return current;
}

function buildFileSystem(data) {
    if (data.type === "folder") {
        let folder = new Folder(data.name);
        if (data.children) {
            for (let childData of data.children) {
                let childNode = buildFileSystem(childData);
                if (childNode) folder.addChild(childNode);
            }
        }
        return folder;
    } else if (data.type === "text") {
        return new Textfile(data.name, data.content || "");
    } else if (data.type === "image") {
        return new ImageFile(data.name, data.url);
    } else if (data.type === "hosted") {
        return new HostedTextFile(data.name, data.url);
    }
    return null;
}

var fs_root = buildFileSystem(fileSystemBlueprint);

var dir = fs_root.getChild("assets");
