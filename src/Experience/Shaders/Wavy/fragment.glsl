uniform sampler2D uColorMap;
uniform vec3 uCircleColor;

varying vec2 vUv;

void main()
{
    float mask = (1.0 - step(0.5, length(vec2(vUv.x - 0.5, vUv.y * 1.35 -0.5))));

    vec4 photo = texture2D(uColorMap, vUv) * mask;
    
    vec4 circle = vec4(uCircleColor, (1.0 - photo.a)) * mask;
    
    gl_FragColor = mix(circle, photo, photo.a);
}