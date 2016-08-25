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
	  ResourceCollection: __webpack_require__(8).default,
	  Http: __webpack_require__(3).default,
	  Request: __webpack_require__(7).default,
	  Response: __webpack_require__(4).default
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

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _http = __webpack_require__(3);

	var _http2 = _interopRequireDefault(_http);

	var _link = __webpack_require__(5);

	var _link2 = _interopRequireDefault(_link);

	var _request = __webpack_require__(7);

	var _request2 = _interopRequireDefault(_request);

	var _resourceCollection = __webpack_require__(8);

	var _resourceCollection2 = _interopRequireDefault(_resourceCollection);

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

	    if (typeof resource[key] === 'function') {
	      return;
	    }

	    serialized[key] = resource[key];
	  });

	  return serialized;
	}

	function buildOptions(name, single, options) {
	  var config = options || {};

	  config.single = single;
	  config.name = name;

	  if (!config.accessor) {
	    config.accessor = name;
	  }

	  if (!config.class) {
	    config.class = Resource; // eslint-disable-line no-use-before-define
	  }

	  return config;
	}

	function buildUri(base, params) {
	  var urlParams = params || {};

	  var url = (0, _uriTemplates2.default)(base).fill(urlParams);

	  if (url.substr(url.length - 1) === '/') {
	    url = url.substr(0, url.length - 1);
	  }

	  return url;
	}

	function makeHttpRequest(request, className) {
	  return new Promise(function (resolve, reject) {
	    return new _http2.default().send(request).then(function (response) {
	      resolve(new className(response.json)); // eslint-disable-line new-cap
	    }).catch(function (error) {
	      reject(error);
	    });
	  });
	}

	var getDefaultEmbeddedValue = function getDefaultEmbeddedValue(config) {
	  return config.single ? undefined : [];
	};

	var setEmbeddedData = function setEmbeddedData(resource, config, data) {
	  if (Array.isArray(data)) {
	    if (config.single) {
	      resource.embeddedResources[config.accessor] = data[0];
	    } else {
	      resource.embeddedResources[config.accessor] = data;
	    }
	  } else {
	    if (config.single) {
	      resource.embeddedResources[config.accessor] = data;
	    } else {
	      resource.embeddedResources[config.accessor].push(data);
	    }
	  }
	};

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
	      this.createEmbeddedAccesor(this.embeddedConfig[name]);
	    }
	  }, {
	    key: 'hasMany',
	    value: function hasMany(name, options) {
	      this.embeddedConfig[name] = buildOptions(name, false, options);
	      this.createEmbeddedAccesor(this.embeddedConfig[name]);
	    }
	  }, {
	    key: 'getLink',
	    value: function getLink(name) {
	      if (name in this.internalHalLinks) {
	        return this.internalHalLinks[name];
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
	            Object.keys(data._links).forEach(function (index) {
	              _this.internalHalLinks[index] = _link2.default.create(data._links[index]);
	            });
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
	      this.embeddedResources[config.accessor] = new config.class(data); // eslint-disable-line new-cap
	      this.createEmbeddedAccesor(config);
	    }
	  }, {
	    key: 'hydrateOneToManyEmbeddedResource',
	    value: function hydrateOneToManyEmbeddedResource(data, config) {
	      var resource = new config.class(data); // eslint-disable-line new-cap
	      this.embeddedResources[config.accessor].push(resource);
	      this.createEmbeddedAccesor(config);
	    }
	  }, {
	    key: 'createEmbeddedAccesor',
	    value: function createEmbeddedAccesor(config) {
	      var _this3 = this;

	      this[config.accessor] = function (data) {
	        if (typeof data !== 'undefined') {
	          setEmbeddedData(_this3, config, data);
	        }

	        return config.accessor in _this3.embeddedResources ? _this3.embeddedResources[config.accessor] : getDefaultEmbeddedValue(config);
	      };
	    }
	  }, {
	    key: 'update',
	    value: function update() {
	      if (!this.constructor.url) {
	        throw new Error('Resource url not defined');
	      }

	      var data = buildCleanResource(this);
	      var request = new _request2.default('patch', buildUri(this.constructor.url, data), JSON.stringify(data));
	      request.setHeader('Content-Type', 'application/json');

	      return makeHttpRequest(request, this.constructor);
	    }
	  }, {
	    key: 'replace',
	    value: function replace() {
	      if (!this.constructor.url) {
	        throw new Error('Resource url not defined');
	      }

	      var data = buildCleanResource(this);
	      var request = new _request2.default('put', buildUri(this.constructor.url, data), JSON.stringify(data));
	      request.setHeader('Content-Type', 'application/json');

	      return makeHttpRequest(request, this.constructor);
	    }
	  }, {
	    key: 'delete',
	    value: function _delete() {
	      if (!this.constructor.url) {
	        throw new Error('Resource url not defined');
	      }

	      var request = new _request2.default('delete', buildUri(this.constructor.url, this));
	      return makeHttpRequest(request, this.constructor);
	    }
	  }, {
	    key: 'rawData',
	    get: function get() {
	      return buildCleanResource(this);
	    }
	  }], [{
	    key: 'get',
	    value: function get(params) {
	      if (!this.url) {
	        throw new Error('Resource url not defined');
	      }

	      var request = new _request2.default('get', buildUri(this.url, params));
	      return makeHttpRequest(request, this);
	    }
	  }, {
	    key: 'getCollection',
	    value: function getCollection(params) {
	      var _this4 = this;

	      if (!this.url) {
	        throw new Error('Resource url not defined');
	      }

	      var request = new _request2.default('get', buildUri(this.url, params));

	      return new _http2.default().send(request).then(function (response) {
	        return new _resourceCollection2.default(_this4.collectionKey, _this4, response.json);
	      });
	    }
	  }, {
	    key: 'create',
	    value: function create(data, params) {
	      if (!this.url) {
	        throw new Error('Resource url not defined');
	      }

	      var url = this.url;

	      if (this.urlOverrides && this.urlOverrides.POST) {
	        url = this.urlOverrides.POST;
	      }

	      var resource = buildCleanResource(data);
	      var request = new _request2.default('post', buildUri(url, params), JSON.stringify(resource));
	      request.setHeader('Content-Type', 'application/json');

	      return makeHttpRequest(request, this);
	    }
	  }]);

	  return Resource;
	}();

	exports.default = Resource;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

	function buildXhr(request) {
	  var xhr = new XMLHttpRequest();

	  if ('withCredentials' in xhr) {
	    xhr.open(request.method.toUpperCase(), request.url, true);
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

	function parseHeaders(headerString) {
	  var headers = {};

	  if (!headerString) {
	    return headers;
	  }

	  var headerRows = headerString.trim().split('\r\n');
	  headerRows.forEach(function (header) {
	    var values = header.split(':', 2);
	    headers[values[0].trim()] = values[1].trim();
	  });

	  return headers;
	}

	var Http = function () {
	  function Http() {
	    _classCallCheck(this, Http);
	  }

	  _createClass(Http, [{
	    key: 'send',
	    value: function send(request) {
	      Http.interceptRequest(request);

	      var xhr = buildXhr(request);

	      return new Promise(function (resolve, reject) {
	        xhr.onload = function () {
	          var response = new _response2.default(xhr.status, xhr.responseText, parseHeaders(xhr.getAllResponseHeaders()));

	          if (xhr.status >= 200 && xhr.status < 400) {
	            resolve(response);
	          } else {
	            reject(response);
	          }
	        };

	        xhr.onerror = function () {
	          return reject(Error('Request failed'));
	        };
	        xhr.send(stringify(request.content, request.headers));
	      });
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
	        return interceptor.call(null, request);
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

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _uriTemplates = __webpack_require__(6);

	var _uriTemplates2 = _interopRequireDefault(_uriTemplates);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Link = function () {
	  function Link() {
	    _classCallCheck(this, Link);
	  }

	  _createClass(Link, [{
	    key: 'fill',
	    value: function fill(params) {
	      var href = this.toString();

	      if (!href) {
	        return href;
	      }

	      return (0, _uriTemplates2.default)(href).fill(params);
	    }
	  }, {
	    key: 'toString',
	    value: function toString() {
	      return 'href' in this ? this.href : undefined;
	    }
	  }], [{
	    key: 'create',
	    value: function create(link) {
	      return Object.assign(new Link(), link);
	    }
	  }]);

	  return Link;
	}();

	exports.default = Link;

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


/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Request = function () {
	  function Request(method, url, content, headers) {
	    _classCallCheck(this, Request);

	    this.method = method;
	    this.url = url;
	    this.headers = headers || {};
	    this.content = content;
	  }

	  _createClass(Request, [{
	    key: "hasHeader",
	    value: function hasHeader(header) {
	      return header in this.headers;
	    }
	  }, {
	    key: "getHeader",
	    value: function getHeader(header) {
	      if (this.hasHeader(header)) {
	        return this.headers[header];
	      }
	    }
	  }, {
	    key: "setHeader",
	    value: function setHeader(name, value) {
	      this.headers[name] = value;
	    }
	  }]);

	  return Request;
	}();

	exports.default = Request;

/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ResourceCollection = function () {
	  function ResourceCollection(key, ctor, data) {
	    _classCallCheck(this, ResourceCollection);

	    this.key = key;
	    this.ctor = ctor;
	    this.data = data;
	  }

	  _createClass(ResourceCollection, [{
	    key: "items",
	    get: function get() {
	      var _this = this;

	      return this.data._embedded[this.key].map(function (item) {
	        return new _this.ctor(item); // eslint-disable-line new-cap
	      });
	    }
	  }]);

	  return ResourceCollection;
	}();

	exports.default = ResourceCollection;

/***/ }
/******/ ])
});
;