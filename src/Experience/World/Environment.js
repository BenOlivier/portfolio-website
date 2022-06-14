import * as THREE from 'three'
import gsap from 'gsap'
import Experience from '../Experience.js'
import backgroundVertexShader from '../Shaders/Background/vertex.glsl'
import backgroundFragmentShader from '../Shaders/Background/fragment.glsl'

export default class Environment
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug
        
        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('environment')
        }

        this.setBackground()
        this.setDirectionalLight()
        this.setEnvironmentMap()
    }

    setBackground()
    {
        this.colors = {
            uBgLight: "#e5e5e5",
            uBgDark: "#1e1e20",
            uFlLight: "#fafafa",
            uFlDark: "#2c2c2c"
        }
        
        this.backgroundGeometry = new THREE.PlaneGeometry(20, 20, 1, 1)
        this.backgroundMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uCurrentBgColor: { value: new THREE.Color(this.colors.uBgLight) },
                uNewBgColor: { value: new THREE.Color(this.colors.uBgDark) },
                uCurrentFlColor: { value: new THREE.Color(this.colors.uFlLight) },
                uNewFlColor: { value: new THREE.Color(this.colors.uFlDark) },
                uMaskCentre: { value: new THREE.Vector2(1, 1) },
                uMaskRadius: { value: 0 },
                uFloorRadius: { value: 0.25 },
                uFloorFalloff: { value: 2 },
                uFloorHeight: { value: 1.6 }
            },
            vertexShader: backgroundVertexShader,
            fragmentShader: backgroundFragmentShader
        })

        this.background = new THREE.Mesh(this.backgroundGeometry, this.backgroundMaterial)
        this.background.position.set(0, 0, -2)
        this.scene.add(this.background)

        // Debug
        if(this.debug.active)
        {
            this.debugFolder
                .addColor(this.colors, 'uBgLight')
                .name('backgroundLight')
                .onChange(val => { this.backgroundMaterial.uniforms.uCurrentBgColor.value.set(val) })
            
            this.debugFolder
                .addColor(this.colors, 'uBgDark')
                .name('backgroundDark')
                .onChange(val => { this.backgroundMaterial.uniforms.uCurrentBgColor.value.set(val) })
            
            this.debugFolder
                .addColor(this.colors, 'uFlLight')
                .name('floorLight')
                .onChange(val => { this.backgroundMaterial.uniforms.uCurrentFlColor.value.set(val) })
            
            this.debugFolder
                .addColor(this.colors, 'uFlDark')
                .name('floorDark')
                .onChange(val => { this.backgroundMaterial.uniforms.uCurrentFlColor.value.set(val) })
            
            this.debugFolder.add(this.backgroundMaterial.uniforms.uFloorRadius, 'value')
                .min(0).max(1).step(0.01).name('floorRadius')

            this.debugFolder.add(this.backgroundMaterial.uniforms.uFloorFalloff, 'value')
                .min(0).max(10).step(0.01).name('floorFalloff')
            
            this.debugFolder.add(this.backgroundMaterial.uniforms.uFloorHeight, 'value')
                .min(0).max(10).step(0.01).name('floorHeight')
        }
    }

    setDirectionalLight()
    {
        this.directionalLight = new THREE.DirectionalLight('#fff9f5', 2)
        this.directionalLight.position.set(-4, -4, 4)
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

    setEnvironmentMap()
    {
        this.environmentMap = {}
        this.environmentMap.intensity = 20 //TODO: Doesn't work
        this.environmentMap.texture = this.resources.items.environmentMapTexture
        this.environmentMap.texture.encoding = THREE.sRGBEncoding
        
        this.scene.environment = this.environmentMap.texture

        this.environmentMap.updateMaterials = () =>
        {
            this.scene.traverse((child) =>
            {
                if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
                {
                    child.material.envMap = this.environmentMap.texture
                    child.material.envMapIntensity = this.environmentMap.intensity
                    child.material.needsUpdate = true
                }
            })
        }
        this.environmentMap.updateMaterials()

        // Debug
        if(this.debug.active)
        {
            this.debugFolder
                .add(this.environmentMap, 'intensity')
                .name('envMapIntensity')
                .min(0)
                .max(20)
                .step(0.1)
                .onChange(this.environmentMap.updateMaterials)
        }
    }
}