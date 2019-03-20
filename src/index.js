import './style.scss';

/*INPUT & COFIG*/
const method = "GET";
const url = "data.json";
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
const canavsSize = {width: 1200, height: 650};
const thumbHeight = 100;
const graphHeight = 500;
const buttonSize = {width: "140px", height: "50px"};
const YINTERVAL = 6;
const AXISOffsetX = 40;
const AXISOffsetY = 40;
const CORRELATION = 0.9;
const PRECISION = 3;
const SEPARATE = 150;

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

/*DOM*/
const controls = document.getElementById("controls");
const main = document.getElementById("main");

/* CONTROL */
class Control {
    constructor() {
        this.x = 850;
        this.y = 8;
        this.width = 350;
        this.height = 100;
        this.fill = "#d4f2f0";
        this.isDragging = false;
        this.isResizing = false;
    };
}

/*CHART*/
class Chart {
    constructor(color, name, type, y, max) {
        this.y = y;
        this.color = color;
        this.name = name;
        this.type = type;
        this.max = max;
    };
}

/*BUTTON*/
class Button {
    constructor(color, id, label, size) {
        this.color = color;
        this.id = id;
        this.label = label;
        this.size = size;
    };
}

/* UTILS */
const max = arr => {
    if (!Array.isArray(arr)) throw new Error("array expected");
    let max = 0;
    for (let i = 0, r = arr.length; i < r; i++) {
        if (arr[i] > max && !isNaN(arr[i])) {
            max = arr[i];
        }
    }
    return max;
};

