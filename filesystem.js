class File {
    constructor(name) {
        this.name = name;
        this.parent = null;
    }

    static validName(name) {
        let regex = /^\.?(\w+([\-_]\w+)?)+(.\w+)?$/i;
        return regex.test(name);
    }

    setParent(parent) {
        this.parent = parent;
    }

    getParent(parent) {
        return this.parent;
    }

    getName() {
        return this.name;
    }
}

class Folder extends File{
    constructor(name) {
        super(name);
        this.children = [];
    }

    addChild(child) {       
        if (!child instanceof File) {            
            return false;
        }
        for (let i = 0; i < this.children.length ; ++i) {
            if (this.children[i].name == child.name) {              
                return false;
            }
        }   
        this.children.push(child);
        child.setParent(this);
        this.children.sort((a, b) => {return a.getName().localeCompare(b.getName())});       
        return true;
    }

    removeChild(child) {     
        if (!child instanceof String) {          
            return false;
        }
        for (let i = 0; i < this.children.length ; ++i) {
            if (this.children[i].name == child) {
                delete this.children[i];
                this.children.splice(i, 1);
            }
        }
    }

    getDirectory() {
        let result = "/" + this.getName();
        if (this.parent != null) {
            result = this.parent.getDirectory() + result;
        }
        return result;
    }

    getChildren() {
        let result = "";
        for (let i = 0; i < this.children.length ; ++i) {
            if (this.children[i] instanceof Folder) {
                result += ' <span style="color: var(--color-blue);text-decoration: underline;">' + this.children[i].getName() + '</span>';
                continue;
            }
            result += " " + this.children[i].getName();
        }  
        return result;
    }

    getChild(name) {
        for (let i = 0; i < this.children.length ; ++i) {
            if (this.children[i].name == name) return this.children[i];
        }
        return null;
    }

    getHeight() {
        if (this.children.length == 0) {
            return 0;
        } else {
            let values = [];
            for (let i = 0; i < this.children.length; ++i) {
                if (this.children[i] instanceof Folder) values.push(this.children[i].getHeight());
            }
            return Math.max.apply(null, values)+1;
        }
    }

    getString(depth, arr) {
        let res = "";
        let name = this.name;
        if (this == dir) name = '<span style="font-weight: bold; text-decoration: underline">' + this.name + "</span>" + " [CWD]";
        if (depth == null) depth = 0;
        if (arr == null) arr = [];
        let last = false;
        if (depth != 0 && this.parent.children[this.parent.children.length-1] == this) {
            last = true;
        }
        if (depth != 0) arr.push(last);
        let pref = "";
        for (let i = 0; i < arr.length-1; ++i) {
            pref += arr[i]?"\u00A0\u00A0\u00A0\u00A0":"|\u00A0\u00A0\u00A0";
        }
        pref += last?"`-- ":"|-- ";
        if (depth == 0) pref = "";
        res = pref + '<i class="far fa-folder"></i> ' + name + "<br>";
    
        for (let i = 0; i < this.children.length ; ++i) {
            let arr_copy = arr.slice();
            res += this.children[i].getString(depth+1, arr_copy);
        }
        return res;  
    }
}

class Textfile extends File {
    constructor(name, content) {
        super(name);
        this.content = content;
    }

    getContent() {
        if (this.content == null) return "";
        return this.content;
    }

    getString(depth, arr) {
        let last = false;
        if (this.parent.children[this.parent.children.length-1] == this) {
            last = true;
        }
        let res = "";
        let pref = "";
        for (let i = 0; i < arr.length; ++i) {
            pref += arr[i]?"\u00A0\u00A0\u00A0\u00A0":"|\u00A0\u00A0\u00A0";
        }
        pref += last?"`-- ":"|-- ";
        res += pref + '<i class="far fa-file"></i> ' + this.name + "<br>";
        return res;
    }
}

var fs_root = new Folder("home");
fs_root.addChild(new Textfile("info", `You can work with this filesystem with these commands: <br> 
    tree <br>
    pwd <br>
    ls <br>
    cd &lt;fs_rootectory&gt; <br>
    rm &lt;file|fs_rootectory&gt; <br>
    mkfs_root &lt;fs_rootectory&gt; <br>
    create &lt;file&gt; &lt;content&gt; <br>
    cat &lt;file&gt; <br>
    touch &lt;file&gt; <br> <br>
    This filesystem is not persistent!`));
fs_root.addChild(new Folder("subfolder2"));
fs_root.addChild(new Folder("subfolder1"));
fs_root.getChild("subfolder1").addChild(new Folder("subsubfolder"));

var dir = fs_root;