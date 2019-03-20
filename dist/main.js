/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/lib/loader.js!./src/style.scss":
/*!*******************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/lib/loader.js!./src/style.scss ***!
  \*******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("exports = module.exports = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ \"./node_modules/css-loader/dist/runtime/api.js\")(false);\n// Module\nexports.push([module.i, \"body {\\n  display: flex;\\n  flex-direction: column;\\n  align-items: center; }\\n\\n#mainImg, #helper {\\n  transform: scale(1, -1); }\\n\\n#helper {\\n  margin-top: 50px;\\n  margin-bottom: 50px; }\\n\\ncanvas #mainImg {\\n  padding: 100px;\\n  border: 2px solid cadetblue; }\\n\\nbutton {\\n  border-radius: 32px; }\\n\", \"\"]);\n\n\n\n//# sourceURL=webpack:///./src/style.scss?./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/lib/loader.js");

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n/*\n  MIT License http://www.opensource.org/licenses/mit-license.php\n  Author Tobias Koppers @sokra\n*/\n// css base code, injected by the css-loader\nmodule.exports = function (useSourceMap) {\n  var list = []; // return the list of modules as css string\n\n  list.toString = function toString() {\n    return this.map(function (item) {\n      var content = cssWithMappingToString(item, useSourceMap);\n\n      if (item[2]) {\n        return '@media ' + item[2] + '{' + content + '}';\n      } else {\n        return content;\n      }\n    }).join('');\n  }; // import a list of modules into the list\n\n\n  list.i = function (modules, mediaQuery) {\n    if (typeof modules === 'string') {\n      modules = [[null, modules, '']];\n    }\n\n    var alreadyImportedModules = {};\n\n    for (var i = 0; i < this.length; i++) {\n      var id = this[i][0];\n\n      if (id != null) {\n        alreadyImportedModules[id] = true;\n      }\n    }\n\n    for (i = 0; i < modules.length; i++) {\n      var item = modules[i]; // skip already imported module\n      // this implementation is not 100% perfect for weird media query combinations\n      // when a module is imported multiple times with different media queries.\n      // I hope this will never occur (Hey this way we have smaller bundles)\n\n      if (item[0] == null || !alreadyImportedModules[item[0]]) {\n        if (mediaQuery && !item[2]) {\n          item[2] = mediaQuery;\n        } else if (mediaQuery) {\n          item[2] = '(' + item[2] + ') and (' + mediaQuery + ')';\n        }\n\n        list.push(item);\n      }\n    }\n  };\n\n  return list;\n};\n\nfunction cssWithMappingToString(item, useSourceMap) {\n  var content = item[1] || '';\n  var cssMapping = item[3];\n\n  if (!cssMapping) {\n    return content;\n  }\n\n  if (useSourceMap && typeof btoa === 'function') {\n    var sourceMapping = toComment(cssMapping);\n    var sourceURLs = cssMapping.sources.map(function (source) {\n      return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */';\n    });\n    return [content].concat(sourceURLs).concat([sourceMapping]).join('\\n');\n  }\n\n  return [content].join('\\n');\n} // Adapted from convert-source-map (MIT)\n\n\nfunction toComment(sourceMap) {\n  // eslint-disable-next-line no-undef\n  var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));\n  var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;\n  return '/*# ' + data + ' */';\n}\n\n//# sourceURL=webpack:///./node_modules/css-loader/dist/runtime/api.js?");

/***/ }),

