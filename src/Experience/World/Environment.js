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
        this.pointer = this.experience.pointer
        this.camera = this.experience.camera
        
        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('environment')
        }

        this.setBackground()
        this.setPointLight()
    }

    setBackground()
    {
        let colorController = {
            uColor1: "#5c5c5c",
            uColor2: "#000000"
        }
        
        this.backgroundGeometry = new THREE.PlaneGeometry(10, 10, 1, 1)
        this.backgroundMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uColor1: { value: new THREE.Color(colorController.uColor1) },
                uColor2: { value: new THREE.Color(colorController.uColor2) },
                uRadius: { value: 0.3 }
            },
            vertexShader: `
                varying vec2 vUv;

                void main()
                {
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    vUv = uv;
                }
            `,
            fragmentShader: `
                uniform vec3 uColor1;
                uniform vec3 uColor2;
                uniform float uRadius;

                varying vec2 vUv;

                void main()
                {
                    float strength = length(vUv - 0.5) / uRadius;
                    gl_FragColor = vec4(mix(uColor1, uColor2, strength), 1.0);
                }
            `
        })

        this.background = new THREE.Mesh
            (this.backgroundGeometry, this.backgroundMaterial)
        this.background.position.set(0, -3, -4)
        this.background.scale.set(3, 3, 3)
        this.scene.add(this.background)

        // Debug
        if(this.debug.active)
        {
            this.debugFolder
                .addColor(colorController, 'uColor1')
                .name('backgroundColor1')
                .onChange(val => { this.backgroundMaterial.uniforms.uColor1.value.set(val) })
            
            this.debugFolder
                .addColor(colorController, 'uColor2')
                .name('backgroundColor2')
                .onChange(val => { this.backgroundMaterial.uniforms.uColor2.value.set(val) })
            
            this.debugFolder.add(this.backgroundMaterial.uniforms.uRadius, 'value').min(0).max(1).step(0.01).name('radius')
        }
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
        this.mouseVec.set(this.pointer.pointerPos.x, this.pointer.pointerPos.y, 0)
            .unproject(this.camera.camera).sub(this.camera.camera.position).normalize()
        this.lightPos.copy(this.camera.camera.position).add(this.mouseVec.multiplyScalar
            ((this.pointLight.position.z - this.camera.camera.position.z ) / this.mouseVec.z))

        this.pointLight.position.set(this.lightPos.x, this.lightPos.y, this.lightPos.z)
    }
}