uniform vec2 uResolution;
varying vec4 vModelPosition;

void main()
{
    vec4 modelPosition = vec4(position, 1.0) * modelMatrix;
    vModelPosition = modelPosition;
    gl_Position = modelPosition;
}