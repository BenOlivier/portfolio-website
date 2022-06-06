import * as THREE from 'three'
import gsap from 'gsap'
import Experience from '../Experience.js'

export default class DarkMode
{
    constructor()
    {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.camera = this.experience.camera
        this.environment = this.experience.environment
        this.raycaster = new THREE.Raycaster()

        this.darkModeEnabled = false
        this.leftArrow = document.getElementById("left-arrow")
        this.rightArrow = document.getElementById("right-arrow")
        this.darkModeButton = document.getElementById("dark-mode-button")
        this.homeButton = document.getElementById("home-button")
        this.navContainer = document.getElementById("nav-container")
        this.darkModeButton.addEventListener('click', () =>
        {
            this.toggleDarkMode()
        })
    }

    toggleDarkMode()
    {
        // Update circle centre
        this.buttonPos = new THREE.Vector2((this.darkModeButton.getBoundingClientRect().x
            + this.darkModeButton.getBoundingClientRect().width / 2) / this.sizes.width * 2 - 1,
            -((this.darkModeButton.getBoundingClientRect().y
            + this.darkModeButton.getBoundingClientRect().height / 2) / this.sizes.height * 2 - 1))
        this.raycaster.setFromCamera(this.buttonPos, this.camera.camera)
        this.intersects = this.raycaster.intersectObjects([this.environment.background])
        this.environment.background.material.uniforms.uMaskCentre.value = this.intersects[0].uv

        // Set values
        if(this.darkModeEnabled)
        {
            this.environment.background.material.uniforms.uCurrentBgColor.value.set(this.environment.colors.uBgDark)
            this.environment.background.material.uniforms.uNewBgColor.value.set(this.environment.colors.uBgLight)
            this.environment.background.material.uniforms.uCurrentFlColor.value.set(this.environment.colors.uFlDark)
            this.environment.background.material.uniforms.uNewFlColor.value.set(this.environment.colors.uFlLight)
            this.darkModeButton.src = "images/icons/darkmode.png"
            this.homeButton.src = "images/icons/icondark.png"
            this.darkModeAnimation()
        }
        else
        {
            this.environment.background.material.uniforms.uCurrentBgColor.value.set(this.environment.colors.uBgLight)
            this.environment.background.material.uniforms.uNewBgColor.value.set(this.environment.colors.uBgDark)
            this.environment.background.material.uniforms.uCurrentFlColor.value.set(this.environment.colors.uFlLight)
            this.environment.background.material.uniforms.uNewFlColor.value.set(this.environment.colors.uFlDark)
            this.darkModeButton.src = "images/icons/lightmode.png"
            this.homeButton.src = "images/icons/iconlight.png"
            this.darkModeAnimation()
        }
    }

    darkModeAnimation()
    {
        // Reset
        gsap.killTweensOf(this.environment.background.material.uniforms.uMaskRadius)
        this.environment.background.material.uniforms.uMaskRadius.value = 0

        // Expand circle radius
        gsap.to(this.environment.background.material.uniforms.uMaskRadius, {
            duration: 1,
            ease: "power3.in",
            value: 2,
            callbackScope: this,
            onComplete: function(){ 
                this.darkModeEnabled ? this.darkModeEnabled = false : this.darkModeEnabled = true
                this.darkModeEnabled ? document.body.style.background = this.environment.colors.uBgLight :
                    document.body.style.background = this.environment.colors.uBgDark
            }
        })

        if(this.darkModeEnabled)
        {
            this.scene.fog.color.set('#e5e5e5')
            this.leftArrow.style.backgroundColor = '#ffffff50'
            this.rightArrow.style.backgroundColor = '#ffffff50'

            this.leftArrow.children[0].src = "images/icons/arrowdark.png"
            this.rightArrow.children[0].src = "images/icons/arrowdark.png"
            
            gsap.to(document.body, {
                color: "#333333",
                duration: 0.7,
                ease: "power3.in"
            })
        }
        else
        {
            this.scene.fog.color.set('#1e1e20')
            this.leftArrow.style.backgroundColor = '#44444450'
            this.rightArrow.style.backgroundColor = '#44444450'

            this.leftArrow.children[0].src = "images/icons/arrowlight.png"
            this.rightArrow.children[0].src = "images/icons/arrowlight.png"
            
            gsap.to(document.body, {
                color: "#ffffff",
                duration: 0.7,
                ease: "power3.in"
            })
        }
    }
}