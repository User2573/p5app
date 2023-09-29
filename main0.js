function preload() {
    console.log('preload :)');
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

const rects = [];
function draw() {
    background(200);
    for (const r of rects) {
        strokeWeight(0);
        fill(r.c);
        const x = Math.min(r.x0, r.x1);
        const X = Math.max(r.x0, r.x1);
        const y = Math.min(r.y0, r.y1);
        const Y = Math.max(r.y0, r.y1);
        rect(x - windowWidth/2, y - windowHeight/2, X - x, Y - y);


        if (!r.editing) {
            
        }
    }
}




function mousePressed() {
    const rand = () => 255 * Math.random();
    rects.push({
        x0: mouseX,
        y0: mouseY,
        x1: mouseX,
        y1: mouseY,
        c: color(rand(), rand(), rand()),
        editing: true
    });
}

function mouseDragged() {
    if (rects.length > 0) {
        const r = rects[rects.length-1];
        r.x1 = mouseX;
        r.y1 = mouseY;
        rects[rects.length-1] = r;
    }
}

function mouseReleased() {
    rects[rects.length-1].editing = false;
}