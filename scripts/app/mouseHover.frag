uniform sampler2D tDiffuse;
uniform vec2 uCorner;
uniform vec2 uDimensions;
uniform vec2 uMouse;
uniform float uBorderRadius;
uniform float uBorderWidth;
uniform vec4 uBorderColor;
varying vec2 UV;



void main() {
    vec3 texel = texture2D(tDiffuse, UV).xyz;

    vec2 texelPos = uCorner + (vec2(UV.x, 1.-UV.y)) * uDimensions;
    


    
    vec2 q = abs(texelPos-uCorner-uDimensions/2.)-uDimensions/2.+uBorderRadius;
    float borderDist = uBorderRadius - min(max(q.x,q.y),0.0) - length(max(q,0.0));

    float falloff = .5;
    float inBorder = smoothstep(uBorderWidth+falloff, uBorderWidth-falloff, borderDist);
    
    float alpha = 1.;
    texel = mix(texel, inBorder*uBorderColor.xyz, uBorderColor.w);


    float dist2 = dot(texelPos - uMouse, texelPos - uMouse);
    float mouseHighlight = .005 * sin(exp(-dist2/pow(75., 2.)));
    mouseHighlight = mix(mouseHighlight, pow(mouseHighlight, .7), inBorder);
    //texel += vec3(mouseHighlight);


    gl_FragColor = vec4(texel, 1);
}