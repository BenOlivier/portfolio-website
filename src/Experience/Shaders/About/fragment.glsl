uniform sampler2D uColorMap;
uniform vec2 uMapOffset;
uniform vec2 uMapScale;
uniform vec3 uCircleColor;
uniform float uCircleScale;
uniform float uWaveMagnitude;
uniform vec2 uWaveFrequency;
uniform float uWaveSpeed;
uniform float uTime;
uniform float uShowTop;

varying vec2 vUv;

vec2 SineWave(vec2 p){
    float t = uTime * uWaveSpeed;
    float y = sin(uWaveFrequency.x * p.y + t) * uWaveMagnitude; 
    return vec2(p.x + y, p.y);
}

void main()
{
    vec2 waveUv = SineWave(vUv);
    vec2 maskPos = vec2(waveUv.x - 0.5, waveUv.y - 0.5);
    float mask = (1.0 - step(uCircleScale, length(maskPos)));

    vec2 photoPos = vec2(vUv.x * uMapScale.x + uMapOffset.x, vUv.y * uMapScale.y + uMapOffset.y);
    vec4 photo = texture2D(uColorMap, vec2(photoPos));
    vec4 photoTop = photo * (1.0 - mask) * (step(0.5, vUv.y)) * uShowTop;
    vec4 photoBottom = photo * mask;
    
    vec4 circle = vec4(0.12, 0.3, 0.65, (1.0 - photo.a)) * mask;
    gl_FragColor = mix(circle, photoTop + photoBottom, photo.a);
}