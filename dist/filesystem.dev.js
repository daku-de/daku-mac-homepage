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

var File =
/*#__PURE__*/
function () {
  function File(name) {
    _classCallCheck(this, File);

    this.name = name;
    this.parent = null;
  }

  _createClass(File, [{
    key: "setParent",
    value: function setParent(parent) {
      this.parent = parent;
    }
  }, {
    key: "getParent",
    value: function getParent(parent) {
      return this.parent;
    }
  }, {
    key: "getName",
    value: function getName() {
      return this.name;
    }
  }], [{
    key: "validName",
    value: function validName(name) {
      var regex = /^\.?(\w+([\-_]\w+)?)+(\.[a-z]{1,3})?$/;
      return regex.test(name);
    }
  }]);

  return File;
}();

var Folder =
/*#__PURE__*/
function (_File) {
  _inherits(Folder, _File);

  function Folder(name) {
    var _this;

    _classCallCheck(this, Folder);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Folder).call(this, name));
    _this.children = [];
    return _this;
  }

  _createClass(Folder, [{
    key: "addChild",
    value: function addChild(child) {
      if (!child instanceof File) {
        return false;
      }

      for (var i = 0; i < this.children.length; ++i) {
        if (this.children[i].name == child.name) {
          return false;
        }
      }

      this.children.push(child);
      child.setParent(this);
      this.children.sort(function (a, b) {
        return a.getName().localeCompare(b.getName());
      });
      return true;
    }
  }, {
    key: "removeChild",
    value: function removeChild(child) {
      if (!child instanceof String) {
        return false;
      }

      for (var i = 0; i < this.children.length; ++i) {
        if (this.children[i].name == child) {
          delete this.children[i];
          this.children.splice(i, 1);
        }
      }
    }
  }, {
    key: "getDirectory",
    value: function getDirectory() {
      var result = "/" + this.getName();

      if (this.parent != null) {
        result = this.parent.getDirectory() + result;
      }

      return result;
    }
  }, {
    key: "getChildren",
    value: function getChildren() {
      var result = "";

      for (var i = 0; i < this.children.length; ++i) {
        if (this.children[i] instanceof Folder) {
          result += ' <span style="color: var(--color-blue);text-decoration: underline;">' + this.children[i].getName() + '</span>';
          continue;
        }

        result += " " + this.children[i].getName();
      }

      return result;
    }
  }, {
    key: "getChild",
    value: function getChild(name) {
      for (var i = 0; i < this.children.length; ++i) {
        if (this.children[i].name == name) return this.children[i];
      }

      return null;
    }
  }, {
    key: "getHeight",
    value: function getHeight() {
      if (this.children.length == 0) {
        return 0;
      } else {
        var values = [];

        for (var i = 0; i < this.children.length; ++i) {
          if (this.children[i] instanceof Folder) values.push(this.children[i].getHeight());
        }

        return Math.max.apply(null, values) + 1;
      }
    }
  }, {
    key: "getString",
    value: function getString(depth, arr) {
      var res = "";
      var name = this.name;
      if (this == dir) name = '<span style="font-weight: bold; text-decoration: underline">' + this.name + "</span>" + " (CWD)";
      if (depth == null) depth = 0;
      if (arr == null) arr = [];
      var last = false;

      if (depth != 0 && this.parent.children[this.parent.children.length - 1] == this) {
        last = true;
      }

      if (depth != 0) arr.push(last);
      var pref = "";

      for (var i = 0; i < arr.length - 1; ++i) {
        pref += arr[i] ? "\xA0\xA0\xA0\xA0" : "|\xA0\xA0\xA0";
      }

      pref += last ? "`-- " : "|-- ";
      if (depth == 0) pref = "";
      res = pref + '<i class="far fa-folder"></i> ' + name + "<br>";

      for (var _i = 0; _i < this.children.length; ++_i) {
        var arr_copy = arr.slice();
        res += this.children[_i].getString(depth + 1, arr_copy);
      }

      return res;
    }
  }]);

  return Folder;
}(File);

var Textfile =
/*#__PURE__*/
function (_File2) {
  _inherits(Textfile, _File2);

  function Textfile(name, content) {
    var _this2;

    _classCallCheck(this, Textfile);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(Textfile).call(this, name));
    _this2.content = content;
    return _this2;
  }

  _createClass(Textfile, [{
    key: "getContent",
    value: function getContent() {
      if (this.content == null) return "";
      return this.content;
    }
  }, {
    key: "getString",
    value: function getString(depth, arr) {
      var last = false;

      if (this.parent.children[this.parent.children.length - 1] == this) {
        last = true;
      }

      var res = "";
      var pref = "";

      for (var i = 0; i < arr.length; ++i) {
        pref += arr[i] ? "\xA0\xA0\xA0\xA0" : "|\xA0\xA0\xA0";
      }

      pref += last ? "`-- " : "|-- ";
      res += pref + '<i class="far fa-file"></i> ' + this.name + "<br>";
      return res;
    }
  }]);

  return Textfile;
}(File);

var fs_root = new Folder("home");
fs_root.addChild(new Textfile("info", "You can work with this filesystem with these commands: <br> \n    tree <br>\n    pwd <br>\n    ls <br>\n    cd &lt;directory&gt; <br>\n    rm &lt;file|directory&gt; <br>\n    mkdir &lt;directory&gt; <br>\n    create &lt;file&gt; &lt;content&gt; <br>\n    cat &lt;file&gt; <br>\n    touch &lt;file&gt; <br> <br>\n    This filesystem is not persistent!"));
fs_root.addChild(new Folder("subfolder2"));
fs_root.addChild(new Folder("subfolder1"));
fs_root.getChild("subfolder1").addChild(new Folder("subsubfolder"));
var dir = fs_root;