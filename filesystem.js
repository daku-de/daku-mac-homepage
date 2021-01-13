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
        this.elements = [];
    }

    addElement(element) {       
        if (!element instanceof File) {            
            return false;
        }
        for (let i = 0; i < this.elements.length ; ++i) {
            if (this.elements[i].name == element.name) {              
                return false;
            }
        }   
        this.elements.push(element);
        element.setParent(this);
        this.elements.sort((a, b) => {return a.getName().localeCompare(b.getName())});       
        return true;
    }

    removeElement(element) {     
        if (!element instanceof String) {          
            return false;
        }
        for (let i = 0; i < this.elements.length ; ++i) {
            if (this.elements[i].name == element) {
                delete this.elements[i];
                this.elements.splice(i, 1);
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
        for (let i = 0; i < this.elements.length ; ++i) {
            if (this.elements[i] instanceof Folder) {
                result += ' <span style="color: var(--color-blue);text-decoration: underline;">' + this.elements[i].getName() + '</span>';
                continue;
            }
            result += " " + this.elements[i].getName();
        }  
        return result;
    }

    getChild(name) {
        for (let i = 0; i < this.elements.length ; ++i) {
            if (this.elements[i].name == name) return this.elements[i];
        }
        return null;
    }

    getString(depth) {
        if (depth == null) depth = 0;
        if (depth == 0) {
            var res = '<span style="font-weight: bold">' + this.name + "</span>" + "<br>";
        } else {
            var res = '\u00A0'.repeat(depth*2-1) + "└" + this.name + "<br>";
        }
        for (let i = 0; i < this.elements.length ; ++i) {
            if (this.elements[i] instanceof Folder) {
                res += this.elements[i].getString(depth+1);
            } else {
                res += '\u00A0'.repeat((depth+1)*2-1) + "└" + this.elements[i].name + "<br>";
            }
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
}

var fs_root = new Folder("home");
fs_root.addElement(new Textfile("info", `You can work with this filesystem with these commands: <br> 
    dir <br>
    pwd <br>
    ls <br>
    cd &lt;fs_rootectory&gt; <br>
    rm &lt;file|fs_rootectory&gt; <br>
    mkfs_root &lt;fs_rootectory&gt; <br>
    create &lt;file&gt; &lt;content&gt; <br>
    cat &lt;file&gt; <br>
    touch &lt;file&gt; <br> <br>
    This filesystem is not persistent!`));
fs_root.addElement(new Folder("subfolder2"));
fs_root.addElement(new Folder("subfolder1"));
fs_root.getChild("subfolder1").addElement(new Folder("subsubfolder"));

var dir = fs_root;