/***/ "./node_modules/style-loader/lib/addStyles.js":
/*!****************************************************!*\
  !*** ./node_modules/style-loader/lib/addStyles.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/*\n\tMIT License http://www.opensource.org/licenses/mit-license.php\n\tAuthor Tobias Koppers @sokra\n*/\n\nvar stylesInDom = {};\n\nvar\tmemoize = function (fn) {\n\tvar memo;\n\n\treturn function () {\n\t\tif (typeof memo === \"undefined\") memo = fn.apply(this, arguments);\n\t\treturn memo;\n\t};\n};\n\nvar isOldIE = memoize(function () {\n\t// Test for IE <= 9 as proposed by Browserhacks\n\t// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805\n\t// Tests for existence of standard globals is to allow style-loader\n\t// to operate correctly into non-standard environments\n\t// @see https://github.com/webpack-contrib/style-loader/issues/177\n\treturn window && document && document.all && !window.atob;\n});\n\nvar getTarget = function (target, parent) {\n  if (parent){\n    return parent.querySelector(target);\n  }\n  return document.querySelector(target);\n};\n\nvar getElement = (function (fn) {\n\tvar memo = {};\n\n\treturn function(target, parent) {\n                // If passing function in options, then use it for resolve \"head\" element.\n                // Useful for Shadow Root style i.e\n                // {\n                //   insertInto: function () { return document.querySelector(\"#foo\").shadowRoot }\n                // }\n                if (typeof target === 'function') {\n                        return target();\n                }\n                if (typeof memo[target] === \"undefined\") {\n\t\t\tvar styleTarget = getTarget.call(this, target, parent);\n\t\t\t// Special case to return head of iframe instead of iframe itself\n\t\t\tif (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {\n\t\t\t\ttry {\n\t\t\t\t\t// This will throw an exception if access to iframe is blocked\n\t\t\t\t\t// due to cross-origin restrictions\n\t\t\t\t\tstyleTarget = styleTarget.contentDocument.head;\n\t\t\t\t} catch(e) {\n\t\t\t\t\tstyleTarget = null;\n\t\t\t\t}\n\t\t\t}\n\t\t\tmemo[target] = styleTarget;\n\t\t}\n\t\treturn memo[target]\n\t};\n})();\n\nvar singleton = null;\nvar\tsingletonCounter = 0;\nvar\tstylesInsertedAtTop = [];\n\nvar\tfixUrls = __webpack_require__(/*! ./urls */ \"./node_modules/style-loader/lib/urls.js\");\n\nmodule.exports = function(list, options) {\n\tif (typeof DEBUG !== \"undefined\" && DEBUG) {\n\t\tif (typeof document !== \"object\") throw new Error(\"The style-loader cannot be used in a non-browser environment\");\n\t}\n\n\toptions = options || {};\n\n\toptions.attrs = typeof options.attrs === \"object\" ? options.attrs : {};\n\n\t// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>\n\t// tags it will allow on a page\n\tif (!options.singleton && typeof options.singleton !== \"boolean\") options.singleton = isOldIE();\n\n\t// By default, add <style> tags to the <head> element\n        if (!options.insertInto) options.insertInto = \"head\";\n\n\t// By default, add <style> tags to the bottom of the target\n\tif (!options.insertAt) options.insertAt = \"bottom\";\n\n\tvar styles = listToStyles(list, options);\n\n\taddStylesToDom(styles, options);\n\n\treturn function update (newList) {\n\t\tvar mayRemove = [];\n\n\t\tfor (var i = 0; i < styles.length; i++) {\n\t\t\tvar item = styles[i];\n\t\t\tvar domStyle = stylesInDom[item.id];\n\n\t\t\tdomStyle.refs--;\n\t\t\tmayRemove.push(domStyle);\n\t\t}\n\n\t\tif(newList) {\n\t\t\tvar newStyles = listToStyles(newList, options);\n\t\t\taddStylesToDom(newStyles, options);\n\t\t}\n\n\t\tfor (var i = 0; i < mayRemove.length; i++) {\n\t\t\tvar domStyle = mayRemove[i];\n\n\t\t\tif(domStyle.refs === 0) {\n\t\t\t\tfor (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();\n\n\t\t\t\tdelete stylesInDom[domStyle.id];\n\t\t\t}\n\t\t}\n\t};\n};\n\nfunction addStylesToDom (styles, options) {\n\tfor (var i = 0; i < styles.length; i++) {\n\t\tvar item = styles[i];\n\t\tvar domStyle = stylesInDom[item.id];\n\n\t\tif(domStyle) {\n\t\t\tdomStyle.refs++;\n\n\t\t\tfor(var j = 0; j < domStyle.parts.length; j++) {\n\t\t\t\tdomStyle.parts[j](item.parts[j]);\n\t\t\t}\n\n\t\t\tfor(; j < item.parts.length; j++) {\n\t\t\t\tdomStyle.parts.push(addStyle(item.parts[j], options));\n\t\t\t}\n\t\t} else {\n\t\t\tvar parts = [];\n\n\t\t\tfor(var j = 0; j < item.parts.length; j++) {\n\t\t\t\tparts.push(addStyle(item.parts[j], options));\n\t\t\t}\n\n\t\t\tstylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};\n\t\t}\n\t}\n}\n\nfunction listToStyles (list, options) {\n\tvar styles = [];\n\tvar newStyles = {};\n\n\tfor (var i = 0; i < list.length; i++) {\n\t\tvar item = list[i];\n\t\tvar id = options.base ? item[0] + options.base : item[0];\n\t\tvar css = item[1];\n\t\tvar media = item[2];\n\t\tvar sourceMap = item[3];\n\t\tvar part = {css: css, media: media, sourceMap: sourceMap};\n\n\t\tif(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});\n\t\telse newStyles[id].parts.push(part);\n\t}\n\n\treturn styles;\n}\n\nfunction insertStyleElement (options, style) {\n\tvar target = getElement(options.insertInto)\n\n\tif (!target) {\n\t\tthrow new Error(\"Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.\");\n\t}\n\n\tvar lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];\n\n\tif (options.insertAt === \"top\") {\n\t\tif (!lastStyleElementInsertedAtTop) {\n\t\t\ttarget.insertBefore(style, target.firstChild);\n\t\t} else if (lastStyleElementInsertedAtTop.nextSibling) {\n\t\t\ttarget.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);\n\t\t} else {\n\t\t\ttarget.appendChild(style);\n\t\t}\n\t\tstylesInsertedAtTop.push(style);\n\t} else if (options.insertAt === \"bottom\") {\n\t\ttarget.appendChild(style);\n\t} else if (typeof options.insertAt === \"object\" && options.insertAt.before) {\n\t\tvar nextSibling = getElement(options.insertAt.before, target);\n\t\ttarget.insertBefore(style, nextSibling);\n\t} else {\n\t\tthrow new Error(\"[Style Loader]\\n\\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\\n Must be 'top', 'bottom', or Object.\\n (https://github.com/webpack-contrib/style-loader#insertat)\\n\");\n\t}\n}\n\nfunction removeStyleElement (style) {\n\tif (style.parentNode === null) return false;\n\tstyle.parentNode.removeChild(style);\n\n\tvar idx = stylesInsertedAtTop.indexOf(style);\n\tif(idx >= 0) {\n\t\tstylesInsertedAtTop.splice(idx, 1);\n\t}\n}\n\nfunction createStyleElement (options) {\n\tvar style = document.createElement(\"style\");\n\n\tif(options.attrs.type === undefined) {\n\t\toptions.attrs.type = \"text/css\";\n\t}\n\n\tif(options.attrs.nonce === undefined) {\n\t\tvar nonce = getNonce();\n\t\tif (nonce) {\n\t\t\toptions.attrs.nonce = nonce;\n\t\t}\n\t}\n\n\taddAttrs(style, options.attrs);\n\tinsertStyleElement(options, style);\n\n\treturn style;\n}\n\nfunction createLinkElement (options) {\n\tvar link = document.createElement(\"link\");\n\n\tif(options.attrs.type === undefined) {\n\t\toptions.attrs.type = \"text/css\";\n\t}\n\toptions.attrs.rel = \"stylesheet\";\n\n\taddAttrs(link, options.attrs);\n\tinsertStyleElement(options, link);\n\n\treturn link;\n}\n\nfunction addAttrs (el, attrs) {\n\tObject.keys(attrs).forEach(function (key) {\n\t\tel.setAttribute(key, attrs[key]);\n\t});\n}\n\nfunction getNonce() {\n\tif (false) {}\n\n\treturn __webpack_require__.nc;\n}\n\nfunction addStyle (obj, options) {\n\tvar style, update, remove, result;\n\n\t// If a transform function was defined, run it on the css\n\tif (options.transform && obj.css) {\n\t    result = typeof options.transform === 'function'\n\t\t ? options.transform(obj.css) \n\t\t : options.transform.default(obj.css);\n\n\t    if (result) {\n\t    \t// If transform returns a value, use that instead of the original css.\n\t    \t// This allows running runtime transformations on the css.\n\t    \tobj.css = result;\n\t    } else {\n\t    \t// If the transform function returns a falsy value, don't add this css.\n\t    \t// This allows conditional loading of css\n\t    \treturn function() {\n\t    \t\t// noop\n\t    \t};\n\t    }\n\t}\n\n\tif (options.singleton) {\n\t\tvar styleIndex = singletonCounter++;\n\n\t\tstyle = singleton || (singleton = createStyleElement(options));\n\n\t\tupdate = applyToSingletonTag.bind(null, style, styleIndex, false);\n\t\tremove = applyToSingletonTag.bind(null, style, styleIndex, true);\n\n\t} else if (\n\t\tobj.sourceMap &&\n\t\ttypeof URL === \"function\" &&\n\t\ttypeof URL.createObjectURL === \"function\" &&\n\t\ttypeof URL.revokeObjectURL === \"function\" &&\n\t\ttypeof Blob === \"function\" &&\n\t\ttypeof btoa === \"function\"\n\t) {\n\t\tstyle = createLinkElement(options);\n\t\tupdate = updateLink.bind(null, style, options);\n\t\tremove = function () {\n\t\t\tremoveStyleElement(style);\n\n\t\t\tif(style.href) URL.revokeObjectURL(style.href);\n\t\t};\n\t} else {\n\t\tstyle = createStyleElement(options);\n\t\tupdate = applyToTag.bind(null, style);\n\t\tremove = function () {\n\t\t\tremoveStyleElement(style);\n\t\t};\n\t}\n\n\tupdate(obj);\n\n\treturn function updateStyle (newObj) {\n\t\tif (newObj) {\n\t\t\tif (\n\t\t\t\tnewObj.css === obj.css &&\n\t\t\t\tnewObj.media === obj.media &&\n\t\t\t\tnewObj.sourceMap === obj.sourceMap\n\t\t\t) {\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\tupdate(obj = newObj);\n\t\t} else {\n\t\t\tremove();\n\t\t}\n\t};\n}\n\nvar replaceText = (function () {\n\tvar textStore = [];\n\n\treturn function (index, replacement) {\n\t\ttextStore[index] = replacement;\n\n\t\treturn textStore.filter(Boolean).join('\\n');\n\t};\n})();\n\nfunction applyToSingletonTag (style, index, remove, obj) {\n\tvar css = remove ? \"\" : obj.css;\n\n\tif (style.styleSheet) {\n\t\tstyle.styleSheet.cssText = replaceText(index, css);\n\t} else {\n\t\tvar cssNode = document.createTextNode(css);\n\t\tvar childNodes = style.childNodes;\n\n\t\tif (childNodes[index]) style.removeChild(childNodes[index]);\n\n\t\tif (childNodes.length) {\n\t\t\tstyle.insertBefore(cssNode, childNodes[index]);\n\t\t} else {\n\t\t\tstyle.appendChild(cssNode);\n\t\t}\n\t}\n}\n\nfunction applyToTag (style, obj) {\n\tvar css = obj.css;\n\tvar media = obj.media;\n\n\tif(media) {\n\t\tstyle.setAttribute(\"media\", media)\n\t}\n\n\tif(style.styleSheet) {\n\t\tstyle.styleSheet.cssText = css;\n\t} else {\n\t\twhile(style.firstChild) {\n\t\t\tstyle.removeChild(style.firstChild);\n\t\t}\n\n\t\tstyle.appendChild(document.createTextNode(css));\n\t}\n}\n\nfunction updateLink (link, options, obj) {\n\tvar css = obj.css;\n\tvar sourceMap = obj.sourceMap;\n\n\t/*\n\t\tIf convertToAbsoluteUrls isn't defined, but sourcemaps are enabled\n\t\tand there is no publicPath defined then lets turn convertToAbsoluteUrls\n\t\ton by default.  Otherwise default to the convertToAbsoluteUrls option\n\t\tdirectly\n\t*/\n\tvar autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;\n\n\tif (options.convertToAbsoluteUrls || autoFixUrls) {\n\t\tcss = fixUrls(css);\n\t}\n\n\tif (sourceMap) {\n\t\t// http://stackoverflow.com/a/26603875\n\t\tcss += \"\\n/*# sourceMappingURL=data:application/json;base64,\" + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + \" */\";\n\t}\n\n\tvar blob = new Blob([css], { type: \"text/css\" });\n\n\tvar oldSrc = link.href;\n\n\tlink.href = URL.createObjectURL(blob);\n\n\tif(oldSrc) URL.revokeObjectURL(oldSrc);\n}\n\n\n//# sourceURL=webpack:///./node_modules/style-loader/lib/addStyles.js?");

/***/ }),

