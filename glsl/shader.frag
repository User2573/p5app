precision mediump float;

uniform vec3 iResolution;

varying vec2 fragCoord;


void main() {
    gl_FragColor = vec4(vec3(fragCoord.x), 1);
}