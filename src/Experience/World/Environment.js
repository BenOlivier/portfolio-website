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
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug
        this.camera = this.experience.camera
        this.pointer = this.experience.pointer
        this.raycaster = new THREE.Raycaster()

        this.fog = new THREE.Fog('#e5e5e5', 4, 7)
        this.scene.fog = this.fog

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
        // this.setAmbientLight()
        this.setDirectionalLight()
    }

    setBackground()
    {
        this.colors = {
            uBgLight: "#e5e5e5",
            uBgDark: "#1d2125",
            uFlLight: "#fafafa",
            uFlDark: "#2e3033"
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
                uFloorHeight: { value: 1.5 }
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

    toggleDarkMode()
    {
        // Update circle centre
        this.buttonPos = new THREE.Vector2(this.darkModeButton.getBoundingClientRect().x / this.sizes.width,
            1 - ((this.darkModeButton.getBoundingClientRect().y + 72) / this.sizes.height))
        this.raycaster.setFromCamera(this.buttonPos, this.camera.camera)
        this.intersects = this.raycaster.intersectObjects([this.background])
        this.background.material.uniforms.uMaskCentre.value = this.intersects[0].uv

        // Set values
        if(this.darkModeEnabled)
        {
            this.background.material.uniforms.uCurrentBgColor.value.set(this.colors.uBgDark)
            this.background.material.uniforms.uNewBgColor.value.set(this.colors.uBgLight)
            this.background.material.uniforms.uCurrentFlColor.value.set(this.colors.uFlDark)
            this.background.material.uniforms.uNewFlColor.value.set(this.colors.uFlLight)
            this.darkModeButton.children[0].src = "images/icons/darkmode.png"
            this.homeButton.children[0].src = "images/icons/logodark.png"
            document.body.style.background = this.colors.uBgLight
            this.darkModeAnimation()
        }
        else
        {
            this.background.material.uniforms.uCurrentBgColor.value.set(this.colors.uBgLight)
            this.background.material.uniforms.uNewBgColor.value.set(this.colors.uBgDark)
            this.background.material.uniforms.uCurrentFlColor.value.set(this.colors.uFlLight)
            this.background.material.uniforms.uNewFlColor.value.set(this.colors.uFlDark)
            this.darkModeButton.children[0].src = "images/icons/lightmode.png"
            this.homeButton.children[0].src = "images/icons/logolight.png"
            document.body.style.background = this.colors.uBgDark
            this.darkModeAnimation()
        }
    }

    darkModeAnimation()
    {
        // Reset
        gsap.killTweensOf(this.background.material.uniforms.uMaskRadius)
        this.background.material.uniforms.uMaskRadius.value = 0

        // Expand circle radius
        gsap.to(this.background.material.uniforms.uMaskRadius, {
            duration: 1,
            ease: "power3.in",
            value: 2,
            callbackScope: this,
            onComplete: function(){ this.darkModeEnabled ?
                this.darkModeEnabled = false : this.darkModeEnabled = true }
        })
    }

    setAmbientLight()
    {
        this.ambientLight = new THREE.AmbientLight('#fff9f5', 4)
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
        this.directionalLight = new THREE.DirectionalLight('#fff9f5', 4)
        this.directionalLight.position.set(2, 2, 6)
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
}