uniform vec3 uInnerColor;
uniform vec3 uOuterColor;
uniform float uRadius;
uniform float uFalloff;
uniform float uAlpha;
varying vec2 vUv;

void main()
{
    // float strength = pow(length(vUv - 0.5) / uRadius, uFalloff);
    float strength = pow(length(vec2(vUv.x, vUv.y * 4.0) - 0.5) / uRadius, uFalloff);
    gl_FragColor = vec4(mix(uInnerColor, uOuterColor, strength), 1.0);
}