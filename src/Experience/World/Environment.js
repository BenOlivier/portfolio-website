import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Environment
{
    constructor()
    {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug
        this.input = this.experience.input
        this.camera = this.experience.camera
        
        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('environment')
        }

        this.setBackground()
        this.setPointLight()

        // Mouse move event
        this.input.on('mousemove', () =>
        {
            this.updatePointLight()
        })
    }

    setBackground()
    {
        this.backgroundGeometry = new THREE.PlaneGeometry(10, 10, 1, 1)
        this.backgroundMaterial = new THREE.ShaderMaterial({
            uniforms: {
              color1: { value: new THREE.Color(0x333333) },
              color2: { value: new THREE.Color(0x000000) },
            },
            vertexShader: `varying vec2 vUv;
                void main()
                {
                    // vUv = uv;
                    vUv = vec2(position.x, position.y) * 0.5 + 0.5;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }`,
            fragmentShader: `varying vec2 vUv;
                uniform vec3 color1;
                uniform vec3 color2;
                void main()
                {
                    vec2 uv = (vUv - 0.5);
                    gl_FragColor = vec4( mix( color1, color2, length(uv)), 1.0);
                }`
            })

        this.background = new THREE.Mesh
            (this.backgroundGeometry, this.backgroundMaterial)
        this.background.position.set(0, -3, -4)
        this.background.scale.set(3, 3, 3)
        this.scene.add(this.background)
    }

    setPointLight()
    {
        this.pointLight = new THREE.PointLight('#ffffff', 5)
        this.pointLight.castShadow = true
        this.pointLight.shadow.camera.far = 15
        this.pointLight.shadow.mapSize.set(1024, 1024)
        this.pointLight.shadow.normalBias = 0.05
        this.pointLight.position.set(0, 2, 2)
        this.mouseVec = new THREE.Vector3()
        this.lightPos = new THREE.Vector3()
        this.scene.add(this.pointLight)

        // Debug
        if(this.debug.active)
        {
            this.debugFolder
                .add(this.pointLight, 'intensity')
                .name('pointLightIntensity')
                .min(0)
                .max(10)
                .step(0.001)
            
            this.debugFolder
                .add(this.pointLight.position, 'z')
                .name('pointLightDistance')
                .min(0)
                .max(10)
                .step(0.001)

            this.debugFolder
                .addColor(this.pointLight, 'color')
                .name('pointLightColor')
        }
    }

    updatePointLight()
    {
        this.mouseVec.set(this.input.mousePos.x, this.input.mousePos.y, 0)
            .unproject(this.camera.camera).sub(this.camera.camera.position).normalize()
        this.lightPos.copy(this.camera.camera.position).add(this.mouseVec.multiplyScalar
            ((this.pointLight.position.z - this.camera.camera.position.z ) / this.mouseVec.z))

        this.pointLight.position.set(this.lightPos.x, this.lightPos.y, this.lightPos.z)
    }
}