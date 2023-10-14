let myShader;

function preload() {
    myShader = loadShader('glsl/shader.vert', 'glsl/shader.frag');
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}





function draw() {
    background(200);


    rotateY(0.5);
    box(30, 50);
    // shader(myShader);
    // myShader.setUniform('iResolution', [width, height])
    // rect(0, 0, width, height);
}