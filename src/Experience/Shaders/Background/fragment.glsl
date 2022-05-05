uniform vec3 uCurrentColor;
uniform vec3 uNewColor;
uniform vec2 uCentre;
uniform float uRadius;
varying vec2 vUv;

void main()
{
    
    vec3 inner = (1.0 - step(uRadius, length(vUv - uCentre))) * uNewColor;
    vec3 outer = step(uRadius, length(vUv - uCentre)) * uCurrentColor;
    vec3 combined = inner + outer;

    gl_FragColor = vec4(combined, 1.0);
}