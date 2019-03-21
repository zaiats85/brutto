import './style.scss';

/*INPUT & COFIG*/
const method = "GET";
const url = "data.json";
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
const canavsSize = {width: 1200, height: 650};
const thumbSize = {width: 1200, height: 100};
const controlSize = {width: 350, height: 100};
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
    constructor({width, height} = {width: 350, height: 100}) {
        this.x = 850;
        this.y = 8;
        this.width = width;
        this.height = height;
        this.fill = "#d4f2f0";
        this.isDragging = false;
        this.isResizing = false;
    };
}

/*CHART*/
class Chart {
    constructor({color, name, type, x, y, max}) {
        this.y = y;
        this.x = x;
        this.color = color;
        this.name = name;
        this.type = type;
        this.max = max;
    };
}

/*BUTTON*/
class Button {
    constructor( {color, id, label, size} ) {
        this.color = color;
        this.id = id;
        this.label = label;
        this.size = size;
    };
}

/*GRAPH*/
class Graph {
    constructor(num, { width, height }){
        this.num = num;
        this.charts = [];
        this.ratio = {};
        this.button = [];
        this.maxY = [];
        this.width = width;
        this.height = height;
    }

    setRatio(){
        this.ratio.ry = Graph.getRelationAtoB(this.height, Math.max(...this.maxY), CORRELATION, PRECISION);
        this.ratio.rx = Graph.getRelationAtoB(this.width, this.num, 1 , PRECISION);
    };

    addGraph(chart){
        this.charts.push(new Chart(chart));
    };

    addButton(button){
        this.button.push(new Button(button))
    };

    addMaxY(maxY){
        this.maxY.push(maxY);
    };

    // delete graph from feed canvas
    toggleGraph(evt){

        const key = evt.target.id;
        const  { charts: clonedCharts } = cachedGraph;
        const  { charts, maxY } = graph;
        const tmp = clonedCharts[key];

        /*@TODO think of immutability like redux store*/
        if (charts[key]) {
            //delete the graph
            graph.charts = objectWithoutKey(charts, key);
            graph.maxY = remove(maxY, tmp.max);
            evt.target.style.backgroundColor = 'white';
        } else {
            /*@TODO toggle buttons with SVG*/
            //add the graph
            graph.charts[key] = tmp;
            graph.maxY.push(tmp.max);
            evt.target.style.backgroundColor = tmp.color;
        }
        //redraw the scene
        Canvas.draw()
    };

    drawButton({id, color, label, size: {width, height}}){
        let button = document.createElement('button');
        button.id = id;
        button.innerText = label;
        button.style.background = color;
        button.style.width = width;
        button.style.height = height;

        button.addEventListener("click", this.toggleGraph);
        controls.appendChild(button);

    };

    // get simple ratio A to B (with correlation);
    static getRelationAtoB(a, b, c = CORRELATION, precise = false){
        if(precise){
            return ((a / b) * c).toPrecision(PRECISION);
        } else {
            return +(a / b) * c
        }
    }
}

/* CANVAS */
class Scene {
    constructor(size = {width: 1200, height: 650}, id ) {
        this.graph = {};
        this.control = {};
        this.width = size.width;
        this.height = size.height;
        let canvas = document.createElement('canvas');
        canvas.width = size.width;
        canvas.height = size.height;
        canvas.id = id;

        document.body.appendChild(canvas);
        this.context = canvas.getContext('2d');
        this.context.font = "18px Arial";
        this.rect = canvas.getBoundingClientRect();

        // listen for mouse events
        this.dragok = false;
        this.dragL = false;
        this.dragR = false;
        this.startX;

        /* EVENTS */
        canvas.onmousedown = this.myDown.bind(this);
        canvas.onmouseup = this.myUp.bind(this);
        canvas.onmousemove = this.myMove.bind(this);
    }

    /*EVENT CALLBACKS*/
    myMove(e){
        // if we're dragging || resizing anything...
        if (this.dragok || this.dragL || this.dragR) {
            e.preventDefault();
            e.stopPropagation();

            let {x, isDragging} = this.control;
            // current mouse position X
            let {x: mx} = this.getMousePos(e);

            // calculate the distance the mouse has moved since the last mousemove
            let dx = mx - this.startX;

            // move control that isDragging by the distance the mouse has moved since the last mousemove
            if (isDragging) {
                this.control.x += dx;
            } else if (this.dragL) {
                this.control.width += x - mx;
                this.control.x = mx;
            } else if (this.dragR) {
                this.control.width = Math.abs(x - mx);
            }

            // redraw the scene
            this.draw();

            // reset the starting mouse position for the next mousemove
            this.startX = mx;
        }
    }

    myDown(e){

        e.preventDefault();
        e.stopPropagation();

        const {x, y, width, height} = this.control;

        // left n right resizable areas
        const leftSide = new Path2D();
        const rightSide = new Path2D();

        // current mouse position X, yScaled(1, -1);
        const {x: mx, ySc: mySc} = this.getMousePos(e);

        leftSide.rect(x, y, 10, height);
        rightSide.rect(width + x - 10, y, 10, height);

        // right
        if (this.context.isPointInPath(rightSide, mx, mySc)) {
            this.dragR = true;
            this.control.isResizing = true;
        }
        // left
        else if (this.context.isPointInPath(leftSide, mx, mySc)) {
            this.dragL = true;
            this.control.isResizing = true;
        }
        // drag
        else if (mx > x && mx < x + width) {
            this.dragok = true;
            this.control.isDragging = true;
        }

        // save the current mouse position
        this.startX = mx;
    }

