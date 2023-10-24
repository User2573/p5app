uniform sampler2D tDiffuse;
uniform float uTime;
uniform vec2 uResolution;
varying vec2 UV;



vec3 getColor(vec2 uv) {
    return texture2D(tDiffuse, uv).xyz;
}

void main() {
    vec3 texel = getColor(UV);
    gl_FragColor = vec4(texel, 1);
}