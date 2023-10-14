let shader;
let model;

new p5(p => {
    p.setup = function() {
        p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);

        shader = p.loadShader('glsl/shader.vert', 'glsl/shader.frag');

        model = new p5.Geometry(1, 1, function() {
            this.vertices.push(
                new p5.Vector(-1,-1,-1),
                new p5.Vector(33, -12, 5),
                new p5.Vector(7, 46, 2)
            );

            this.faces.push([0, 1, 2]);
            this.gid = 'my-example-geometry';
        });
    }

    p.windowResized = function() {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    }




    p.draw = function() {
        p.orbitControl();
        p.background(220);

        p.shader(shader);
        p.model(model);

        return;
    }
});