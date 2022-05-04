import * as THREE from 'three'
import Experience from '../Experience.js'
import floorVertexShader from '../Shaders/Floor/vertex.glsl'
import floorFragmentShader from '../Shaders/Floor/fragment.glsl'

export default class Environment
{
    constructor()
    {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug
        this.camera = this.experience.camera
        
        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('environment')
        }

        // this.setAmbientLight()
        // this.setDirectionalLight()
        this.setFloor()
    }

    setAmbientLight()
    {
        this.ambientLight = new THREE.AmbientLight('#fff9f5', 2)
        this.ambientLight.position.set(0, 2, 2)
        this.scene.add(this.ambientLight)

        // Debug
        if(this.debug.active)
        {
            this.debugFolder
                .add(this.ambientLight, 'intensity')
                .name('ambientLightIntensity')
                .min(0)
                .max(10)
                .step(0.001)

            this.debugFolder
                .addColor(this.ambientLight, 'color')
                .name('ambientLightColor')
        }
    }

    setDirectionalLight()
    {
        this.directionalLight = new THREE.DirectionalLight('#fff9f5', 1.2)
        this.directionalLight.position.set(0, 2, 2)
        this.scene.add(this.directionalLight)

        // Debug
        if(this.debug.active)
        {
            this.debugFolder
                .add(this.directionalLight, 'intensity')
                .name('directionalLightIntensity')
                .min(0)
                .max(10)
                .step(0.001)

            this.debugFolder
                .addColor(this.directionalLight, 'color')
                .name('directionalLightColor')
        }
    }

    setFloor()
    {
        let colorController = {
            uInnerColor: "#f2f2f2",
            uOuterColor: "#f0f0f0"
        }
        
        this.floorGeometry = new THREE.PlaneGeometry(10, 10, 1, 1)
        this.floorMaterial = new THREE.ShaderMaterial({
            transparent: true,
            uniforms: {
                uInnerColor: { value: new THREE.Color(colorController.uInnerColor) },
                uOuterColor: { value: new THREE.Color(colorController.uOuterColor) },
                uRadius: { value: 0.2 },
                uFalloff: { value: 2 }
            },
            vertexShader: floorVertexShader,
            fragmentShader: floorFragmentShader
        })

        this.floor = new THREE.Mesh(this.floorGeometry, this.floorMaterial)
        this.floor.position.set(0, -0.5, 0)
        this.floor.rotation.set(Math.PI * -0.5, 0, 0)
        this.scene.add(this.floor)

        // Debug
        if(this.debug.active)
        {
            this.debugFolder
                .addColor(colorController, 'uInnerColor')
                .name('floorInnerColor')
                .onChange(val => { this.floorMaterial.uniforms.uInnerColor.value.set(val) })
            
            this.debugFolder
                .addColor(colorController, 'uOuterColor')
                .name('floorOuterColor')
                .onChange(val => { this.floorMaterial.uniforms.uOuterColor.value.set(val) })
            
            this.debugFolder.add(this.floorMaterial.uniforms.uRadius, 'value')
                .min(0).max(1).step(0.01).name('floorRadius')

            this.debugFolder.add(this.floorMaterial.uniforms.uFalloff, 'value')
                .min(0).max(10).step(0.01).name('floorFalloff')
        }
    }
}