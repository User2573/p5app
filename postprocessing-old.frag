uniform sampler2D tDiffuse;
uniform float uTime;
uniform vec2 uResolution;
varying vec2 UV;

vec3 getColor(vec2 uv) {
    return texture2D(tDiffuse, uv).xyz;
}

const float kernel[25] = float[25](
    1.,4., 7., 4., 1.,
    4.,16.,26.,16.,4.,
    7.,26.,41.,26.,7.,
    4.,16.,26.,16.,4.,
    1.,4., 7., 4., 1.
);
void main() {
    vec2 samplestep = 1./uResolution;
    vec3 texel = vec3(0);
    for (int i = 0; i < 5; i++) {
        for (int j = 0; j < 5; j++) {
            texel += getColor(UV + vec2(i-2,j-2) / uResolution) * kernel[i*5+j];
        }
    }
    texel /= 273.;

    vec3 gray = vec3(texel.x+texel.y+texel.z) / 3.;
    texel = mix(texel, gray, .7);

    texel = mix(texel, gray*vec3(1.2, 1.0, 0.8),.4);

    vec2 vignette = pow(4.*UV*(vec2(1)-UV),vec2(.3));
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