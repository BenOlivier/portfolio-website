uniform vec3 uInnerColor;
uniform vec3 uOuterColor;
uniform float uRadius;
uniform float uFalloff;
varying vec2 vUv;

void main()
{
    float strength = pow(length(vUv - 0.5) / uRadius, uFalloff);
    gl_FragColor = vec4(mix(uInnerColor, uOuterColor, strength), 1.0 - strength);
}