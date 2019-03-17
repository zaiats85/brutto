import './style.scss';

/*INPUT & COFIG*/
const method = "GET";
const url = "data.json";
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
const canavsSize = { width: 1200, height: 500 };
const buttonSize = { width: "140px", height: "50px" };

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
const min = input => {
    if(!Array.isArray(arr)) throw new Error("array expected");
    let min = 0;
    for(let i = 0, r = arr.length; i < r; i++){
        if(arr[i] < min && !isNaN(arr[i])){
            min = arr[i];
        }
    }
    return min;
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

            let x =  columns.find(col => col.includes("x"));
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

    //create single graph
    const drawGraph = (input, {rX, rY}) => {
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
        /*START*/

        let graphsRatio = {x: 1, y:[]};

        /*detect max X, Y*/
        Object.values(graphs).forEach(graph => {
            let { maxY } = graph;
            let tmp = ((canavsSize.height*0.9)/maxY).toPrecision(3);
            graphsRatio.y.push(tmp);
        });

        Object.entries(graphs).forEach(([key, value]) => {

            drawGraph(value, { rX: 10   , rY: Math.min(...graphsRatio.y)})

        })

        /*END*/


        /*Object.values(graphs).forEach(drawGraph);*/
    };

    /*DOM manipulations*/
    const end = (mainImg) => {
        main.appendChild(mainImg);
        Object.values(buttons).forEach(drawButton);
    };

    init();

};
