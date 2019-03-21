import './style.scss';

/*INPUT & COFIG*/
const method = "GET";
const url = "data.json";
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
const canavsSize = {width: 1200, height: 650};
const thumbSize = {width: 1200, height: 100};
const controlSize = {width: 350, height: 100};
const PROJECTION_HEIGHT = 500;
const buttonSize = {width: "140px", height: "50px"};
const YINTERVAL = 6;
const AXISOffsetX = 40;
const AXISOffsetY = 40;
const CORRELATION = 0.9;
const PRECISION = 3;
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
        this.fill = "#d4f2f0";
        this.isDragging = false;
        this.isResizing = false;
    };

    // draw a  rect
    rectangle ({x, y, width, height}, context){
        context.beginPath();
        context.rect(x, y, width, height);
        context.closePath();
        context.fill();

        // set draggable edges color
        context.fillStyle ="indigo";
        context.fillRect(x, y, 10, height);
        context.fillRect(width + x - 10, y, 10, height);
    };

    // create draggable && resizable rectangle
    draw(context){
        context.fillStyle = this.fill;
        this.rectangle(this, context);
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

    static drawAxis(text, {x, y}, context){
        context.save();
        context.scale(1, -1);
        context.fillStyle = "grey";
        context.fillText(text, x, y);
        context.restore();
    };

    // create single graph
    draw({ color, x, y }, { rx, ry }, context, separate = 0){
        if(separate){
            context.lineWidth = 3;
        } else {
            context.lineWidth = 2;
        }
        context.beginPath();
        context.strokeStyle = color;
        context.lineJoin = 'round';

        // LINES
        for (let i = 0, k = x.length; i < k; i++) {
            context.lineTo(i * rx, y[i] * ry + separate);
            if (i % Math.round(k/YINTERVAL) === 0 && separate) {
                let pos = {x: i * rx, y: -(separate - AXISOffsetY)};
                Chart.drawAxis(getDate(x[i]), pos, context );
            }
        }
        context.stroke();
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
        this.ratio.ry = Graph.getRelationAtoB(this.height, Math.max(...this.maxY), CORRELATION, PRECISION);
        this.ratio.rx = Graph.getRelationAtoB(this.width, this.num, 1 , PRECISION);
        this.ratio.prx = Graph.getRelationAtoB(this.width, this.num2, 1, PRECISION);
        this.ratio.pry = Graph.getRelationAtoB(this.graphHeight, Math.max(...this.maxY2), CORRELATION, PRECISION);
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

        // reassing each time
        this.maxY2.length = 0;

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
            return ((a / b) * c).toPrecision(PRECISION);
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

        /*FEED*/
        this.colors = colors;
        this.names = names;
        this.types = types;
        this.columns = columns;

        /*SCENE (whole canvas)*/
        this.width = size.width;
        this.height = size.height;

        let canvas = document.createElement('canvas');
            canvas.width = size.width;
            canvas.height = size.height;
            canvas.id = id;

        this.el = canvas;

        /*CONTEXT*/
        this.context = canvas.getContext('2d');
        this.context.font = "18px Arial";

        /* EVENTS */
        // listen for mouse events
        this.dragok = false;
        this.dragL = false;
        this.dragR = false;
        this.startX;

        canvas.onmousedown = this.myDown.bind(this);
        canvas.onmouseup = this.myUp.bind(this);
        canvas.onmousemove = this.myMove.bind(this);
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

    addButton(button){
        this.buttons.push(button)
    };

    /*DRAWING*/
    drawXLine(){
        this.context.lineWidth = 1;
        this.context.strokeStyle = 'grey';
        this.context.fillStyle = 'grey';
        let { pry } = this.graph.ratio;

        /*draw xAxis*/
        for (let j = 0; j < YINTERVAL; j++) {
            this.context.save();
            let y = CORRELATION * j * this.graph.graphHeight / YINTERVAL;
            let val = parseInt(y / pry).toString();
            let dY = y + SEPARATE;

            /*draw xAxis*/
            this.context.beginPath();
            this.context.moveTo(AXISOffsetX, dY);

            this.context.lineTo(this.graph.width - AXISOffsetX, dY);
            this.context.scale(1, -1);

            this.context.fillText(val, AXISOffsetX, -(dY + 10));
            this.context.stroke();
            this.context.restore();
        }

    };

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
        button.onclick = this.toggleGraph.bind(this);
        controls.appendChild(button);
    };

    // delete graph from feed canvas
    toggleGraph(evt){
        const key = evt.target.id;
        const { charts, maxY, deleted } = this.graph;
        const tmp = charts[key];
        const tmpDel = deleted[key];

        /*@TODO toggle buttons with SVG*/
        if (key in charts) {
            //delete the graph
            this.graph.charts = objectWithoutKey(charts, key);
            this.graph.projection = objectWithoutKey(charts, key);

            this.graph.maxY = remove(maxY, tmp.max);
            this.graph.maxY2 = remove(maxY, tmp.max);

            this.graph.deleted[key] = tmp;
            evt.target.style.backgroundColor = 'white';
        } else {
            //add the graph
            this.graph.charts[key] = tmpDel;
            this.graph.projection[key] = tmpDel;

            this.graph.maxY.push(tmpDel.max);
            this.graph.maxY2.push(tmpDel.max);
            evt.target.style.backgroundColor = tmpDel.color;
            //redraw the scene
            this.draw()
        }

        //redraw the scene
        this.draw()
    };

    /*Canvas manipulations*/
    draw(){

        this.clearCanvas();

        // draw control
        this.control.draw(this.context);

        // set all ratios
        this.graph.setRatio();

        this.drawXLine();

        let {charts, ratio, projection} = this.graph;
        let {prx, pry} = ratio;

        Object.values(charts).forEach(chart => {
            chart.draw(chart, ratio, this.context);
        });

        // draw main canvas
        Object.values(projection).forEach(projection => {
            projection.draw(projection, {rx: prx, ry: pry}, this.context, SEPARATE);
        });


    };

    init() {
        main.appendChild(this.el);
        this.buttons.forEach(this.drawButton.bind(this));
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
        parseFeed(result[0])
    });

const parseFeed = (feed) => {

    /*CANVAS*/
    const canvas = new Scene(canavsSize, "mainImg", feed);
    canvas.setControl(new Control(controlSize));

    canvas.setInitialGraph();
    canvas.init();

};
