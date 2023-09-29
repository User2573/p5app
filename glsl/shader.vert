attribute vec3 aPosition;

void main() {
  vec4 position4 = vec4(aPosition, 1.0);
  position4.xy = position4.xy * 2.0 - 1.0;
  gl_Position = position4;
}