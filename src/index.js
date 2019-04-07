import './style.scss';

/*INPUT & COFIG*/
let fg = window.innerWidth;
console.log(fg);

const method = "GET";
const url = "data.json";
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
const canavsSize = {width: 0.95*fg, height: 870};
const thumbSize = {width: 0.95*fg, height: 100};
const controlSize = {width: 350, height: 100};
const PROJECTION_HEIGHT = 600;
const buttonSize = {width: "140px", height: "50px"};
const nightModeButtoSize = {width: "240px", height: "50px"};
const MODE = {
    day: {
        scroll: "white",
        border: "lightgrey",
        track: "#f5f5f5"
    },
    night: {
        scroll: "#192849",
        border: "grey",
        track: "#192831"
    }
};

const YINTERVAL = 6;
const REDRAW = 15;
const AXISOffsetX = 5;
const AXISOffsetY = 40;
const CORRELATION = 0.9;
const PRECISION = 13;
const SEPARATE = 170;

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

/* UTILS */

const almostEqual = (a, b, absoluteError, relativeError) => {
    let d = Math.abs(a - b);
    if (absoluteError == null) absoluteError = almostEqual.DBL_EPSILON;
    if (relativeError == null) relativeError = absoluteError;
    if(d <= absoluteError) {
        return true
    }
    if(d <= relativeError * Math.min(Math.abs(a), Math.abs(b))) {
        return true
    }
    return a === b
};
almostEqual.FLT_EPSILON = 1.19209290e-7;
almostEqual.DBL_EPSILON = 2.2204460492503131e-16;

