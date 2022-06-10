uniform sampler2D uColorMap;
uniform vec3 uCircleColor;
uniform float uWaveMagnitude;
uniform vec2 uWaveFrequency;
uniform float uWaveSpeed;
uniform float uTime;

varying vec2 vUv;

vec2 SineWave( vec2 p ){
    float w = 10.0 * uWaveFrequency.x;
    float t = 30.0/180.0 * uTime * uWaveSpeed;
    float y = sin( w*p.y + t) * uWaveMagnitude; 
    return vec2(p.x + y, p.y);
}

void main()
{
    vec2 waveUv = SineWave(vUv);
    float mask = (1.0 - step(0.4, length(vec2(waveUv.x - 0.5, waveUv.y * 1.35 -0.5))));

    vec4 photo = texture2D(uColorMap, vUv) * mask;
    
    vec4 circle = vec4(0.0, 0.0, 0.5, (1.0 - photo.a)) * mask;
    
    gl_FragColor = mix(circle, photo, photo.a);
}