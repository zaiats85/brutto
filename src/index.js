import './style.scss';

/*INPUT & COFIG*/
const method = "GET";
const url = "data.json";
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
const canavsSize = {width: 1200, height: 500};
const canavsHelperSize = {width: 1200, height: 100};
const buttonSize = {width: "140px", height: "50px"};
const YINTERVAL = 6;
const CORRELATION = 0.9;

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

    /*CANVAS*/
    // main
    const mainImg = createCanvas(canavsSize, 'mainImg');
    let ctx = mainImg.getContext("2d");

    // helper
    const helperImg = createCanvas(canavsHelperSize, 'helper');
    let ctxHelp = helperImg.getContext("2d");
    let offsetX = helperImg.getBoundingClientRect().left;

    // listen for mouse events
    let dragok = false;
    let dragL = false;
    let dragR = false;
    let startX;

    helperImg.onmousedown = myDown;
    helperImg.onmouseup = myUp;
    helperImg.onmousemove = myMove;

    const init = () => {
        // Form Graphs n Buttons
        Object.entries(names).forEach(([key, value]) => {

            let x = columns.find(col => col.includes("x")).map(getDate);
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
        const {width, height} = canavsSize;
        const {width: hwidth, height: hheight} = canavsHelperSize;

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
        ctx.save();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'grey';
        ctx.font = "18px Arial";

        /*draw xAxis*/
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(canavsSize.width - x, y);

        ctx.scale(1, -1);
        ctx.fillText(val, x, -(y + 10));

        /*draw yAxis*/
        ctx.stroke();
        ctx.restore();
    };

    const drawHelper = (input, {rX, rY}) => {
        const {color, data: {x, y}} = input;
        ctxHelp.lineWidth = 2;
        ctxHelp.beginPath();
        ctxHelp.strokeStyle = color;
        ctxHelp.lineJoin = 'round';

        // LINES
        for (let i = 0, k = x.length; i < k; i++) {
            ctxHelp.lineTo(i * rX, y[i] * rY);
        }

        ctxHelp.stroke();

    };


    //create single graph
    const drawGraph = (input, {rX, rY}) => {

        let {color, data: {x, y}} = input;

        /*@TODO separate this logic*/
        /*CTX*/
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineJoin = 'round';

        // LINES
        for (let i = 0, k = x.length; i < k; i++) {
            ctx.lineTo(i * rX, y[i] * rY);
        }

        ctx.stroke();
    };

    // create draggable && resizable rectangle
    const drawControl = () => {
        let {fill} = control;
        ctxHelp.fillStyle = fill;
        rect(control);
    };

    /*start*/
    // draw a  rect
    const rect = ({x, y, width, height}) => {
        ctxHelp.beginPath();
        ctxHelp.rect(x, y, width, height);
        ctxHelp.closePath();
        ctxHelp.fill();
    };

    // handle mousedown events
    function myDown(e) {
        e.preventDefault();
        e.stopPropagation();

        let {x, y, width, height} = control;

        // left resizable area
        let leftSide = new Path2D();
        // right resizable area
        let rightSide = new Path2D();

        /*@TODO remove hardcoded values*/
        leftSide.rect(x, y + 500, 40, height);
        rightSide.rect(x + width, y + 500, -40, height);

        // current mouse position
        let mx = parseInt(e.clientX - offsetX);

        // right
        if (ctxHelp.isPointInPath(rightSide, e.clientX, e.clientY)) {
            dragR = true;
            control.isResizing = true;
        }
        // left
        else if (ctxHelp.isPointInPath(leftSide, e.clientX, e.clientY)) {
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

            let mouseX = e.pageX - this.offsetLeft;
            // get the current mouse position
            let mx = parseInt(e.clientX - offsetX);
            // calculate the distance the mouse has moved since the last mousemove
            let dx = mx - startX;
            // move control that isDragging by the distance the mouse has moved since the last mousemove
            if (isDragging) {
                control.x += dx;
            } else if (dragL) {
                control.width += x - mouseX;
                control.x = mouseX;
            } else if (dragR) {
                control.width = Math.abs(x - mouseX);
            }

            // redraw the scene
            draw();

            // reset the starting mouse position for the next mousemove
            startX = mx;
        }
    }

    /*end*/

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

    function clear() {
        ctxHelp.clearRect(0, 0, canavsHelperSize.width, canavsHelperSize.height);
        ctx.clearRect(0, 0, canavsSize.width, canavsSize.height);
    }

    /*Canvas manipulations*/
    const draw = () => {

        clear();

        // draw control
        drawControl();

        /*reassign each time*/
        let ratio = { x: 1, y: [], mX: 1, mY: [] };

        /*detect X, Y ratios*/
        /*draw graphs*/
        Object.values(graphs).forEach(graph => {
            let {maxY, maxX} = graph;
            const {height, width} = canavsSize;
            let {height: hheight, width: hwidth} = canavsHelperSize;
            let {x: xpos, width: conWidth} = control;
            let start, end;

            ratio.mY.push(getRatioAtoB(hheight, maxY, CORRELATION, 3));
            ratio.mX = getRatioAtoB(hwidth, maxX, 1, 3);

            //start
            if (xpos <= 0) {
                start = 0;
                end = xpos + conWidth;
            } else {
                start = xpos;
                end = conWidth;
            }

            let x0 = Math.round(graph.data.x.length * getRatioAtoB(start, width, 1));
            let x1 = Math.round(graph.data.x.length * getRatioAtoB(end, width, 1));

            let foo = deepClone(graph);

            foo.data.x = deepClone(graph.data.x).splice(x0, x1);
            foo.data.y = deepClone(graph.data.y).splice(x0, x1);

            if(dragok){
                ratio.x = width/foo.data.x.length;
                console.log(start, end);
            } else {
                ratio.x = getRatioAtoB(width, foo.data.x.length, 1, 3);
            }

            ratio.y.push(getRatioAtoB(height, Math.max(...foo.data.y), CORRELATION, 3));

            // draw thumb
            drawHelper(graph, {rX: ratio.mX, rY: Math.min(...ratio.mY)});

            // draw graph
            drawGraph(foo, {rX: ratio.x, rY: Math.min(...ratio.y)});
        });

        /*draw xAxis*/
        for (let j = 0; j < YINTERVAL; j++) {
            const {height} = canavsSize;
            // interval height
            let y = CORRELATION * j * height / YINTERVAL;
            let val = parseInt(y / Math.min(...ratio.y));
            let coords = {x: 50, y, val};
            drawXLine(coords);
        }

    };

    /*DOM manipulations*/
    const end = (mainImg) => {
        main.appendChild(mainImg);
        main.appendChild(helperImg);
        Object.values(buttons).forEach(drawButton);
    };

    init();

};
