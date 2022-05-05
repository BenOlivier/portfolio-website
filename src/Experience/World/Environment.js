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
        this.pointer = this.experience.pointer
        this.raycaster = new THREE.Raycaster()

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

        this.setBackground()
        this.setFloor()
    }

    setBackground()
    {
        this.backgroundColors = {
            uLightColor: "#e5e5e5",
            uDarkColor: "#252b31"
        }
        
        this.backgroundGeometry = new THREE.PlaneGeometry(20, 20, 1, 1)
        this.backgroundMaterial = new THREE.ShaderMaterial({
            transparent: true,
            uniforms: {
                uCurrentColor: { value: new THREE.Color(this.backgroundColors.uLightColor) },
                uNewColor: { value: new THREE.Color(this.backgroundColors.uDarkColor) },
                uCentre: { value: new THREE.Vector2(1, 1) },
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
        // Update circle centre
        this.raycaster.setFromCamera(this.pointer.pointerPos, this.camera.camera)
        this.intersects = this.raycaster.intersectObjects([this.background])
        if(this.intersects.length)
        {
            this.background.material.uniforms.uCentre.value = this.intersects[0].uv
        }
        
        if(this.darkModeEnabled)
        {
            this.background.material.uniforms.uCurrentColor.value.set(this.backgroundColors.uDarkColor)
            this.background.material.uniforms.uNewColor.value.set(this.backgroundColors.uLightColor)
            // Expand circle radius
            gsap.to(this.background.material.uniforms.uRadius, {
                duration: 1,
                ease: "power3.in",
                value: 2,
                onComplete: this.background.material.uniforms.uRadius.value = 0
            })
            // Increase floor alpha
            gsap.to(this.floor.material.uniforms.uAlpha, {
                duration: 0.8,
                ease: "power4.in",
                value: 0.6,
                delay: 0.2
            })

            this.darkModeButton.children[0].src = "images/icons/darkmode.png"
            this.homeButton.children[0].src = "images/icons/logodark.png"
            this.darkModeEnabled = false
        }
        else
        {
            this.background.material.uniforms.uCurrentColor.value.set(this.backgroundColors.uLightColor)
            this.background.material.uniforms.uNewColor.value.set(this.backgroundColors.uDarkColor)
            // Expand circle radius
            gsap.to(this.background.material.uniforms.uRadius, {
                duration: 1,
                ease: "power3.in",
                value: 2,
                onComplete: this.background.material.uniforms.uRadius.value = 0
            })
            // Reduce floor alpha
            gsap.to(this.floor.material.uniforms.uAlpha, {
                duration: 1,
                ease: "power1.out",
                value: 0.04
            })

            this.darkModeButton.children[0].src = "images/icons/lightmode.png"
            this.homeButton.children[0].src = "images/icons/logolight.png"
            this.darkModeEnabled = true
        }
    }
}