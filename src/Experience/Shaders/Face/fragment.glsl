varying vec3 vColor;

void main()
{
    // Diffuse + Point
    float diffuse = pow(1.0 - distance(gl_PointCoord, vec2(0.5)), 5.0);
    float point = step(distance(gl_PointCoord, vec2(0.5)), 0.04);
    float strength = diffuse + point;

    // Mix
    vec3 color = mix(vec3(0.0), vColor, strength);

    gl_FragColor = vec4(vec3(color), 1.0);
}