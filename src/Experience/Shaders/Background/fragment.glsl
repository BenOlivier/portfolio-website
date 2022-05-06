uniform vec3 uCurrentBgColor;
uniform vec3 uNewBgColor;
uniform vec3 uCurrentFlColor;
uniform vec3 uNewFlColor;
uniform vec2 uMaskCentre;
uniform float uMaskRadius;
uniform float uFloorRadius;
uniform float uFloorFalloff;
uniform float uFloorHeight;
varying vec2 vUv;

void main()
{
    
    float maskInner = (1.0 - step(uMaskRadius, length(vUv - uMaskCentre)));
    float maskOuter = step(uMaskRadius, length(vUv - uMaskCentre));

    float floorStrength = clamp(pow(length(vec2(vUv.x, vUv.y * 5.0 - uFloorHeight)
        - 0.5) / uFloorRadius, uFloorFalloff), 0.0, 1.0);

    vec3 bgInner = maskInner * floorStrength * uNewBgColor;
    vec3 bgOuter = maskOuter * floorStrength * uCurrentBgColor;
    
    vec3 flInner = maskInner * (1.0 - floorStrength) * uNewFlColor;
    vec3 flOuter = maskOuter * (1.0 - floorStrength) * uCurrentFlColor;

    vec3 combined = bgInner + bgOuter + flInner + flOuter;

    gl_FragColor = vec4(combined, 1.0);
}