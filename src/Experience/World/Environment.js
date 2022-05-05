import * as THREE from 'three'
import gsap from 'gsap'
import Experience from '../Experience.js'
import floorVertexShader from '../Shaders/Floor/vertex.glsl'
import floorFragmentShader from '../Shaders/Floor/fragment.glsl'
import backgroundVertexShader from '../Shaders/Background/vertex.glsl'
import backgroundFragmentShader from '../Shaders/Background/fragment.glsl'

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

        this.darkModeEnabled = false
        this.darkModeButton = document.getElementById("dark-mode-button")
        this.homeButton = document.getElementById("home-button")
        this.darkModeButton.addEventListener('click', () =>
        {
            this.toggleDarkMode()
        })
        
        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('environment')
        }

        // this.setAmbientLight()
        // this.setDirectionalLight()
        this.setBackground()
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

    setBackground()
    {
        this.backgroundColors = {
            uLightColor: "#e5e5e5",
            uDarkColor: "#252b31"
        }
        
        this.backgroundGeometry = new THREE.PlaneGeometry(10, 10, 1, 1)
        this.backgroundMaterial = new THREE.ShaderMaterial({
            transparent: true,
            uniforms: {
                uCurrentColor: { value: new THREE.Color(this.backgroundColors.uLightColor) },
                uNewColor: { value: new THREE.Color(this.backgroundColors.uDarkColor) },
                uCentre: { value: new THREE.Vector2(0.8, 0.5) },
                uRadius: { value: 0 },
                uAlpha: { value: 0 }
            },
            vertexShader: backgroundVertexShader,
            fragmentShader: backgroundFragmentShader
        })

        this.background = new THREE.Mesh(this.backgroundGeometry, this.backgroundMaterial)
        this.background.position.set(0, 0, -5)
        this.scene.add(this.background)

        // Debug
        if(this.debug.active)
        {
            this.debugFolder
                .addColor(this.backgroundColors, 'uLightColor')
                .name('backgroundLightColor')
                .onChange(val => { this.backgroundMaterial.uniforms.uLightColor.value.set(val) })
            
            this.debugFolder
                .addColor(this.backgroundColors, 'uDarkColor')
                .name('backgroundDarkColor')
                .onChange(val => { this.backgroundMaterial.uniforms.uDarkColor.value.set(val) })
        }
    }

    setFloor()
    {
        this.floorColors = {
            uLightColor: "#ffffff",
            uDarkColor: "#515458"
        }
        
        this.floorGeometry = new THREE.PlaneGeometry(10, 10, 1, 1)
        this.floorMaterial = new THREE.ShaderMaterial({
            transparent: true,
            uniforms: {
                uInnerColor: { value: new THREE.Color(this.floorColors.uLightColor) },
                uOuterColor: { value: new THREE.Color(this.backgroundColors.uLightColor) },
                uRadius: { value: 0.2 },
                uFalloff: { value: 2 },
                uAlpha: { value: 0 }
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
                .addColor(this.floorColors, 'uLightColor')
                .name('floorLightColor')
                .onChange(val => { this.floorMaterial.uniforms.uInnerColor.value.set(val) })
            
            this.debugFolder
                .addColor(this.floorColors, 'uDarkColor')
                .name('floorDarkColor')
                .onChange(val => { this.floorMaterial.uniforms.uInnerColor.value.set(val) })
            
            this.debugFolder.add(this.floorMaterial.uniforms.uRadius, 'value')
                .min(0).max(1).step(0.01).name('floorRadius')

            this.debugFolder.add(this.floorMaterial.uniforms.uFalloff, 'value')
                .min(0).max(10).step(0.01).name('floorFalloff')
        }
    }

    toggleDarkMode()
    {
        if(this.darkModeEnabled)
        {
            // this.floor.material.uniforms.uInnerColor.value.set(this.floorColors.uLightColor)
            // this.floor.material.uniforms.uOuterColor.value.set(this.backgroundColors.uLightColor)
            this.background.material.uniforms.uCurrentColor.value.set(this.backgroundColors.uDarkColor)
            this.background.material.uniforms.uNewColor.value.set(this.backgroundColors.uLightColor)
            gsap.to(this.background.material.uniforms.uRadius, {
                duration: 1,
                ease: "power3.in",
                value: 1,
                onComplete: this.background.material.uniforms.uRadius.value = 0
            })

            this.darkModeButton.children[0].src = "images/icons/darkmode.png"
            this.homeButton.children[0].src = "images/icons/logodark.png"
            this.darkModeEnabled = false
        }
        else
        {
            // this.floor.material.uniforms.uInnerColor.value.set(this.floorColors.uDarkColor)
            // this.floor.material.uniforms.uOuterColor.value.set(this.backgroundColors.uDarkColor)
            this.background.material.uniforms.uCurrentColor.value.set(this.backgroundColors.uLightColor)
            this.background.material.uniforms.uNewColor.value.set(this.backgroundColors.uDarkColor)
            gsap.to(this.background.material.uniforms.uRadius, {
                duration: 1,
                ease: "power3.in",
                value: 1,
                onComplete: this.background.material.uniforms.uRadius.value = 0
            })

            gsap.utils.interpolate()

            this.darkModeButton.children[0].src = "images/icons/lightmode.png"
            this.homeButton.children[0].src = "images/icons/logolight.png"
            this.darkModeEnabled = true
        }
    }
}