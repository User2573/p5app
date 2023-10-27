uniform sampler2D tDiffuse;
uniform float uTime;
uniform vec2 uResolution;
varying vec2 UV;



void main() {
    vec3 texel = texture2D(tDiffuse, UV).xyz;

    vec3 gray = vec3(texel.x+texel.y+texel.z) / 3.;
    texel = mix(texel, gray, .7);

    texel = mix(texel, gray*vec3(1.2, 1.0, 0.8),.5);

    vec2 vignette = pow(4.*UV*(vec2(1)-UV),vec2(.5));
    texel *= vignette.x * vignette.y;

    
    texel = pow(texel, vec3(1.5));


    // vec2 coord = UV * (uResolution.x < uResolution.y ?
    //     vec2(uResolution.x / uResolution.y, 1) :
    //     vec2(1, uResolution.y / uResolution.x));
    float stripe = sin(50.*UV.y*(
        uResolution.x < uResolution.y ? 1. : uResolution.y / uResolution.x
    )+2.*uTime);
    stripe *= stripe * stripe;
    texel *= 1.8+stripe;


    gl_FragColor = vec4(texel, 1);
}