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
const CORRELATION = 0.9;
const PRECISION = 3;
const SEPARATE = 150;

/*DOM*/
const controls = document.getElementById("controls");
const main = document.getElementById("main");

/* CONTROL */
const offsetX = 850;
const offsetY = 8;
const controlSize = {width: 350, height: 100};
const fill = "#142324";

class Control {
    constructor(offsetX, offsetY, fill, {width, height}) {
        this.x = offsetX;
        this.y = offsetY;
        this.width = width;
        this.height = height;
        this.fill = fill;
        this.isDragging = false;
        this.isResizing = false;
    };
}

const control = new Control(offsetX, offsetY, fill, controlSize);

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
    let graphs = {};
    let cachedGraph = {};
    let buttons = {};
    const {colors, names, types, columns} = feed;
    const {width, height} = canavsSize;

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
        Object.entries(names).forEach(([key, value]) => {

            let x = columns.find(col => col.includes("x")).filter(item => !isNaN(item)).map(getDate);
            let y = columns.find(col => col.includes(key)).filter(item => !isNaN(item));

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

        // interesting approach to manipulate scene redraw, at least for me
        cachedGraph = deepClone(graphs);

        draw();
        end(canvas);
    };

    // clear feed canvas
    const clearCanvas = ({width, height}) => ctx.clearRect(0, 0, width, height);

    // delete graph from feed canvas
    const toggleGraph = (evt) => {
        //clear the feed canvas
        clearCanvas(canavsSize);
        const key = evt.target.id;
        const tmp = cachedGraph[key];

        if (graphs[key]) {
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

    const drawXLine = ({x, y, val}) => {
        let dY = y + SEPARATE;
        let {width} = canavsSize;
        ctx.save();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'grey';

        /*draw xAxis*/
        ctx.beginPath();
        ctx.moveTo(x, dY);
        ctx.lineTo(width - x, dY);

        ctx.scale(1, -1);
        ctx.fillText(val, x, -(dY + 10));

        ctx.stroke();
        ctx.restore();
    };

    // create single graph
    const drawGraph = (input, {rX, rY}, separate = 0) => {
        let {color, data: {x, y}, lineWidth} = input;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineJoin = 'round';

        // LINES
        for (let i = 0, k = x.length; i < k; i++) {
            ctx.lineTo(i * rX, y[i] * rY + separate);

            if (i % 5 === 1 && separate) {
                ctx.save();
                ctx.scale(1, -1);
                ctx.fillText(getDate(x[i]), i * rX, -(separate - 25));
                ctx.restore();
            }
        }

        ctx.stroke();
    };

    // create draggable && resizable rectangle
    const drawControl = () => {
        let {fill} = control;
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
            y: evt.clientY - rect.top
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

        /*@TODO remove hardcoded values*/
        leftSide.rect(x, y + 500, 40, height);
        rightSide.rect(x + width, y + 500, -40, height);

        // current mouse position X
        let {x: mx} = getMousePos(e);

        // right
        if (ctx.isPointInPath(rightSide, e.clientX, e.clientY)) {
            dragR = true;
            control.isResizing = true;
        }
        // left
        else if (ctx.isPointInPath(leftSide, e.clientX, e.clientY)) {
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

        /*reassign each time*/
        let ratio = {x: 1, y: [], mX: 1, mY: []};
        let {x: xpos, width: conWidth} = control;

        /*detect X, Y ratios*/
        /*draw graphs*/
        Object.values(graphs).forEach(graph => {
            let {maxY, maxX, data: {x, y}} = graph;
            let tmp = deepClone(graph);
            let start, end;

            ratio.mY.push(getRatioAtoB(thumbHeight, maxY, CORRELATION, PRECISION));
            ratio.mX = getRatioAtoB(width, maxX, 1, PRECISION);

            //start
            if (xpos <= 0) {
                start = 0;
                end = xpos + conWidth;
            } else {
                start = xpos;
                end = conWidth;
            }

            /*@TODO refactor this awfull code*/
            let x1 = Math.round(maxX * getRatioAtoB(end, width, 1));
            let x0 = Math.round(maxX * getRatioAtoB(start, width, 1));

            tmp.data.x = deepClone(x).splice(x0, x1);
            tmp.data.y = deepClone(y).splice(x0, x1);
            tmp.lineWidth = 3;
            graph.lineWidth = 2;

            ratio.x = getRatioAtoB(width, tmp.data.x.length, 1, PRECISION);

            ratio.y.push(getRatioAtoB(graphHeight, max(tmp.data.y), CORRELATION, PRECISION));

            // draw thumb
            drawGraph(graph, {rX: ratio.mX, rY: Math.min(...ratio.mY)});

            // draw graph
            drawGraph(tmp, {rX: ratio.x, rY: Math.min(...ratio.y)}, SEPARATE);
        });

        /*draw xAxis*/
        for (let j = 0; j < YINTERVAL; j++) {
            let y = CORRELATION * j * graphHeight / YINTERVAL;
            let val = parseInt(y / Math.min(...ratio.y));
            drawXLine({x: 50, y, val});
        }

    };

    /*DOM manipulations*/
    const end = (canvas) => {
        main.appendChild(canvas);
        Object.values(buttons).forEach(drawButton);
    };

    init();

};
