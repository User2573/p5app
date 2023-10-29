uniform sampler2D tDiffuse;
uniform vec2 uCorner;
uniform vec2 uDimensions;
uniform vec2 uMouse;
varying vec2 UV;



void main() {
    vec3 texel = texture2D(tDiffuse, UV).xyz;

    vec2 texelPos = uCorner + (vec2(UV.x, 1.-UV.y)) * uDimensions;

    float dist2 = dot(texelPos - uMouse, texelPos - uMouse);
    float brightness = sin(exp(-.0005*dist2));
    
    float r = 50.;
    vec2 q = abs(texelPos-uCorner-uDimensions/2.)-uDimensions/2.+r;
    float borderDist = r - min(max(q.x,q.y),0.0) - length(max(q,0.0));

    texel += vec3(.005 * brightness);

    float falloff = .5;
    float inBorder = smoothstep(4.+falloff, 4.-falloff, borderDist);
    texel = mix(texel, pow(texel,vec3(.5))+.05*vec3(21,20,36)/255., inBorder);


    gl_FragColor = vec4(texel, 1);
}