const getZahlen = (zahlen, intrval = YINTERVAL) => {
    while(zahlen % intrval !== 0){
        zahlen++;
    }
    return zahlen
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

/* CONTROL */
class Control {
    constructor({width, height} = {width: 350, height: 100}) {
        this.x = 850;
        this.y = 8;
        this.width = width;
        this.height = height;
        this.fill = "white";
        this.isDragging = false;
        this.isResizing = false;
        this.mode = MODE;
    };

    // create draggable && resizable rectangle
    draw(context, night){
        // Awfull but no time left.
        const { scroll, border, track } =  this.mode[night ? "night" : "day"];
        const { x, y, width, height } = this;

        context.fillStyle = track;

        context.fillRect(0, y, context.canvas.width, height);
        context.beginPath();

        context.fillStyle = scroll;

        context.rect(x, y, width, height);
        context.closePath();
        context.fill();

        // set draggable edges color
        //context.fillStyle ="lightgrey";
        context.fillStyle = border;
        context.fillRect(x, y, 10, height);
        context.fillRect(width + x - 10, y, 10, height);

        context.fillRect(x, y, width, 3);
        context.fillRect(x, y + height, width, -3);

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

    static drawXLine(context, val, y){
        /*draw xAxis*/
        context.beginPath();
        context.save();
        context.moveTo(AXISOffsetX, y);
        context.lineTo(context.canvas.width - AXISOffsetX, y);
        context.scale(1, -1);
        context.fillStyle = 'grey';
        context.fillText(val, AXISOffsetX, -(y + 10));
        context.lineWidth = 1;
        context.strokeStyle = 'grey';
        context.stroke();
        context.restore();

    };

    static drawAxis(text, {x, y}, context){
        context.save();
        context.scale(1, -1);
        context.fillStyle = "grey";
        context.fillText(text, x, y);
        context.restore();
    };

    // create single graph
    draw({ rx, ry }, context, separate = 0, realProjectionMaxHeight ){
        const { color, x, y } = this;
        context.lineWidth = separate ? 3 : 2;
        context.beginPath();
        context.strokeStyle = color;
        context.lineJoin = 'round';

        // LINES
        for (let i = 0, k = x.length; i < k; i++) {
            context.lineTo(i * rx, y[i] * ry + separate);
            // AXIS
            if (i % Math.round(k/YINTERVAL) === 0 && separate) {
                let pos = {x: i * rx, y: -(separate - AXISOffsetY)};
                Chart.drawAxis(getDate(x[i]), pos, context );
            }
        }
        context.stroke();
        let j = 0;
        while(j < YINTERVAL && separate){
            // real coordinate to which I must animate
            let y = j * realProjectionMaxHeight/YINTERVAL;
            // real value which is shown to the user
            let val = parseInt(y).toString();
            let dY = y*ry + SEPARATE;
            Chart.drawXLine(context, val, dY);
            j++;
        }
    };
}

/*GRAPH*/
class Graph {
    constructor({ width, height }){
        this.num = 0;
        this.num2 = 0;
        this.charts = {};
        this.projection = {};
        this.deleted = {};
        this.ratio = {};
        this.maxY = [];
        this.maxY2 = [];
        this.graphHeight = PROJECTION_HEIGHT;
        this.width = width;
        this.height = height;
    }

    set(key, val){
        this[key] = val;
    }

    get(key){
        return this[key];
    }

    add(key, val){
        this[key].push(val);
    };

    setRatio(){
        // real graph max point relative to Yinterval
        const  realGraphHeight = getZahlen(Math.max(...this.maxY2), YINTERVAL);

        this.ratio.rx = Graph.getRelationAtoB(this.width, this.num, 1 , PRECISION);
        this.ratio.prx = Graph.getRelationAtoB(this.width, this.num2, 1, PRECISION);
        // for sake of  simplicity
        this.ratio.ry = Graph.getRelationAtoB(this.height, Math.max(...this.maxY), CORRELATION, PRECISION);
        this.ratio.realProjectionMaxHeight = realGraphHeight;
        // for sake of precision
        this.ratio.pry = Graph.getRelationAtoB(this.graphHeight, realGraphHeight, 1, PRECISION);
    };

    addGraph(key, chart){
        this.charts[key] = new Chart(chart);
    };

    addProjectionGraph(key, chart){
        this.projection[key] = new Chart(chart);
    };
    // create a projection
    mutatedGraph({x, width}){

        /*Detect control bar position*/
        let start = (x <= 0) ? 0 : x;
        let end = x + width;

        let x1 = Math.round(this.num * Graph.getRelationAtoB(end, this.width, 1));
        let x0 = Math.round(this.num * Graph.getRelationAtoB(start, this.width, 1));

        // empty each time
        this.maxY2.length = 0;
        this.projection = {};

        Object.entries(this.charts).forEach(([key, value]) => {
            let projection = deepClone(value);
            projection.y = value.y.slice(x0, x1);
            projection.x = value.x.slice(x0, x1);
            projection.max = Math.max(...projection.y);

            this.add("maxY2", projection.max);

            // create charts
            this.addProjectionGraph(
                key,
                projection
            );
            this.set('num2', projection.x.length);
        });

    }

    // get simple ratio A to B (with correlation);
    static getRelationAtoB(a, b, c = CORRELATION, precise = false){
        if(precise){
            return +((a / b) * c).toPrecision(PRECISION);
        } else {
            return +(a / b) * c
        }
    }
}

/* CANVAS */
class Scene {
    constructor(size = {width: 1200, height: 650}, id, {colors, names, types, columns} ) {
        this.graph = new Graph(thumbSize);
        this.control = {};
        this.buttons = [];
        this.night = false;
        this.mode = {
            day:"white",
            night: "#21263a"
        };

        /*ANIMATION*/
        this.animateContinue = true;
        // set initial coef
        this.koef = 0;
        this.buffer = 0;

        this.koef2 = 0;
        this.buffer2 = 0;

        /*FEED*/
        this.colors = colors;
        this.names = names;
        this.types = types;
        this.columns = columns;

        /*SCENE (whole canvas)*/
        let canvas = document.createElement('canvas');
            canvas.width = size.width;
            canvas.height = size.height;
            canvas.id = id;

        this.controls = document.createElement('div');
        this.el = canvas;

        /*CONTEXT*/
        this.context = canvas.getContext('2d');
        this.context.font = "18px Arial";

        /* EVENTS */
        // listen for mouse events
        this.dragok = false;
        this.dragL = false;
        this.dragR = false;

        canvas.onmousedown = this.myDown.bind(this);
        canvas.onmouseup = this.myUp.bind(this);
        canvas.onmousemove = this.myMove.bind(this);
        this.draw = this.draw.bind(this);

    }

    set(key, val){
        this[key] = val;
    }

    setInitialGraph(){
        // Form Graphs
        let x = this.columns.find(col => col.includes("x")).filter(item => !isNaN(item)).map(getDate);
        this.graph.set('num', x.length);

        Object.entries(this.names).forEach(([key, value]) => {
            // remove first index string type
            let y = this.columns.find(col => col.includes(key)).filter(item => !isNaN(item));
            let max = Math.max(...y);

            let chart = {color: this.colors[key], name: this.names[key], type: this.types[key], x, y, max};

            // create charts
            this.graph.addGraph(
                key,
                chart
            );

            this.graph.add("maxY", max);
            this.addButton({color: this.colors[key], id: key, label: value, size: buttonSize });
        });

        this.addButton({color: "#9ad7db", id: "nightMode", label: "Night Mode", size: nightModeButtoSize});

        this.graph.mutatedGraph(this.control);
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

            this.graph.mutatedGraph(this.control);

            // redraw the scene
            this.graph.setRatio();
            this.animateContinue = true;
            requestAnimationFrame(() => { this.draw() } );

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
        const {x: mx, ySc: mySc, y: my} = this.getMousePos(e);


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
        else if (mx > x && mx < x + width && my && mySc-height < y) {
            this.dragok = true;
            this.control.isDragging = true;
        } else if(mySc-height > y){
            console.log("draw a line here");
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
        this.animateContinue = false;
    }

    setControl(control) {
        this.control = control;
    }

    addButton(button){
        this.buttons.push(button)
    };

    /*DRAWING*/

    // get Mouse Position
    getMousePos(evt){
        let rect = this.el.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top,
            ySc: rect.bottom - evt.clientY
        };
    };

    // clear feed canvas
    clearCanvas({width, height} = canavsSize){
        this.context.clearRect(0, 0, width, height)
    };

    drawButton({id, color, label, size: {width, height}}){
        const button = document.createElement('button');
        button.setAttribute("id", id);
        button.innerText = label;
        button.style.background = color;
        button.style.width = width;
        button.style.height = height;
        this.controls.appendChild(button);
    };

    nightMode(evt){
        this.set("night", !this.night);
        evt.target.innerText = this.night ?  "Night Mode" : "Day mode";
        document.body.classList.toggle("night");
        this.draw();
    }

    // delete graph from feed canvas
    toggleGraph(evt){
        const key = evt.target.id;
        const { charts, maxY, deleted } = this.graph;
        const tmp = charts[key];
        const tmpDel = deleted[key];
        if(tmp){
            tmp.tmpDel = true;
        }

        /*@TODO toggle buttons with SVG*/
        if (key in charts) {
            //delete the graph
            this.graph.charts = objectWithoutKey(charts, key);
            this.graph.maxY = remove(maxY, tmp.max);
            this.graph.deleted[key] = tmp;
            evt.target.style.backgroundColor = 'white';
        } else {
            //add the graph
            this.graph.charts[key] = tmpDel;
            this.graph.maxY.push(tmpDel.max);
            evt.target.style.backgroundColor = tmpDel.color;
        }

        if(Object.keys(this.graph.charts).length === 0){
            throw new Error("can't mutate nothing");
        }

        this.animateContinue = true;
        this.graph.mutatedGraph(this.control);
        this.graph.setRatio();

        //redraw the scene
        this.draw();
    };

    /*Canvas manipulations*/
    draw(){
        this.clearCanvas();

        // nightMode toggle
        this.context.fillStyle = this.night ? this.mode.night : this.mode.day;
        this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);

        // draw control
        this.control.draw(this.context, this.night);

        let {
            charts,
            ratio: {prx, pry, rx, ry, realProjectionMaxHeight},
            projection,
        } = this.graph;

        if(almostEqual(this.koef, pry, almostEqual.DBL_EPSILON, almostEqual.DBL_EPSILON)){
            this.animateContinue = false;
        }

        /*what to do, my son says i m an idiot. little genius. Precision. Svolochi :)*/
        let tmp = Number(((pry-this.buffer)/REDRAW).toFixed(99));
        let tmp2 = Number((ry-this.buffer2)/REDRAW);

        // ugly - but working and no time for refactoring. but ugly.
        this.koef += tmp;
        this.koef2 += tmp2;

        // referencing marked deleted object
        let reference;

        /*Smooth animation*/
        Object.entries(charts).forEach(([key, chart]) => {
            // ugly - but working and no time for refactoring. but ugly.
            ry = (chart.tmpDel) ? this.graph.ratio.ry : this.koef2;
            chart.draw({rx, ry}, this.context);
            reference = key;
        });

        // draw main canvas
        Object.values(projection).forEach(projection => {
            projection.draw({rx: prx, ry: this.koef}, this.context, SEPARATE, realProjectionMaxHeight);
        });

        // what to do, my son says i m an idiot. little genius
        if( tmp > 0 && this.koef > pry || tmp < 0 && this.koef < pry){
            this.animateContinue = false;
        }

        if(this.animateContinue) {
            requestAnimationFrame(this.draw);
            //console.log("RUN")
        } else {
            //console.log("STOP");
            this.koef = pry;
            this.buffer = pry;
            this.koef2 = ry;
            this.buffer2 = ry;
            this.graph.charts[reference].tmpDel = false
        }
    };

    init() {
        this.buttons.forEach(this.drawButton.bind(this));
        this.buttons.push();
        this.graph.setRatio();

        main.appendChild(this.el);
        main.appendChild(this.controls);

        this.draw();
    }
}

/*RUNTIME*/
async function init() {
    let data = await getJson(method, url);
    return JSON.parse(data);
}

init()
    .then(result => {
        parseFeed(result);
        window.result = result;
    });


window.parseFeed = (feed) => {
    for(let i = 0, k = feed.length; i < k; i++){
        /*CANVAS*/
        const canvas = new Scene(canavsSize, "mainImg", feed[i]);
        canvas.setControl(new Control(controlSize));
        canvas.setInitialGraph();
        canvas.init();
    }
};