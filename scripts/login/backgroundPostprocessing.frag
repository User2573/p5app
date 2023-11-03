uniform sampler2D tDiffuse;
uniform float uTime;
uniform vec2 uResolution;
uniform bool uBackground;
varying vec2 UV;



void main() {
    vec3 texel = texture2D(tDiffuse, UV).xyz;

    vec3 gray = vec3(texel.x+texel.y+texel.z) / 3.;
    texel = mix(texel, gray, .7);

    texel = mix(texel, gray*vec3(1.2, 1.0, 0.8),.5);

    vec2 vignette = pow(4.*UV*(vec2(1)-UV),vec2(1));
    texel *= vignette.x * vignette.y;

    
    texel = pow(texel, vec3(1.5));


    float stripe = sin(50.*UV.y*(
        uResolution.x < uResolution.y ? 1. : uResolution.y / uResolution.x
    )+2.*uTime);
    stripe *= stripe * stripe;
    texel *= 1.8+stripe;


    if (uBackground) {
        vec4 q = vec4(vec3(sin(2.*uTime) / sqrt(3.)), cos(2.*uTime));
        texel = texel + 2.*cross(cross(texel, q.xyz) + q.w*texel, q.xyz);
    }


    gl_FragColor = vec4(texel, 1);
}
