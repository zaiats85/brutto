/*INPUT & COFIG*/
const method = "GET";
const url = "data.json";

/*TRANSPORT*/
const getJson = (method, url) => {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onload =  () => {
            if (this.status >= 200 && this.status < 300) {
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
};

/* UTILS */

function init() {

    debugger

    getJson(method, url)
        .then(function (result) {
            console.log(JSON.parse(result));
        })
        .catch(function (err) {
            console.error('An error!', err.statusText);
        })
}

init();

function component() {
    let element = document.createElement('div');

    // Lodash, currently included via a script, is required for this line to work
    element.innerText = "Hello world";

    return element;
}

document.body.appendChild(component());