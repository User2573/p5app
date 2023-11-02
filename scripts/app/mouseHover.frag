uniform sampler2D tDiffuse;
uniform vec2 uCorner;
uniform vec2 uDimensions;
uniform vec2 uMouse;
uniform float uMouseDown;
uniform float uBorderRadius;
uniform float uBorderWidth;
uniform vec4 uBorderColor;
varying vec2 UV;



void main() {
    vec3 texel = texture2D(tDiffuse, UV).xyz;

    vec2 texelPos = uCorner + (vec2(UV.x, 1.-UV.y)) * uDimensions;
    


    float dist2 = dot(texelPos - uMouse, texelPos - uMouse);
    float mouseHighlight = sin(exp(-dist2/pow(70., 2.)));
    texel = mix(texel, vec3(texel.x+texel.y+texel.z)/3., mouseHighlight);
    texel *= 1. + mouseHighlight*(1.5 + 8.*length(texel));


    // border
    vec2 q = abs(texelPos-uCorner-uDimensions/2.)-uDimensions/2.+uBorderRadius;
    float borderDist = uBorderRadius - min(max(q.x,q.y),0.0) - length(max(q,0.0));

    float falloff = .5;
    float inBorder = smoothstep(uBorderWidth+falloff, uBorderWidth-falloff, borderDist);
    
    float alpha = 1.;
    texel = mix(texel, mix(texel, uBorderColor.xyz, uBorderColor.w), inBorder);

    mouseHighlight *= .005;
    mouseHighlight = mix(0., pow(mouseHighlight, .5), inBorder);
    texel += vec3(mouseHighlight);


    gl_FragColor = vec4(texel, 1);
}