/***/ "./node_modules/style-loader/lib/urls.js":
/*!***********************************************!*\
  !*** ./node_modules/style-loader/lib/urls.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("\n/**\n * When source maps are enabled, `style-loader` uses a link element with a data-uri to\n * embed the css on the page. This breaks all relative urls because now they are relative to a\n * bundle instead of the current page.\n *\n * One solution is to only use full urls, but that may be impossible.\n *\n * Instead, this function \"fixes\" the relative urls to be absolute according to the current page location.\n *\n * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.\n *\n */\n\nmodule.exports = function (css) {\n  // get current location\n  var location = typeof window !== \"undefined\" && window.location;\n\n  if (!location) {\n    throw new Error(\"fixUrls requires window.location\");\n  }\n\n\t// blank or null?\n\tif (!css || typeof css !== \"string\") {\n\t  return css;\n  }\n\n  var baseUrl = location.protocol + \"//\" + location.host;\n  var currentDir = baseUrl + location.pathname.replace(/\\/[^\\/]*$/, \"/\");\n\n\t// convert each url(...)\n\t/*\n\tThis regular expression is just a way to recursively match brackets within\n\ta string.\n\n\t /url\\s*\\(  = Match on the word \"url\" with any whitespace after it and then a parens\n\t   (  = Start a capturing group\n\t     (?:  = Start a non-capturing group\n\t         [^)(]  = Match anything that isn't a parentheses\n\t         |  = OR\n\t         \\(  = Match a start parentheses\n\t             (?:  = Start another non-capturing groups\n\t                 [^)(]+  = Match anything that isn't a parentheses\n\t                 |  = OR\n\t                 \\(  = Match a start parentheses\n\t                     [^)(]*  = Match anything that isn't a parentheses\n\t                 \\)  = Match a end parentheses\n\t             )  = End Group\n              *\\) = Match anything and then a close parens\n          )  = Close non-capturing group\n          *  = Match anything\n       )  = Close capturing group\n\t \\)  = Match a close parens\n\n\t /gi  = Get all matches, not the first.  Be case insensitive.\n\t */\n\tvar fixedCss = css.replace(/url\\s*\\(((?:[^)(]|\\((?:[^)(]+|\\([^)(]*\\))*\\))*)\\)/gi, function(fullMatch, origUrl) {\n\t\t// strip quotes (if they exist)\n\t\tvar unquotedOrigUrl = origUrl\n\t\t\t.trim()\n\t\t\t.replace(/^\"(.*)\"$/, function(o, $1){ return $1; })\n\t\t\t.replace(/^'(.*)'$/, function(o, $1){ return $1; });\n\n\t\t// already a full url? no change\n\t\tif (/^(#|data:|http:\\/\\/|https:\\/\\/|file:\\/\\/\\/|\\s*$)/i.test(unquotedOrigUrl)) {\n\t\t  return fullMatch;\n\t\t}\n\n\t\t// convert the url to a full url\n\t\tvar newUrl;\n\n\t\tif (unquotedOrigUrl.indexOf(\"//\") === 0) {\n\t\t  \t//TODO: should we add protocol?\n\t\t\tnewUrl = unquotedOrigUrl;\n\t\t} else if (unquotedOrigUrl.indexOf(\"/\") === 0) {\n\t\t\t// path should be relative to the base url\n\t\t\tnewUrl = baseUrl + unquotedOrigUrl; // already starts with '/'\n\t\t} else {\n\t\t\t// path should be relative to current directory\n\t\t\tnewUrl = currentDir + unquotedOrigUrl.replace(/^\\.\\//, \"\"); // Strip leading './'\n\t\t}\n\n\t\t// send back the fixed url(...)\n\t\treturn \"url(\" + JSON.stringify(newUrl) + \")\";\n\t});\n\n\t// send back the fixed css\n\treturn fixedCss;\n};\n\n\n//# sourceURL=webpack:///./node_modules/style-loader/lib/urls.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./style.scss */ \"./src/style.scss\");\n/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_style_scss__WEBPACK_IMPORTED_MODULE_0__);\n\n\n/*INPUT & COFIG*/\nconst method = \"GET\";\nconst url = \"data.json\";\nconst months = [\"Jan\", \"Feb\", \"Mar\", \"Apr\", \"May\", \"Jun\", \"Jul\", \"Aug\", \"Sept\", \"Oct\", \"Nov\", \"Dec\"];\nconst canavsSize = {width: 1200, height: 650};\nconst thumbHeight = 100;\nconst graphHeight = 500;\nconst buttonSize = {width: \"140px\", height: \"50px\"};\nconst YINTERVAL = 6;\nconst AXISOffsetX = 40;\nconst AXISOffsetY = 40;\nconst CORRELATION = 0.9;\nconst PRECISION = 3;\nconst SEPARATE = 150;\n\n/*TRANSPORT*/\nfunction getJson(method, url) {\n    return new Promise(function (resolve, reject) {\n        let xhr = new XMLHttpRequest();\n        xhr.open(method, url);\n        xhr.onload = () => {\n            if (xhr.status >= 200 && xhr.status < 300) {\n                resolve(xhr.response);\n            } else {\n                reject({\n                    status: this.status,\n                    statusText: xhr.statusText\n                });\n            }\n        };\n        xhr.onerror = () => {\n            reject({\n                status: this.status,\n                statusText: xhr.statusText\n            });\n        };\n        xhr.send();\n    })\n}\n\n/*DOM*/\nconst controls = document.getElementById(\"controls\");\nconst main = document.getElementById(\"main\");\n\n/* CONTROL */\nclass Control {\n    constructor() {\n        this.x = 850;\n        this.y = 8;\n        this.width = 350;\n        this.height = 100;\n        this.fill = \"#d4f2f0\";\n        this.isDragging = false;\n        this.isResizing = false;\n    };\n}\n\n/*CHART*/\nclass Chart {\n    constructor(color, name, type, y, max) {\n        this.y = y;\n        this.color = color;\n        this.name = name;\n        this.type = type;\n        this.max = max;\n    };\n}\n\n/*BUTTON*/\nclass Button {\n    constructor(color, id, label, size) {\n        this.color = color;\n        this.id = id;\n        this.label = label;\n        this.size = size;\n    };\n}\n\n/* UTILS */\nconst max = arr => {\n    if (!Array.isArray(arr)) throw new Error(\"array expected\");\n    let max = 0;\n    for (let i = 0, r = arr.length; i < r; i++) {\n        if (arr[i] > max && !isNaN(arr[i])) {\n            max = arr[i];\n        }\n    }\n    return max;\n};\n\nconst createCanvas = ({width, height}, id) => {\n    let canvas = document.createElement(\"canvas\");\n    canvas.width = width;\n    canvas.height = height;\n    canvas.id = id;\n    return canvas\n};\n\nconst objectWithoutKey = (object, key) => {\n    const {[key]: deletedKey, ...otherKeys} = object;\n    return otherKeys;\n};\n\n// deep clone\nconst deepClone = (input) => JSON.parse(JSON.stringify(input));\n\n// remove\nconst remove = (array, element) => array.filter(el => el !== element);\n\n// Jan 24 e.g.\nconst getDate = timestamp => {\n    let date = new Date(timestamp);\n    return `${months[date.getMonth()]} ${date.getUTCDate()}`;\n};\n\n// get simple ratio A to B (with correlation);\nconst getRatioAtoB = (a, b, c, precise = false) => {\n    return precise ? +((a / b) * c).toPrecision(precise) : +(a / b) * c;\n};\n\n/*RUNTIME*/\nasync function init() {\n    let data = await getJson(method, url);\n    return JSON.parse(data);\n}\n\ninit()\n    .then(result => {\n        parseFeed(result[4])\n    });\n\nconst parseFeed = (feed) => {\n    let graphs = {\n        x: [],\n        charts: {},\n        maxY: []\n    };\n    let ratio = {};\n    const control = new Control();\n    let cachedGraph = {};\n    let buttons = {};\n    const {colors, names, types, columns} = feed;\n    const {width} = canavsSize;\n    let {fill} = control;\n\n    /*CANVAS*/\n    const canvas = createCanvas(canavsSize, 'mainImg');\n    let ctx = canvas.getContext(\"2d\");\n    ctx.font = \"18px Arial\";\n\n    // listen for mouse events\n    let dragok = false;\n    let dragL = false;\n    let dragR = false;\n    let startX;\n\n    canvas.onmousedown = myDown;\n    canvas.onmouseup = myUp;\n    canvas.onmousemove = myMove;\n\n    const init = () => {\n        // Form Graphs n Buttons\n\n        /*X is the same for each graph*/\n        graphs.x = columns.find(col => col.includes(\"x\")).filter(item => !isNaN(item)).map(getDate);\n\n        Object.entries(names).forEach(([key, value]) => {\n            // remove first index string type\n            let y = columns.find(col => col.includes(key)).filter(item => !isNaN(item));\n            let max = Math.max(...y);\n\n            // create charts n buttons\n            graphs.charts[key] = new Chart(colors[key], names[key], types[key], y, max);\n            buttons[key] = new Button(colors[key], key, value, buttonSize);\n\n            graphs.maxY.push(max);\n        });\n\n        // interesting approach to manipulate scene redraw, at least for me\n        cachedGraph = deepClone(graphs);\n\n        draw();\n        end(canvas);\n    };\n\n    // clear feed canvas\n    const clearCanvas = ({width, height}) => ctx.clearRect(0, 0, width, height);\n\n    // delete graph from feed canvas\n    const toggleGraph = (evt) => {\n\n        const key = evt.target.id;\n        const  { charts: clonedCharts } = cachedGraph;\n        const  { charts, maxY } = graphs;\n        const tmp = clonedCharts[key];\n\n        /*@TODO think of immutability like redux store*/\n        if (charts[key]) {\n            //delete the graph\n            graphs.charts = objectWithoutKey(charts, key);\n            graphs.maxY = remove(maxY, tmp.max);\n            evt.target.style.backgroundColor = 'white';\n        } else {\n        /*@TODO toggle buttons with SVG*/\n            //add the graph\n            graphs.charts[key] = tmp;\n            graphs.maxY.push(tmp.max);\n            evt.target.style.backgroundColor = tmp.color;\n        }\n        //redraw the scene\n        draw()\n    };\n\n    // create single graph\n    const drawGraph = (input, rX, rY, x, separate = 0) => {\n        let {color, y} = input;\n\n        ctx.lineWidth = 3;\n        ctx.beginPath();\n        ctx.strokeStyle = color;\n        ctx.lineJoin = 'round';\n\n        // LINES\n        for (let i = 0, k = x.length; i < k; i++) {\n            ctx.lineTo(i * rX, y[i] * rY + separate);\n\n            if (i % Math.round(k/YINTERVAL) === 0 && separate) {\n\n                let pos = {x: i * rX, y: -(separate - AXISOffsetY)};\n                drawAxis(getDate(x[i]), pos );\n\n            }\n\n        }\n\n        ctx.stroke();\n\n\n    };\n\n    const drawXLine = () => {\n        ctx.lineWidth = 1;\n        ctx.strokeStyle = 'grey';\n        ctx.fillStyle = 'grey';\n        let gr = ratio.rY;\n        /*draw xAxis*/\n        for (let j = 0; j < YINTERVAL; j++) {\n            ctx.save();\n            let y = CORRELATION * j * graphHeight / YINTERVAL;\n            let val = parseInt(y / gr).toString();\n            let dY = y + SEPARATE;\n\n            /*draw xAxis*/\n            ctx.beginPath();\n            ctx.moveTo(AXISOffsetX, dY);\n\n            ctx.lineTo(width - AXISOffsetX, dY);\n            ctx.scale(1, -1);\n\n            ctx.fillText(val, AXISOffsetX, -(dY + 10));\n            ctx.stroke();\n            ctx.restore();\n        }\n\n    };\n\n    const drawAxis = (text, {x, y}) => {\n        ctx.save();\n        ctx.scale(1, -1);\n        ctx.fillStyle = \"grey\";\n        ctx.fillText(text, x, y);\n        ctx.restore();\n    };\n\n    // create draggable && resizable rectangle\n    const drawControl = () => {\n        ctx.fillStyle = fill;\n        rect(control);\n    };\n\n    // draw a  rect\n    const rect = ({x, y, width, height}) => {\n        ctx.beginPath();\n        ctx.rect(x, y, width, height);\n        ctx.closePath();\n        ctx.fill();\n    };\n\n    // get Mouse Position\n    const getMousePos = (evt) => {\n        let rect = canvas.getBoundingClientRect();\n        return {\n            x: evt.clientX - rect.left,\n            y: evt.clientY - rect.top,\n            ySc: rect.bottom - evt.clientY\n        };\n    };\n\n    // handle mousedown events\n    function myDown(e) {\n        e.preventDefault();\n        e.stopPropagation();\n\n        let {x, y, width, height} = control;\n        // left n right resizable areas\n        let leftSide = new Path2D();\n        let rightSide = new Path2D();\n\n        // current mouse position X, yScaled(1, -1);\n        let {x: mx, ySc: mySc} = getMousePos(e);\n\n        // start\n        /*@TODO remove hardcoded values*/\n        leftSide.rect(x, y, 10, height);\n        rightSide.rect(width + x - 10, y, 10, height);\n\n        // right\n        if (ctx.isPointInPath(rightSide, mx, mySc)) {\n            dragR = true;\n            control.isResizing = true;\n        }\n        // left\n        else if (ctx.isPointInPath(leftSide, mx, mySc)) {\n            dragL = true;\n            control.isResizing = true;\n        }\n        // drag\n        else if (mx > x && mx < x + width) {\n            dragok = true;\n            control.isDragging = true;\n        }\n\n        // save the current mouse position\n        startX = mx;\n    }\n\n    // handle mouseup events\n    function myUp(e) {\n        e.preventDefault();\n        e.stopPropagation();\n\n        /*shut it down*/\n        dragok = dragL = dragR = false;\n        control.isDragging = control.isResizing = false;\n    }\n\n    // handle mouse moves\n    function myMove(e) {\n        // if we're dragging || resizing anything...\n        if (dragok || dragL || dragR) {\n            e.preventDefault();\n            e.stopPropagation();\n\n            let {x, isDragging} = control;\n            // current mouse position X\n            let {x: mx} = getMousePos(e);\n\n            // calculate the distance the mouse has moved since the last mousemove\n            let dx = mx - startX;\n\n            // move control that isDragging by the distance the mouse has moved since the last mousemove\n            if (isDragging) {\n                control.x += dx;\n            } else if (dragL) {\n                control.width += x - mx;\n                control.x = mx;\n            } else if (dragR) {\n                control.width = Math.abs(x - mx);\n            }\n\n            // redraw the scene\n            draw();\n\n            // reset the starting mouse position for the next mousemove\n            startX = mx;\n        }\n    }\n\n    const drawButton = ({id, color, label, size: {width, height}}) => {\n        let button = document.createElement('button');\n        button.id = id;\n        button.innerText = label;\n        button.style.background = color;\n        button.style.width = width;\n        button.style.height = height;\n\n        button.addEventListener(\"click\", toggleGraph);\n        controls.appendChild(button);\n\n    };\n\n    /*Canvas manipulations*/\n    const draw = () => {\n\n        clearCanvas(canavsSize);\n\n        // draw control\n        drawControl();\n\n        // reassign each time\n        let {x: xpos, width: conWidth} = control;\n        let {charts, maxY, x} = graphs;\n\n        ratio.tY = getRatioAtoB(thumbHeight, Math.max(...maxY), CORRELATION, PRECISION);\n        ratio.tX = getRatioAtoB(width, x.length, 1, PRECISION);\n        ratio.rY = [];\n\n        let {tY, tX} = ratio;\n        let thumbs = {};\n\n        // draw main canvas\n        Object.values(charts).forEach(chart => {\n\n            let {color, name, type, y} = chart;\n\n            drawGraph(chart, tX, tY, x);\n            let start, end;\n            if (xpos <= 0) {\n                start = 0;\n                end = xpos + conWidth;\n            } else {\n                start = xpos;\n                end = conWidth;\n            }\n\n            let x1 = Math.round(x.length * getRatioAtoB(end, width, 1));\n            let x0 = Math.round(x.length * getRatioAtoB(start, width, 1));\n\n            let newY = deepClone(y).splice(x0, x1);\n            graphs.newX = deepClone(x).splice(x0, x1);\n            let maxNewY = Math.max(...newY);\n            thumbs[name] = new Chart(color, name, type, newY, maxNewY);\n            ratio.rY.push(getRatioAtoB(graphHeight, maxNewY, CORRELATION, PRECISION));\n        });\n\n        ratio.rX = getRatioAtoB(width, graphs.newX.length, 1, PRECISION);\n        ratio.rY = Math.min(...ratio.rY);\n\n        Object.values(thumbs).forEach(thumb => {\n            // draw chart\n            drawGraph(thumb, ratio.rX, ratio.rY, graphs.newX, SEPARATE);\n        });\n\n        drawXLine();\n\n    };\n\n    /*DOM manipulations*/\n    const end = (canvas) => {\n        main.appendChild(canvas);\n        Object.values(buttons).forEach(drawButton);\n    };\n\n    init();\n\n};\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/style.scss":
/*!************************!*\
  !*** ./src/style.scss ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\nvar content = __webpack_require__(/*! !../node_modules/css-loader/dist/cjs.js!../node_modules/sass-loader/lib/loader.js!./style.scss */ \"./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/lib/loader.js!./src/style.scss\");\n\nif(typeof content === 'string') content = [[module.i, content, '']];\n\nvar transform;\nvar insertInto;\n\n\n\nvar options = {\"hmr\":true}\n\noptions.transform = transform\noptions.insertInto = undefined;\n\nvar update = __webpack_require__(/*! ../node_modules/style-loader/lib/addStyles.js */ \"./node_modules/style-loader/lib/addStyles.js\")(content, options);\n\nif(content.locals) module.exports = content.locals;\n\nif(false) {}\n\n//# sourceURL=webpack:///./src/style.scss?");

/***/ })

/******/ });