    myUp(e){
        e.preventDefault();
        e.stopPropagation();

        /*shut it down*/
        this.dragok = this.dragL = this.dragR = false;
        this.control.isDragging = this.control.isResizing = false;
    }

    setControl(control) {
        this.control = control;
    }

    setGraph(graph){
        this.graph = graph;
    }

    /*DRAWING*/
    drawXLine(){
        this.context.lineWidth = 1;
        this.context.strokeStyle = 'grey';
        this.context.fillStyle = 'grey';
        let gr = ratio.rY;
        /*draw xAxis*/
        for (let j = 0; j < YINTERVAL; j++) {
            this.context.save();
            let y = CORRELATION * j * graphHeight / YINTERVAL;
            let val = parseInt(y / gr).toString();
            let dY = y + SEPARATE;

            /*draw xAxis*/
            this.context.beginPath();
            this.context.moveTo(AXISOffsetX, dY);

            this.context.lineTo(width - AXISOffsetX, dY);
            this.context.scale(1, -1);

            this.context.fillText(val, AXISOffsetX, -(dY + 10));
            this.context.stroke();
            this.context.restore();
        }

    };

    drawAxis(text, {x, y}){
        this.context.save();
        this.context.scale(1, -1);
        this.context.fillStyle = "grey";
        this.context.fillText(text, x, y);
        this.context.restore();
    };

    // create draggable && resizable rectangle
    drawControl(){
        this.context.fillStyle = "#d4f2f0";
        this.rectangle(this.control);
    };

    // draw a  rect
    rectangle ({x, y, width, height}){
        this.context.beginPath();
        this.context.rect(x, y, width, height);
        this.context.closePath();
        this.context.fill();
    };

    // get Mouse Position
    getMousePos(evt){
        return {
            x: evt.clientX - this.rect.left,
            y: evt.clientY - this.top,
            ySc: this.rect.bottom - evt.clientY
        };
    };

    // clear feed canvas
    clearCanvas({width, height} = canavsSize){
        this.context.clearRect(0, 0, width, height)
    };

    // create single graph
    drawGraph({ color, x, y }, { rx, ry }, separate = 0){
        this.context.lineWidth = 3;
        this.context.beginPath();
        this.context.strokeStyle = color;
        this.context.lineJoin = 'round';
        // LINES

        for (let i = 0, k = x.length; i < k; i++) {
            this.context.lineTo(i * rx, y[i] * ry + separate);
            if (i % Math.round(k/YINTERVAL) === 0 && separate) {
                let pos = {x: i * rx, y: -(separate - AXISOffsetY)};
                drawAxis(getDate(x[i]), pos );
            }
        }
        this.context.stroke();
    };

    /*Canvas manipulations*/
    draw(){

        this.clearCanvas();

        /*this.objects.forEach( o => {
            o.draw(this.context);
        });*/

        // draw control
        this.drawControl();

        // reassign each time
        let {charts, ratio} = this.graph;

        charts.forEach(chart => {
            this.drawGraph(chart, ratio );
        })

        // draw main canvas
        /*Object.values(charts).forEach(chart => {
            this.drawGraph(chart, ratio );
        });*/

        /*Object.values(charts).forEach(chart => {
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
            graphs.newX = deepClone(x).splice(x0, x1);
            let maxNewY = Math.max(...newY);
            thumbs[name] = new Chart(color, name, type, newY, maxNewY);
            ratio.rY.push(getRatioAtoB(graphHeight, maxNewY, CORRELATION, PRECISION));
        });*/

        /*ratio.rX = getRatioAtoB(width, graphs.newX.length, 1, PRECISION);
        ratio.rY = Math.min(...ratio.rY);

        Object.values(thumbs).forEach(thumb => {
            // draw chart
            drawGraph(thumb, ratio.rX, ratio.rY, graphs.newX, SEPARATE);
        });

        drawXLine();*/

    };

    render() {


    }
}

/* UTILS */

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
    let cachedGraph = {};
    const {colors, names, types, columns} = feed;


    /*CANVAS*/
    const canvas = new Scene(canavsSize, "mainImg");
    canvas.setControl(new Control(controlSize));

    const init = () => {

        // Form Graphs
        let x = columns.find(col => col.includes("x")).filter(item => !isNaN(item)).map(getDate);

        /*number of elements to present*/
        let graph = new Graph(x.length, thumbSize);

        Object.entries(names).forEach(([key, value]) => {
            // remove first index string type
            let y = columns.find(col => col.includes(key)).filter(item => !isNaN(item));
            let max = Math.max(...y);

            // create charts n buttons
            graph.addGraph({ color: colors[key], name: names[key], type: types[key], x, y, max});
            graph.addButton({color: colors[key], id: key, label: value, size: buttonSize });
            graph.addMaxY(max);
        });
        graph.setRatio();

        canvas.setGraph(graph);

        // interesting approach to manipulate scene redraw, at least for me
        cachedGraph = deepClone(graph);
        canvas.draw();

    };

    init();

};
