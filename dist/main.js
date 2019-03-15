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

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/*INPUT & COFIG*/\nconst method = \"GET\";\nconst url = \"data.json\";\nconst months = [\"Jan\", \"Feb\", \"Mar\", \"Apr\", \"May\", \"Jun\", \"Jul\", \"Aug\", \"Sept\", \"Oct\", \"Nov\", \"Dec\"];\nconst WIDHT = 1200;\nconst HEIGHT = 800;\n\n/*TRANSPORT*/\nfunction getJson(method, url) {\n    return new Promise(function (resolve, reject) {\n        let xhr = new XMLHttpRequest();\n        xhr.open(method, url);\n        xhr.onload = () => {\n            if (xhr.status >= 200 && xhr.status < 300) {\n                resolve(xhr.response);\n            } else {\n                reject({\n                    status: this.status,\n                    statusText: xhr.statusText\n                });\n            }\n        };\n        xhr.onerror = () => {\n            reject({\n                status: this.status,\n                statusText: xhr.statusText\n            });\n        };\n        xhr.send();\n    })\n}\n\n/* UTILS */\nconst createCanvas = (width, height, id) => {\n    let canvas = document.createElement(\"canvas\");\n    canvas.width = width;\n    canvas.height = height;\n    canvas.id = id;\n    return canvas\n};\n\nconst getDate = timestamp => {\n    let date = new Date(timestamp);\n    return months[date.getMonth()];\n};\n\n/*RUNTIME*/\nasync function init() {\n    let data = await getJson(method, url);\n    return JSON.parse(data);\n}\n\ninit()\n    .then(result => {\n        parseFeed(result[0])\n    });\n\nconst parseFeed = (feed) => {\n    const graphs = [];\n    const {colors, names, types, columns} = feed;\n\n    /*CANVAS*/\n    const mainImg = createCanvas(WIDHT, HEIGHT, 'mainImg');\n    let ctx = mainImg.getContext(\"2d\");\n    ctx.scale(1, 1);\n\n    const drawGraph = (input) => {\n        ctx.lineWidth = 3;\n        ctx.beginPath();\n        ctx.strokeStyle = input.color;\n        ctx.lineJoin = 'round';\n\n        const {x, y} = input.data;\n\n        for (let i = 0; i < x.length; i++) {\n            ctx.lineTo(i*10, y[i]);\n        }\n\n        ctx.stroke();\n\n    };\n\n    Object.entries(names).forEach(([key, value]) => {\n        let graph = {\n            color: colors[key],\n            name: names[key],\n            type: types[key],\n            data: {\n                x: columns.find(col => col.includes(\"x\")),\n                y: columns.find(col => col.includes(key))\n            }\n        };\n\n        graphs.push(graph);\n        drawGraph(graph);\n    });\n\n    end(mainImg);\n\n};\n\nconst deleteGraph = (data) => {\n\n};\n\nconst end = (mainImg) => {\n    document.body.appendChild(mainImg);\n};\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })

/******/ });