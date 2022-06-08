varying vec2 vUv;

void main()
{
    float strength = (1.0 - step(0.5, length(vUv - 0.5)));
    
    gl_FragColor = vec4(0.0, 0.0, 0.5, strength);
}