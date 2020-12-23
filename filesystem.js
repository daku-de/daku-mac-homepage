class File {
    constructor(name) {
        this.name = name;
        this.parent = null;
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
        for (let i = 0; i < this.elements.length ; ++i) {
            if (this.elements[i].name == element.name && this.elements[i].constructor.name == element.constructor.name) {
                return element.name + " already exists.";
            }
        }   
        this.elements.push(element);
        element.setParent(this);
        this.elements.sort((a, b) => {return a.getName().localeCompare(b.getName())});
    }

    removeElement(element) {
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