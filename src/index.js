import './style.scss';

/*INPUT & COFIG*/
const method = "GET";
const url = "data.json";
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
const canavsSize = { width: 1200, height: 800 };
const buttonSize = { width: "140px", height: "50px" };
const xmlns = "http://www.w3.org/2000/svg";

let controls = document.getElementById("controls");
let main = document.getElementById("main");
const SVG_PATH = "check_circle.svg";

/*window.onload=function() {
    // Get the Object by ID
    var a = document.getElementById("icon-y0");
    // Get the SVG document inside the Object tag
    var svgDoc = a.contentDocument;
    // Get one of the SVG items by ID;
    var svgItem = svgDoc.getElementById("fillme");
    // Set the colour to something else
    svgItem.setAttribute("fill", "red");
};*/

const createCheckCircle = (color) => {
    let svg = document.createElementNS(xmlns, "svg");
    svg.setAttribute("preserveAspectRatio", "none");
    let path = document.createElementNS(xmlns, "path");
    path.setAttributeNS(null, "d", "M1412 734q0-28-18-46l-91-90q-19-19-45-19t-45 19l-408 407-226-226q-19-19-45-19t-45 19l-91 90q-18 18-18 46 0 27 18 45l362 362q19 19 45 19 27 0 46-19l543-543q18-18 18-45zm252 162q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z");
    path.setAttribute("fill", color);
    svg.appendChild(path);
    return svg;
};

class CheckCircleSvg {

    constructor(id){
        this.tagName = "object";
        this.type = "image/svg+xml";
        this.data = SVG_PATH;
        this.id = id;
        this.height = "30px";
        this.width = "30px";
    }
}

/*TRANSPORT*/
function getJson(method, url) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = () => {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send();
    })
}

/* UTILS */
/*@TODO make it generic for all dom elements*/

const createCanvas = ({ width, height }, id) => {
    let canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.id = id;
    return canvas
};

const createDOMelement = (tag, ...rest) => {
    const { tagName, data, type, id, width, height} = tag;
    let elm = document.createElement(tagName);
    elm.setAttribute("id", id);
    elm.setAttribute("width", width);
    elm.setAttribute("height", height);
    elm.setAttribute("type", type);
    elm.setAttribute("data", data);

    return elm;
};

const objectWithoutKey = (object, key) => {
    const {[key]: deletedKey, ...otherKeys} = object;
    return otherKeys;
};

// deep clone
const deepClone = (input) =>  JSON.parse(JSON.stringify(input));

const getDate = timestamp => {
    let date = new Date(timestamp);
    return months[date.getMonth()];
};

/*RUNTIME*/
async function init() {
    let data = await getJson(method, url);
    return JSON.parse(data);
}

init()
    .then(result => {
        parseFeed(result[0])
    });

const parseFeed = (feed) => {
    let graphs = {};
    let cachedGraph = {};
    let buttons = {};
    const {colors, names, types, columns} = feed;

    /*CANVAS*/
    const mainImg = createCanvas(canavsSize, 'mainImg');
    let ctx = mainImg.getContext("2d");

    const init = () => {
        // Form Graphs n Buttons
        Object.entries(names).forEach(([key, value]) => {
            /*@TODO add new Graph() es6 class*/
            graphs[key] = {
                color: colors[key],
                name: names[key],
                type: types[key],
                data: {
                    x: columns.find(col => col.includes("x")),
                    y: columns.find(col => col.includes(key))
                }
            };
            /*@TODO add new Button() es6 class*/
            buttons[key] = {
                color: colors[key],
                id: key,
                label: value,
                size: buttonSize
            };
        });

        //interesting approach to manipulate scene redraw, at least for me
        cachedGraph = deepClone(graphs);

        draw();
        end(mainImg);
    };

    //clear feed canvas
    const clearCanvas = () => {
        const { width, height } = canavsSize;
        ctx.clearRect(0, 0, width, height);
    };

    //delete graph from feed canvas
    const toggleGraph = (evt) => {
        //clear the feed canvas
        clearCanvas();
        const key = evt.target.id;
        const tmp = cachedGraph[key];

        if(graphs[key]){
            //delete the graph
            graphs = objectWithoutKey(graphs, key);
        } else {
            //add the graph
            graphs[key] = tmp;
        }

        //redraw the scene
        draw()
    };

    //create single graph
    const drawGraph = (input) => {
        const { color,  data:{ x, y } }  = input;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineJoin = 'round';

        // LINES
        for (let i = 0, k = x.length; i < k; i++) {
            ctx.lineTo(i*10, y[i]);
        }

        ctx.stroke();

    };

    const drawButton = ({id, color, label, size: { width, height }}) => {
        let button = document.createElement('button');
        let icon = createDOMelement(new CheckCircleSvg(`icon-${id}`), color);
        let cir = createCheckCircle(color);
        let text = document.createElement("span");
        text.innerText = label;

        button.setAttribute("id", id);

        var s = new XMLSerializer();
        var str = s.serializeToString(cir);

        console.log(str);

        button.setAttribute("style", `background-image: url(data:image/svg+xml;utf8,${str}`);
        button.appendChild(text);

        button.addEventListener("click", toggleGraph);
        controls.appendChild(button);

    };

    /*Canvas manipulations*/
    const draw = () => {
        Object.values(graphs).forEach(drawGraph);
    };

    /*DOM manipulations*/
    const end = (mainImg) => {
        main.appendChild(mainImg);
        Object.values(buttons).forEach(drawButton);
    };

    init();

};
