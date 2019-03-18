import './style.scss';

/*INPUT & COFIG*/
const method = "GET";
const url = "data.json";
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
const canavsSize = { width: 1200, height: 500 };
const canavsHelperSize = { width: 1200, height: 100 };
const buttonSize = { width: "140px", height: "50px" };
const YINTERVAL = 6;
const CORRELATION = 0.9;

let controls = document.getElementById("controls");
let main = document.getElementById("main");

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
const max = arr => {
    if(!Array.isArray(arr)) throw new Error("array expected");
    let max = 0;
    for(let i = 0, r = arr.length; i < r; i++){
        if(arr[i] > max && !isNaN(arr[i])){
            max = arr[i];
        }
    }
    return max;
};

const createCanvas = ({ width, height }, id) => {
    let canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.id = id;
    return canvas
};

const objectWithoutKey = (object, key) => {
    const {[key]: deletedKey, ...otherKeys} = object;
    return otherKeys;
};

// deep clone
const deepClone = (input) =>  JSON.parse(JSON.stringify(input));

// Jan 24 e.g.
const getDate = timestamp => {
    let date = new Date(timestamp);
    return `${months[date.getMonth()]} ${date.getUTCDate()}`;
};

// get simple ratio A to B (with correlation);
const getRatioAtoB = (a, b, c, precise = false) => {
    return precise ? +((a/b)*c).toPrecision(precise) : +(a/b)*c;
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
    // main
    const mainImg = createCanvas(canavsSize, 'mainImg');
    let ctx = mainImg.getContext("2d");

    // helper
    const helperImg = createCanvas(canavsHelperSize, 'helper');
    let ctxHelp = helperImg.getContext("2d");

    const init = () => {
        // Form Graphs n Buttons
        Object.entries(names).forEach(([key, value]) => {

            let x =  columns.find(col => col.includes("x")).map(getDate);
            let y = columns.find(col => col.includes(key));

            /*@TODO add new Graph() es6 class*/
            graphs[key] = {
                color: colors[key],
                name: names[key],
                type: types[key],
                data: {x, y},
                maxY: max(y),
                maxX: x.length
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
        const { width: hwidth, height: hheight } = canavsHelperSize;

        /*@TODO create single canvas SINGLE and split for thumb and main image*/
        ctx.clearRect(0, 0, width, height);
        ctxHelp.clearRect(0, 0, hwidth, hheight);
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
            /*@TODO toggle buttons with SVG*/
            evt.target.style.backgroundColor = 'white';
        } else {
            //add the graph
            graphs[key] = tmp;
            /*@TODO toggle buttons with SVG*/
            evt.target.style.backgroundColor = tmp.color;
        }

        //redraw the scene
        draw()
    };

    const drawXLine = ({ x, y, val }) => {
        ctx.save();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'grey';
        ctx.font = "18px Arial";

        /*draw xAxis*/
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(canavsSize.width-x, y);

        ctx.scale(1, -1);
        ctx.fillText(val, x, -(y +10));

        /*draw yAxis*/
        ctx.stroke();
        ctx.restore();
    };

    const drawHelper = (input, { rX, rY }) => {
        const { color,  data:{ x, y } } = input;
        ctxHelp.lineWidth = 2;
        ctxHelp.beginPath();
        ctxHelp.strokeStyle = color;
        ctxHelp.lineJoin = 'round';

        // LINES
        for (let i = 0, k = x.length; i < k; i++) {
            ctxHelp.lineTo(i*rX, y[i]*rY);
        }

        ctxHelp.stroke();

    };

    //create single graph
    const drawGraph = (input, { rX, rY }) => {
        const { color,  data:{ x, y } }  = input;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineJoin = 'round';

        // LINES
        for (let i = 0, k = x.length; i < k; i++) {
            ctx.lineTo(i*rX, y[i]*rY);
        }
        ctx.stroke();
    };

    const drawButton = ({id, color, label, size: { width, height }}) => {
        let button = document.createElement('button');
        button.id = id;
        button.innerText = label;
        button.style.background = color;
        button.style.width = width;
        button.style.height = height;

        button.addEventListener("click", toggleGraph);
        controls.appendChild(button);

    };

    /*Canvas manipulations*/
    const draw = () => {

        /*reassign each time*/
        let ratio = { x: 1, y:[], mX: 1, mY: [] };

        /*detect X, Y ratios*/
        Object.values(graphs).forEach(graph => {
            let { maxY, maxX } = graph;
            const { height, width } = canavsSize;
            const { height: hheight, width: hwidth } = canavsHelperSize;

            ratio.y.push(getRatioAtoB(height , maxY, CORRELATION, 3));
            ratio.mY.push(getRatioAtoB(hheight , maxY, CORRELATION, 3));
            ratio.x = getRatioAtoB(width, maxX, 1, 3);
            ratio.mX = getRatioAtoB(hwidth, maxX, 1, 3);
        });

        /*draw xAxis*/
        for(let j = 0; j < YINTERVAL; j++){

            const { height } = canavsSize;

            // interval height
            let y = CORRELATION * j * height/YINTERVAL;

            let val = parseInt(y/Math.min(...ratio.y));
            let coords = { x: 50, y, val };

            drawXLine(coords);
        }

        /*draw graphs*/
        Object.values(graphs).forEach(graph => {
            drawGraph(graph, { rX: ratio.x, rY: Math.min(...ratio.y) });
            drawHelper(graph, { rX: ratio.mX, rY:  Math.min(...ratio.mY)});
        })

    };

    /*DOM manipulations*/
    const end = (mainImg) => {
        main.appendChild(mainImg);
        main.appendChild(helperImg);
        Object.values(buttons).forEach(drawButton);
    };

    init();

};
