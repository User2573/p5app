uniform sampler2D tDiffuse;
uniform float uTime;
uniform vec2 uResolution;
varying vec2 UV;

vec3 getColor(vec2 uv) {
    return texture2D(tDiffuse, UV).xyz;
}

void main() {
    vec3 texel = getColor(UV);
    vec2 coord = UV * vec2(1, uResolution.y / uResolution.x);

    float stripe = sin(50.*coord.y+2.*uTime);
    stripe *= stripe * stripe;
    texel *= 1.+.5*stripe;

    gl_FragColor = vec4(texel, 1);
}