const createCanvas = ({width, height}, id) => {
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
const deepClone = (input) => JSON.parse(JSON.stringify(input));

// remove
const remove = (array, element) => array.filter(el => el !== element);

// Jan 24 e.g.
const getDate = timestamp => {
    let date = new Date(timestamp);
    return `${months[date.getMonth()]} ${date.getUTCDate()}`;
};

// get simple ratio A to B (with correlation);
const getRatioAtoB = (a, b, c, precise = false) => {
    return precise ? +((a / b) * c).toPrecision(precise) : +(a / b) * c;
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
    let graphs = {
        x: [],
        charts: {},
        maxY: []
    };
    let ratio = {};
    const control = new Control();
    let cachedGraph = {};
    let buttons = {};
    const {colors, names, types, columns} = feed;
    const {width} = canavsSize;
    let {fill} = control;

    /*CANVAS*/
    const canvas = createCanvas(canavsSize, 'mainImg');
    let ctx = canvas.getContext("2d");
    ctx.font = "18px Arial";

    // listen for mouse events
    let dragok = false;
    let dragL = false;
    let dragR = false;
    let startX;

    canvas.onmousedown = myDown;
    canvas.onmouseup = myUp;
    canvas.onmousemove = myMove;

    const init = () => {
        // Form Graphs n Buttons

        /*X is the same for each graph*/
        graphs.x = columns.find(col => col.includes("x")).filter(item => !isNaN(item)).map(getDate);

        Object.entries(names).forEach(([key, value]) => {
            // remove first index string type
            let y = columns.find(col => col.includes(key)).filter(item => !isNaN(item));
            let max = Math.max(...y);

            // create charts n buttons
            graphs.charts[key] = new Chart(colors[key], names[key], types[key], y, max);
            buttons[key] = new Button(colors[key], key, value, buttonSize);

            graphs.maxY.push(max);
        });

        // interesting approach to manipulate scene redraw, at least for me
        cachedGraph = deepClone(graphs);

        draw();
        end(canvas);
    };

    // clear feed canvas
    const clearCanvas = ({width, height}) => ctx.clearRect(0, 0, width, height);

    // delete graph from feed canvas
    const toggleGraph = (evt) => {

        const key = evt.target.id;
        const  { charts: clonedCharts } = cachedGraph;
        const  { charts, maxY } = graphs;
        const tmp = clonedCharts[key];

        /*@TODO think of immutability like redux store*/
        if (charts[key]) {
            //delete the graph
            graphs.charts = objectWithoutKey(charts, key);
            graphs.maxY = remove(maxY, tmp.max);
            evt.target.style.backgroundColor = 'white';
        } else {
        /*@TODO toggle buttons with SVG*/
            //add the graph
            graphs.charts[key] = tmp;
            graphs.maxY.push(tmp.max);
            evt.target.style.backgroundColor = tmp.color;
        }
        //redraw the scene
        draw()
    };

    // create single graph
    const drawGraph = (input, rX, rY, x, separate = 0) => {
        let {color, y} = input;

        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineJoin = 'round';

        // LINES
        for (let i = 0, k = x.length; i < k; i++) {
            ctx.lineTo(i * rX, y[i] * rY + separate);

            if (i % Math.round(k/YINTERVAL) === 0 && separate) {

                let pos = {x: i * rX, y: -(separate - AXISOffsetY)};
                drawAxis(getDate(x[i]), pos );

            }

        }

        ctx.stroke();


    };



    const drawXLine = () => {
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'grey';
        ctx.fillStyle = 'grey';
        let gr = Math.min(...ratio.rY);
        /*draw xAxis*/
        for (let j = 0; j < YINTERVAL; j++) {
            ctx.save();
            let y = CORRELATION * j * graphHeight / YINTERVAL;
            let val = parseInt(y / gr).toString();
            let dY = y + SEPARATE;

            /*draw xAxis*/
            ctx.beginPath();
            ctx.moveTo(AXISOffsetX, dY);

            ctx.lineTo(width - AXISOffsetX, dY);
            ctx.scale(1, -1);

            ctx.fillText(val, AXISOffsetX, -(dY + 10));
            ctx.stroke();
            ctx.restore();
        }

    };

    const drawAxis = (text, {x, y}) => {
        ctx.save();
        ctx.scale(1, -1);
        ctx.fillStyle = "grey";
        ctx.fillText(text, x, y);
        ctx.restore();
    };

    // create draggable && resizable rectangle
    const drawControl = () => {
        ctx.fillStyle = fill;
        rect(control);
    };

    // draw a  rect
    const rect = ({x, y, width, height}) => {
        ctx.beginPath();
        ctx.rect(x, y, width, height);
        ctx.closePath();
        ctx.fill();
    };

    // get Mouse Position
    const getMousePos = (evt) => {
        let rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top,
            ySc: rect.bottom - evt.clientY
        };
    };

    // handle mousedown events
    function myDown(e) {
        e.preventDefault();
        e.stopPropagation();

        let {x, y, width, height} = control;
        // left n right resizable areas
        let leftSide = new Path2D();
        let rightSide = new Path2D();

        // current mouse position X, yScaled(1, -1);
        let {x: mx, ySc: mySc} = getMousePos(e);

        // start
        /*@TODO remove hardcoded values*/
        leftSide.rect(x, y, 10, height);
        rightSide.rect(width + x - 10, y, 10, height);

        // right
        if (ctx.isPointInPath(rightSide, mx, mySc)) {
            dragR = true;
            control.isResizing = true;
        }
        // left
        else if (ctx.isPointInPath(leftSide, mx, mySc)) {
            dragL = true;
            control.isResizing = true;
        }
        // drag
        else if (mx > x && mx < x + width) {
            dragok = true;
            control.isDragging = true;
        }

        // save the current mouse position
        startX = mx;
    }

    // handle mouseup events
    function myUp(e) {
        e.preventDefault();
        e.stopPropagation();

        /*shut it down*/
        dragok = dragL = dragR = false;
        control.isDragging = control.isResizing = false;
    }

    // handle mouse moves
    function myMove(e) {
        // if we're dragging || resizing anything...
        if (dragok || dragL || dragR) {
            e.preventDefault();
            e.stopPropagation();

            let {x, isDragging} = control;
            // current mouse position X
            let {x: mx} = getMousePos(e);

            // calculate the distance the mouse has moved since the last mousemove
            let dx = mx - startX;

            // move control that isDragging by the distance the mouse has moved since the last mousemove
            if (isDragging) {
                control.x += dx;
            } else if (dragL) {
                control.width += x - mx;
                control.x = mx;
            } else if (dragR) {
                control.width = Math.abs(x - mx);
            }

            // redraw the scene
            draw();

            // reset the starting mouse position for the next mousemove
            startX = mx;
        }
    }

    const drawButton = ({id, color, label, size: {width, height}}) => {
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

        clearCanvas(canavsSize);

        // draw control
        drawControl();

        // reassign each time
        let {x: xpos, width: conWidth} = control;
        let {charts, maxY, x} = graphs;

        ratio.tY = getRatioAtoB(thumbHeight, Math.max(...maxY), CORRELATION, PRECISION);
        ratio.tX = getRatioAtoB(width, x.length, 1, PRECISION);
        ratio.rY = [];
        let {tY, tX} = ratio;

        // draw main canvas
        Object.values(charts).forEach(chart => {
            let {color, name, type, y} = chart;

            // draw thumb
            drawGraph(chart, tX, tY, x);

            let start, end;
            if (xpos <= 0) {
                start = 0;
                end = xpos + conWidth;
            } else {
                start = xpos;
                end = conWidth;
            }

            let x1 = Math.round(x.length * getRatioAtoB(end, width, 1));
            let x0 = Math.round(x.length * getRatioAtoB(start, width, 1));

            let newY = deepClone(y).splice(x0, x1);
            let newX = deepClone(x).splice(x0, x1);

            let tmp = new Chart(color, name, type, newY, Math.max(...newY));

            ratio.rX = getRatioAtoB(width, newX.length, 1, PRECISION);
            ratio.rY.push(getRatioAtoB(graphHeight, tmp.max, CORRELATION, PRECISION));

            // draw chart
            drawGraph(tmp, ratio.rX, Math.min(...ratio.rY), newX, SEPARATE);
        });

        drawXLine();

    };

    /*DOM manipulations*/
    const end = (canvas) => {
        main.appendChild(canvas);
        Object.values(buttons).forEach(drawButton);
    };

    init();

};
