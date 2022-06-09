uniform float uTime;
uniform float uWaveElevation;
uniform vec2 uWaveFrequency;
uniform float uWaveSpeed;

varying vec2 vUv;

void main()
{
    vUv = uv;
	vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // Elevation
    float elevation = sin(modelPosition.x * uWaveFrequency.x + uTime * uWaveSpeed) *
    sin(modelPosition.y * uWaveFrequency.y + uTime * uWaveSpeed) * uWaveElevation;
    
    // modelPosition.z += elevation;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
}