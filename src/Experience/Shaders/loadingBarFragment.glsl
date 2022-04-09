uniform float uProgress;
uniform float uAlpha;
uniform vec2 uResolution;
varying vec4 vModelPosition;

float plot(vec2 st, float pct)
{
    return  smoothstep(pct - 0.02, pct, st.y) -
        smoothstep(pct, pct + 0.02, st.y);
}
void main()
{
    vec2 st = gl_FragCoord.xy / uResolution;
    
    float y = step(st.x, uProgress);
    vec3 color = vec3(y);
    float pct = plot(st, y);
    color = (1.0 - pct) * color
        + pct * vec3(1.0,1.0,1.0);

    gl_FragColor = vec4(color,uAlpha);
}