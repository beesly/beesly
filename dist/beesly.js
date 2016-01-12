(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Beesly"] = factory();
	else
		root["Beesly"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);

	module.exports = {
	  Resource: __webpack_require__(2).default,
	  Http: __webpack_require__(3).default,
	  Request: __webpack_require__(5).default
	};


/***/ },
/* 1 */
/***/ function(module, exports) {

	// required to safely use babel/register within a browserify codebase

	"use strict";

	exports.__esModule = true;

	exports["default"] = function () {};

	module.exports = exports["default"];

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _http = __webpack_require__(3);

	var _http2 = _interopRequireDefault(_http);

	var _request = __webpack_require__(5);

	var _request2 = _interopRequireDefault(_request);

	var _uriTemplates = __webpack_require__(6);

	var _uriTemplates2 = _interopRequireDefault(_uriTemplates);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function buildCleanResource(resource) {
	  var serialized = {};

	  Object.keys(resource).forEach(function (key) {
	    if (key === 'internalHalLinks' || key === 'embeddedConfig' || key === 'embeddedResources') {
	      return;
	    }

	    serialized[key] = resource[key];
	  });

	  return serialized;
	}

	function buildOptions(name, single, options) {
	  options = options || {};

	  options.single = single;
	  options.name = name;

	  if (!options.accessor) {
	    options.accessor = name;
	  }

	  if (!options.class) {
	    options.class = Resource;
	  }

	  return options;
	}

	var Resource = function () {
	  function Resource(data) {
	    _classCallCheck(this, Resource);

	    this.internalHalLinks = {};
	    this.embeddedConfig = {};
	    this.embeddedResources = {};

	    this.setup();

	    if (data) {
	      this.hydrate(data);
	    }
	  }

	  _createClass(Resource, [{
	    key: 'setup',
	    value: function setup() {}
	  }, {
	    key: 'hasOne',
	    value: function hasOne(name, options) {
	      this.embeddedConfig[name] = buildOptions(name, true, options);
	    }
	  }, {
	    key: 'hasMany',
	    value: function hasMany(name, options) {
	      this.embeddedConfig[name] = buildOptions(name, false, options);
	    }
	  }, {
	    key: 'getLink',
	    value: function getLink(name) {
	      if (name in this.internalHalLinks) {
	        return this.internalHalLinks[name].href;
	      }
	    }
	  }, {
	    key: 'hydrate',
	    value: function hydrate(data) {
	      var _this = this;

	      Object.keys(data).forEach(function (key) {
	        switch (key.toLowerCase()) {
	          case '_embedded':
	            _this.hydrateEmbeddedResource(data[key]);
	            break;
	          case '_links':
	            _this.internalHalLinks = data[key];
	            break;
	          default:
	            _this[key] = data[key];
	        }
	      });
	    }
	  }, {
	    key: 'hydrateEmbeddedResource',
	    value: function hydrateEmbeddedResource(collections) {
	      var _this2 = this;

	      Object.keys(collections).forEach(function (key) {
	        var collection = collections[key];
	        var config = null;

	        if (key in _this2.embeddedConfig) {
	          config = _this2.embeddedConfig[key];
	        } else {
	          config = buildOptions(key, false);
	        }

	        _this2.embeddedResources[config.accessor] = [];

	        collection.forEach(function (data) {
	          if (config.single) {
	            _this2.hydrateSingleEmbeddedResource(data, config);
	          } else {
	            _this2.hydrateOneToManyEmbeddedResource(data, config);
	          }
	        });
	      });
	    }
	  }, {
	    key: 'hydrateSingleEmbeddedResource',
	    value: function hydrateSingleEmbeddedResource(data, config) {
	      this.embeddedResources[config.accessor] = new config.class(data);
	      this.createEmbeddedAccesor(config);
	    }
	  }, {
	    key: 'hydrateOneToManyEmbeddedResource',
	    value: function hydrateOneToManyEmbeddedResource(data, config) {
	      var resource = new config.class(data);
	      this.embeddedResources[config.accessor].push(resource);
	      this.createEmbeddedAccesor(config);
	    }
	  }, {
	    key: 'createEmbeddedAccesor',
	    value: function createEmbeddedAccesor(config) {
	      var _this3 = this;

	      this[config.accessor] = function () {
	        return _this3.embeddedResources[config.accessor];
	      };
	    }
	  }, {
	    key: 'update',
	    value: function update() {
	      var _this4 = this;

	      if (!this.constructor.url) {
	        throw 'Resource url not defined';
	      }

	      var data = buildCleanResource(this);
	      var request = new _request2.default((0, _uriTemplates2.default)(this.constructor.url).fill(data), JSON.stringify(data));

	      return new _http2.default().patch(request).then(function (response) {
	        return new _this4(response.json);
	      });
	    }
	  }, {
	    key: 'replace',
	    value: function replace() {
	      var _this5 = this;

	      if (!this.constructor.url) {
	        throw 'Resource url not defined';
	      }

	      var data = buildCleanResource(this);
	      var request = new _request2.default((0, _uriTemplates2.default)(this.constructor.url).fill(data), JSON.stringify(data));

	      return new _http2.default().put(request).then(function (response) {
	        return new _this5(response.json);
	      });
	    }
	  }, {
	    key: 'delete',
	    value: function _delete() {
	      var _this6 = this;

	      if (!this.constructor.url) {
	        throw 'Resource url not defined';
	      }

	      var request = new _request2.default((0, _uriTemplates2.default)(this.constructor.url).fill(this));

	      return new _http2.default().delete(request).then(function (response) {
	        return new _this6(response.json);
	      });
	    }
	  }], [{
	    key: 'get',
	    value: function get(params) {
	      var _this7 = this;

	      if (!this.url) {
	        throw 'Resource url not defined';
	      }

	      var request = new _request2.default((0, _uriTemplates2.default)(this.url).fill(params));

	      return new _http2.default().get(request).then(function (response) {
	        return new _this7(response.json);
	      });
	    }
	  }, {
	    key: 'create',
	    value: function create(data, params) {
	      var _this8 = this;

	      if (!this.url) {
	        throw 'Resource url not defined';
	      }

	      var resource = buildCleanResource(data);
	      var request = new _request2.default((0, _uriTemplates2.default)(this.url).fill(params), JSON.stringify(resource));

	      return new _http2.default().post(request).then(function (response) {
	        return new _this8(response.json);
	      });
	    }
	  }]);

	  return Resource;
	}();

	exports.default = Resource;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _response = __webpack_require__(4);

	var _response2 = _interopRequireDefault(_response);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function stringify(data, headers) {
	  if (typeof data === 'string' || !data) {
	    return data;
	  }

	  if ('Content-type' in headers && /json/.test(headers['Content-type'])) {
	    return JSON.stringify(data);
	  }

	  var str = '';
	  var _iteratorNormalCompletion = true;
	  var _didIteratorError = false;
	  var _iteratorError = undefined;

	  try {
	    for (var _iterator = Object.keys(data)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	      var key = _step.value;

	      str += key + '=' + encodeURIComponent(data[key]) + '&';
	    }
	  } catch (err) {
	    _didIteratorError = true;
	    _iteratorError = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion && _iterator.return) {
	        _iterator.return();
	      }
	    } finally {
	      if (_didIteratorError) {
	        throw _iteratorError;
	      }
	    }
	  }

	  return str.slice(0, -1);
	}

	function buildXhr(method, request) {
	  var xhr = new XMLHttpRequest();

	  if ('withCredentials' in xhr) {
	    xhr.open(method, request.url, true);
	  } else {
	    throw new Error('CORS is not supported on this platform');
	  }

	  var _iteratorNormalCompletion2 = true;
	  var _didIteratorError2 = false;
	  var _iteratorError2 = undefined;

	  try {
	    for (var _iterator2 = Object.keys(request.headers)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	      var key = _step2.value;

	      xhr.setRequestHeader(key, request.headers[key]);
	    }
	  } catch (err) {
	    _didIteratorError2 = true;
	    _iteratorError2 = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion2 && _iterator2.return) {
	        _iterator2.return();
	      }
	    } finally {
	      if (_didIteratorError2) {
	        throw _iteratorError2;
	      }
	    }
	  }

	  return xhr;
	}

	var Http = function () {
	  function Http() {
	    _classCallCheck(this, Http);
	  }

	  _createClass(Http, [{
	    key: 'send',
	    value: function send(method, request) {
	      Http.interceptRequest(request);

	      var xhr = buildXhr(method, request);

	      return new Promise(function (resolve, reject) {
	        xhr.onload = function () {
	          var response = xhr.responseText;

	          if (xhr.status >= 200 && xhr.status < 400) {
	            resolve(new _response2.default(xhr.status, response));
	            return;
	          }
	          reject(Error('Received error response with code ' + xhr.status), response);
	        };

	        xhr.onerror = function () {
	          return reject(Error('Request failed'));
	        };
	        xhr.send(stringify(request.data, request.headers));
	      });
	    }
	  }, {
	    key: 'get',
	    value: function get(request) {
	      return this.send('GET', request);
	    }
	  }, {
	    key: 'post',
	    value: function post(request) {
	      return this.send('POST', request);
	    }
	  }, {
	    key: 'patch',
	    value: function patch(request) {
	      return this.send('PATCH', request);
	    }
	  }, {
	    key: 'put',
	    value: function put(request) {
	      return this.send('PUT', request);
	    }
	  }, {
	    key: 'delete',
	    value: function _delete(request) {
	      return this.send('DELETE', request);
	    }
	  }], [{
	    key: 'addIntercept',
	    value: function addIntercept(cb) {
	      this.interceptors.push(cb);
	    }
	  }, {
	    key: 'interceptRequest',
	    value: function interceptRequest(request) {
	      Http.interceptors.forEach(function (interceptor) {
	        interceptor.call(null, request);
	      });

	      return request;
	    }
	  }, {
	    key: 'clearInterceptors',
	    value: function clearInterceptors() {
	      this.interceptors = [];
	    }
	  }]);

	  return Http;
	}();

	Http.interceptors = [];

	exports.default = Http;

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Response = function () {
	  function Response(code, body, headers) {
	    _classCallCheck(this, Response);

	    this.code = code;
	    this.body = body;
	    this.headers = headers;
	  }

	  _createClass(Response, [{
	    key: "json",
	    get: function get() {
	      return JSON.parse(this.body);
	    }
	  }, {
	    key: "text",
	    get: function get() {
	      return this.body;
	    }
	  }, {
	    key: "statusCode",
	    get: function get() {
	      return this.code;
	    }
	  }]);

	  return Response;
	}();

	exports.default = Response;

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Request = function Request(url, data, headers) {
	  _classCallCheck(this, Request);

	  this.url = url;
	  this.headers = headers || {};
	  this.data = data;
	};

	exports.default = Request;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
		if (true) {
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else if (typeof module !== 'undefined' && module.exports){
			module.exports = factory();
		} else {
			global.UriTemplate = factory();
		}
	})(this, function () {
		var uriTemplateGlobalModifiers = {
			"+": true,
			"#": true,
			".": true,
			"/": true,
			";": true,
			"?": true,
			"&": true
		};
		var uriTemplateSuffices = {
			"*": true
		};

		function notReallyPercentEncode(string) {
			return encodeURI(string).replace(/%25[0-9][0-9]/g, function (doubleEncoded) {
				return "%" + doubleEncoded.substring(3);
			});
		}

		function uriTemplateSubstitution(spec) {
			var modifier = "";
			if (uriTemplateGlobalModifiers[spec.charAt(0)]) {
				modifier = spec.charAt(0);
				spec = spec.substring(1);
			}
			var separator = "";
			var prefix = "";
			var shouldEscape = true;
			var showVariables = false;
			var trimEmptyString = false;
			if (modifier == '+') {
				shouldEscape = false;
			} else if (modifier == ".") {
				prefix = ".";
				separator = ".";
			} else if (modifier == "/") {
				prefix = "/";
				separator = "/";
			} else if (modifier == '#') {
				prefix = "#";
				shouldEscape = false;
			} else if (modifier == ';') {
				prefix = ";";
				separator = ";",
				showVariables = true;
				trimEmptyString = true;
			} else if (modifier == '?') {
				prefix = "?";
				separator = "&",
				showVariables = true;
			} else if (modifier == '&') {
				prefix = "&";
				separator = "&",
				showVariables = true;
			}

			var varNames = [];
			var varList = spec.split(",");
			var varSpecs = [];
			var varSpecMap = {};
			for (var i = 0; i < varList.length; i++) {
				var varName = varList[i];
				var truncate = null;
				if (varName.indexOf(":") != -1) {
					var parts = varName.split(":");
					varName = parts[0];
					truncate = parseInt(parts[1]);
				}
				var suffices = {};
				while (uriTemplateSuffices[varName.charAt(varName.length - 1)]) {
					suffices[varName.charAt(varName.length - 1)] = true;
					varName = varName.substring(0, varName.length - 1);
				}
				var varSpec = {
					truncate: truncate,
					name: varName,
					suffices: suffices
				};
				varSpecs.push(varSpec);
				varSpecMap[varName] = varSpec;
				varNames.push(varName);
			}
			var subFunction = function (valueFunction) {
				var result = "";
				var startIndex = 0;
				for (var i = 0; i < varSpecs.length; i++) {
					var varSpec = varSpecs[i];
					var value = valueFunction(varSpec.name);
					if (value == null || (Array.isArray(value) && value.length == 0) || (typeof value == 'object' && Object.keys(value).length == 0)) {
						startIndex++;
						continue;
					}
					if (i == startIndex) {
						result += prefix;
					} else {
						result += (separator || ",");
					}
					if (Array.isArray(value)) {
						if (showVariables) {
							result += varSpec.name + "=";
						}
						for (var j = 0; j < value.length; j++) {
							if (j > 0) {
								result += varSpec.suffices['*'] ? (separator || ",") : ",";
								if (varSpec.suffices['*'] && showVariables) {
									result += varSpec.name + "=";
								}
							}
							result += shouldEscape ? encodeURIComponent(value[j]).replace(/!/g, "%21") : notReallyPercentEncode(value[j]);
						}
					} else if (typeof value == "object") {
						if (showVariables && !varSpec.suffices['*']) {
							result += varSpec.name + "=";
						}
						var first = true;
						for (var key in value) {
							if (!first) {
								result += varSpec.suffices['*'] ? (separator || ",") : ",";
							}
							first = false;
							result += shouldEscape ? encodeURIComponent(key).replace(/!/g, "%21") : notReallyPercentEncode(key);
							result += varSpec.suffices['*'] ? '=' : ",";
							result += shouldEscape ? encodeURIComponent(value[key]).replace(/!/g, "%21") : notReallyPercentEncode(value[key]);
						}
					} else {
						if (showVariables) {
							result += varSpec.name;
							if (!trimEmptyString || value != "") {
								result += "=";
							}
						}
						if (varSpec.truncate != null) {
							value = value.substring(0, varSpec.truncate);
						}
						result += shouldEscape ? encodeURIComponent(value).replace(/!/g, "%21"): notReallyPercentEncode(value);
					}
				}
				return result;
			};
			var guessFunction = function (stringValue, resultObj) {
				if (prefix) {
					if (stringValue.substring(0, prefix.length) == prefix) {
						stringValue = stringValue.substring(prefix.length);
					} else {
						return null;
					}
				}
				if (varSpecs.length == 1 && varSpecs[0].suffices['*']) {
					var varSpec = varSpecs[0];
					var varName = varSpec.name;
					var arrayValue = varSpec.suffices['*'] ? stringValue.split(separator || ",") : [stringValue];
					var hasEquals = (shouldEscape && stringValue.indexOf('=') != -1);	// There's otherwise no way to distinguish between "{value*}" for arrays and objects
					for (var i = 1; i < arrayValue.length; i++) {
						var stringValue = arrayValue[i];
						if (hasEquals && stringValue.indexOf('=') == -1) {
							// Bit of a hack - if we're expecting "=" for key/value pairs, and values can't contain "=", then assume a value has been accidentally split
							arrayValue[i - 1] += (separator || ",") + stringValue;
							arrayValue.splice(i, 1);
							i--;
						}
					}
					for (var i = 0; i < arrayValue.length; i++) {
						var stringValue = arrayValue[i];
						if (shouldEscape && stringValue.indexOf('=') != -1) {
							hasEquals = true;
						}
						var innerArrayValue = stringValue.split(",");
						for (var j = 0; j < innerArrayValue.length; j++) {
							if (shouldEscape) {
								innerArrayValue[j] = decodeURIComponent(innerArrayValue[j]);
							}
						}
						if (innerArrayValue.length == 1) {
							arrayValue[i] = innerArrayValue[0];
						} else {
							arrayValue[i] = innerArrayValue;
						}
					}

					if (showVariables || hasEquals) {
						var objectValue = resultObj[varName] || {};
						for (var j = 0; j < arrayValue.length; j++) {
							var innerValue = stringValue;
							if (showVariables && !innerValue) {
								// The empty string isn't a valid variable, so if our value is zero-length we have nothing
								continue;
							}
							if (typeof arrayValue[j] == "string") {
								var stringValue = arrayValue[j];
								var innerVarName = stringValue.split("=", 1)[0];
								var stringValue = stringValue.substring(innerVarName.length + 1);
								innerValue = stringValue;
							} else {
								var stringValue = arrayValue[j][0];
								var innerVarName = stringValue.split("=", 1)[0];
								var stringValue = stringValue.substring(innerVarName.length + 1);
								arrayValue[j][0] = stringValue;
								innerValue = arrayValue[j];
							}
							if (objectValue[innerVarName] !== undefined) {
								if (Array.isArray(objectValue[innerVarName])) {
									objectValue[innerVarName].push(innerValue);
								} else {
									objectValue[innerVarName] = [objectValue[innerVarName], innerValue];
								}
							} else {
								objectValue[innerVarName] = innerValue;
							}
						}
						if (Object.keys(objectValue).length == 1 && objectValue[varName] !== undefined) {
							resultObj[varName] = objectValue[varName];
						} else {
							resultObj[varName] = objectValue;
						}
					} else {
						if (resultObj[varName] !== undefined) {
							if (Array.isArray(resultObj[varName])) {
								resultObj[varName] = resultObj[varName].concat(arrayValue);
							} else {
								resultObj[varName] = [resultObj[varName]].concat(arrayValue);
							}
						} else {
							if (arrayValue.length == 1 && !varSpec.suffices['*']) {
								resultObj[varName] = arrayValue[0];
							} else {
								resultObj[varName] = arrayValue;
							}
						}
					}
				} else {
					var arrayValue = (varSpecs.length == 1) ? [stringValue] : stringValue.split(separator || ",");
					var specIndexMap = {};
					for (var i = 0; i < arrayValue.length; i++) {
						// Try from beginning
						var firstStarred = 0;
						for (; firstStarred < varSpecs.length - 1 && firstStarred < i; firstStarred++) {
							if (varSpecs[firstStarred].suffices['*']) {
								break;
							}
						}
						if (firstStarred == i) {
							// The first [i] of them have no "*" suffix
							specIndexMap[i] = i;
							continue;
						} else {
							// Try from the end
							for (var lastStarred = varSpecs.length - 1; lastStarred > 0 && (varSpecs.length - lastStarred) < (arrayValue.length - i); lastStarred--) {
								if (varSpecs[lastStarred].suffices['*']) {
									break;
								}
							}
							if ((varSpecs.length - lastStarred) == (arrayValue.length - i)) {
								// The last [length - i] of them have no "*" suffix
								specIndexMap[i] = lastStarred;
								continue;
							}
						}
						// Just give up and use the first one
						specIndexMap[i] = firstStarred;
					}
					for (var i = 0; i < arrayValue.length; i++) {
						var stringValue = arrayValue[i];
						if (!stringValue && showVariables) {
							// The empty string isn't a valid variable, so if our value is zero-length we have nothing
							continue;
						}
						var innerArrayValue = stringValue.split(",");
						var hasEquals = false;

						if (showVariables) {
							var stringValue = innerArrayValue[0]; // using innerArrayValue
							var varName = stringValue.split("=", 1)[0];
							var stringValue = stringValue.substring(varName.length + 1);
							innerArrayValue[0] = stringValue;
							var varSpec = varSpecMap[varName] || varSpecs[0];
						} else {
							var varSpec = varSpecs[specIndexMap[i]];
							var varName = varSpec.name;
						}

						for (var j = 0; j < innerArrayValue.length; j++) {
							if (shouldEscape) {
								innerArrayValue[j] = decodeURIComponent(innerArrayValue[j]);
							}
						}

						if ((showVariables || varSpec.suffices['*'])&& resultObj[varName] !== undefined) {
							if (Array.isArray(resultObj[varName])) {
								resultObj[varName] = resultObj[varName].concat(innerArrayValue);
							} else {
								resultObj[varName] = [resultObj[varName]].concat(innerArrayValue);
							}
						} else {
							if (innerArrayValue.length == 1 && !varSpec.suffices['*']) {
								resultObj[varName] = innerArrayValue[0];
							} else {
								resultObj[varName] = innerArrayValue;
							}
						}
					}
				}
			};
			subFunction.varNames = varNames;
			return {
				prefix: prefix,
				substitution: subFunction,
				unSubstitution: guessFunction
			};
		}

		function UriTemplate(template) {
			if (!(this instanceof UriTemplate)) {
				return new UriTemplate(template);
			}
			var parts = template.split("{");
			var textParts = [parts.shift()];
			var prefixes = [];
			var substitutions = [];
			var unSubstitutions = [];
			var varNames = [];
			while (parts.length > 0) {
				var part = parts.shift();
				var spec = part.split("}")[0];
				var remainder = part.substring(spec.length + 1);
				var funcs = uriTemplateSubstitution(spec);
				substitutions.push(funcs.substitution);
				unSubstitutions.push(funcs.unSubstitution);
				prefixes.push(funcs.prefix);
				textParts.push(remainder);
				varNames = varNames.concat(funcs.substitution.varNames);
			}
			this.fill = function (valueFunction) {
				if (valueFunction && typeof valueFunction !== 'function') {
					var value = valueFunction;
					valueFunction = function (varName) {
						return value[varName];
					};
				}

				var result = textParts[0];
				for (var i = 0; i < substitutions.length; i++) {
					var substitution = substitutions[i];
					result += substitution(valueFunction);
					result += textParts[i + 1];
				}
				return result;
			};
			this.fromUri = function (substituted) {
				var result = {};
				for (var i = 0; i < textParts.length; i++) {
					var part = textParts[i];
					if (substituted.substring(0, part.length) !== part) {
						return undefined;
					}
					substituted = substituted.substring(part.length);
					if (i >= textParts.length - 1) {
						if (substituted == "") {
							break;
						} else {
							return undefined;
						}
					}
					var nextPart = textParts[i + 1];
					var offset = i;
					while (true) {
						if (offset == textParts.length - 2) {
							var endPart = substituted.substring(substituted.length - nextPart.length);
							if (endPart !== nextPart) {
								return undefined;
							}
							var stringValue = substituted.substring(0, substituted.length - nextPart.length);
							substituted = endPart;
						} else if (nextPart) {
							var nextPartPos = substituted.indexOf(nextPart);
							var stringValue = substituted.substring(0, nextPartPos);
							substituted = substituted.substring(nextPartPos);
						} else if (prefixes[offset + 1]) {
							var nextPartPos = substituted.indexOf(prefixes[offset + 1]);
							if (nextPartPos === -1) nextPartPos = substituted.length;
							var stringValue = substituted.substring(0, nextPartPos);
							substituted = substituted.substring(nextPartPos);
						} else if (textParts.length > offset + 2) {
							// If the separator between this variable and the next is blank (with no prefix), continue onwards
							offset++;
							nextPart = textParts[offset + 1];
							continue;
						} else {
							var stringValue = substituted;
							substituted = "";
						}
						break;
					}
					unSubstitutions[i](stringValue, result);
				}
				return result;
			}
			this.varNames = varNames;
			this.template = template;
		}
		UriTemplate.prototype = {
			toString: function () {
				return this.template;
			},
			fillFromObject: function (obj) {
				return this.fill(obj);
			}
		};

		return UriTemplate;
	});


/***/ }
/******/ ])
});
;