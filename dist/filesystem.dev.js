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
      var regex = /^\.?(\w+([\-_]\w+)?)+(.\w+)?$/i;
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
    _this.elements = [];
    return _this;
  }

  _createClass(Folder, [{
    key: "addElement",
    value: function addElement(element) {
      if (!element instanceof File) {
        return false;
      }

      for (var i = 0; i < this.elements.length; ++i) {
        if (this.elements[i].name == element.name) {
          return false;
        }
      }

      this.elements.push(element);
      element.setParent(this);
      this.elements.sort(function (a, b) {
        return a.getName().localeCompare(b.getName());
      });
      return true;
    }
  }, {
    key: "removeElement",
    value: function removeElement(element) {
      if (!element instanceof String) {
        return false;
      }

      for (var i = 0; i < this.elements.length; ++i) {
        if (this.elements[i].name == element) {
          delete this.elements[i];
          this.elements.splice(i, 1);
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

      for (var i = 0; i < this.elements.length; ++i) {
        if (this.elements[i] instanceof Folder) {
          result += ' <span style="color: var(--color-blue);text-decoration: underline;">' + this.elements[i].getName() + '</span>';
          continue;
        }

        result += " " + this.elements[i].getName();
      }

      return result;
    }
  }, {
    key: "getChild",
    value: function getChild(name) {
      for (var i = 0; i < this.elements.length; ++i) {
        if (this.elements[i].name == name) return this.elements[i];
      }

      return null;
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
  }]);

  return Textfile;
}(File);