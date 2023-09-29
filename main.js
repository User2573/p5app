let myShader;

function preload() {
    myShader = loadShader('./glsl/shader.vert', './shader.frag');
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}





function draw() {
    shader(shader);
}