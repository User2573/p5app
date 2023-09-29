precision mediump float;

uniform vec3 iResolution;

varying vec2 fragCoord;


void main() {
  gl_FragColor = vec4(fragCoord, 0, 1);
}