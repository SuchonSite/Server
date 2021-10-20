"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function jsonConcat(jsonList) {
  var newJson = {};

  for (var thisJson in jsonList) {
    for (var key in thisJson) {
      if (key in newJson || ["string", "number"].includes(_typeof(thisJson[key]))) {} else {
        newJson[key] = thisJson[key];
      }
    }
  }

  return newJson;
}

var a = {
  "a": "a",
  "b": "b"
};
var b = {
  "a2": "a",
  "b2": "b",
  "c": {
    "d": "d"
  }
};
var newJ = jsonConcat([a, b]);
console.log(newJ);
var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
  for (var _iterator = b[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
    var key = _step.value;
    console.log(key);
  }
} catch (err) {
  _didIteratorError = true;
  _iteratorError = err;
} finally {
  try {
    if (!_iteratorNormalCompletion && _iterator["return"] != null) {
      _iterator["return"]();
    }
  } finally {
    if (_didIteratorError) {
      throw _iteratorError;
    }
  }
}