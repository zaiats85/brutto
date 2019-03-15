/*INPUT & COFIG*/
const method = "GET";
const url = "data.json";
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
const WIDHT = 1200;
const HEIGHT = 800;

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
const createCanvas = (width, height, id) => {
    let canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.id = id;
    return canvas
};

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
    const graphs = [];
    const {colors, names, types, columns} = feed;

    /*CANVAS*/
    const mainImg = createCanvas(WIDHT, HEIGHT, 'mainImg');
    let ctx = mainImg.getContext("2d");
    ctx.scale(1, 1);

    const drawGraph = (input) => {
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.strokeStyle = input.color;
        ctx.lineJoin = 'round';

        const {x, y} = input.data;

        for (let i = 0; i < x.length; i++) {
            ctx.lineTo(i*10, y[i]);
        }

        ctx.stroke();

    };

    Object.entries(names).forEach(([key, value]) => {
        let graph = {
            color: colors[key],
            name: names[key],
            type: types[key],
            data: {
                x: columns.find(col => col.includes("x")),
                y: columns.find(col => col.includes(key))
            }
        };

        graphs.push(graph);
        drawGraph(graph);
    });

    end(mainImg);

};

const deleteGraph = (data) => {

};

const end = (mainImg) => {
    document.body.appendChild(mainImg);
};
