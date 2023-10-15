uniform sampler2D tDiffuse;
uniform float uTime;
uniform vec2 uResolution;
varying vec2 UV;

vec3 getColor(vec2 uv) {
    return texture2D(tDiffuse, UV).xyz;
}

void main() {
    vec3 texel = getColor(UV);
    vec2 uv = UV * vec2(1, uResolution.y / uResolution.x);
    texel += vec3(int(uv.x < .5 && uv.y < .5));

    gl_FragColor = vec4(texel, 1);
}