function parseFeed(feed, i) {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext("2d");

    canvas.id = `canvas-${i}`;
    canvas.width = WIDTH;
    canvas.height = Y;

    // listen for mouse events
    canvas.onmousedown = myDown;
    canvas.onmouseup = myUp;
    canvas.onmousemove = myMove;

    const s_rate = scaleRate(feed.columns, feed.names, ctx);

    let BB = canvas.getBoundingClientRect();
    let offsetX = BB.left;
    let HEIGHT = Y;

    // drag n resize related variables
    let dragok = false;
    let dragL = dragR = false;
    let startX;

    // control chart
    let control = {
        x: 400,
        y: 8,
        width: 400,
        height: Y-16,
        fill: "#ffffff",
        type: "rectangle",
        isDragging: false,
        isResizing: false
    };

    let graphs = [];
    graphs.push(control);

    // detect charts displayed together
    Object.entries(feed.names).forEach(([key, value]) => {
        graphs.push({
            color: feed.colors[key],
            data: {
                x: deepAwfullTuple(feed.columns, "x"),
                y: deepAwfullTuple(feed.columns, key),
            },
            type: feed.types[key],
            name: value,
            scaleRate: s_rate
        });
    });

    // draw a single rect
    function rect(x, y, w, h) {
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.closePath();
        ctx.fill();
    }

    // clear the canvas
    function clear() {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
    }

    // handle mousedown events
    function myDown(e) {
        e.preventDefault();
        e.stopPropagation();

        // left resizable area
        const leftSide = new Path2D();
        leftSide.rect(control.x - 10, control.y, 40, Y*2);

        // right resizable area
        const rightSide = new Path2D();
        rightSide.rect(control.x + control.width - 20, control.y, 40, Y*2);

        // current mouse position
        let mx = parseInt(e.clientX - offsetX);

        // 1. right
        if(ctx.isPointInPath(rightSide, e.clientX, e.clientY)) {
            dragR = true;
            control.isResizing = true;
        }
        // 2.left
        else if(ctx.isPointInPath(leftSide, e.clientX, e.clientY)) {
            dragL = true;
            control.isResizing = true;
        }
        // 3. right
        else if (mx > control.x && mx < control.x + control.width) {
            dragok = true;
            control.isDragging = true;
        }

        draw();

        // save the current mouse position
        startX = mx;
    }

    // handle mouseup events
    function myUp(e) {
        e.preventDefault();
        e.stopPropagation();

        // clear all the dragging flags
        dragok = dragL = dragR = false;
        control.isDragging = control.isResizing = false;
    }

    // handle mouse moves
    function myMove(e) {
        // if we're dragging || resizing anything...
        if (dragok || dragL || dragR) {

            let mouseX = e.pageX - this.offsetLeft;

            // tell the browser we're handling this mouse event
            e.preventDefault();
            e.stopPropagation();

            // get the current mouse position
            let mx = parseInt(e.clientX - offsetX);

            // calculate the distance the mouse has moved since the last mousemove
            let dx = mx - startX;

            // move control that isDragging by the distance the mouse has moved since the last mousemove
            if(control.isDragging){
                control.x += dx;
            } else if(dragL) {
                control.width += control.x - mouseX;
                control.x = mouseX;
            } else if (dragR){
                control.width = Math.abs(control.x - mouseX);
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // redraw the scene
            draw();

            // reset the starting mouse position for the next mousemove
            startX = mx;
        }
    }

    function draw() {
        clear();

        ctx.fillStyle = "#FAF7F8";
        rect(0, 0, WIDTH, HEIGHT);

        // redraw each rect in the graphs[] array
        for(let i = 0; i < graphs.length; i++){
            let r = graphs[i];

            // line charts only
            if (r.type === "line") {
                drawGraph(r);
            }

            // control only
            ctx.fillStyle = r.fill;
            rect(r.x, r.y, r.width, r.height);
        }
    }

    // call to draw the scene
    draw();
}
