import * as THREE from 'three'
import Experience from '../Experience.js'
import gsap from 'gsap'

export default class Pages
{
    constructor()
    {
        this.experience = new Experience()
        this.pointer = this.experience.pointer
        this.objects = this.experience.objects
        this.sizes = this.experience.sizes
        this.camera = this.experience.camera

        this.navBar = document.getElementById("nav-bar")
        this.homeButton = document.getElementById("home-button")
        this.aboutDot = document.getElementById("about-dot")
        this.lithoDot = document.getElementById("litho-dot")
        this.dioramaDot = document.getElementById("diorama-dot")

        this.leftArea = document.getElementById("left-area")
        this.rightArea = document.getElementById("right-area")
        this.leftArrow = document.getElementById("left-arrow")
        this.rightArrow = document.getElementById("right-arrow")

        this.text = document.getElementById("text")
        
        this.currentSection = 0
        this.totalSections = 3

        this.startPos = new THREE.Vector3(3, 0, -2.5)
        this.endPos = new THREE.Vector3(-3, 0, -2.5)

        // Home button hover event
        this.homeButton.addEventListener('mouseenter', () => {
            this.aboutDot.classList.add('visible')
            this.lithoDot.classList.add('visible')
            this.dioramaDot.classList.add('visible')
        })
        this.navBar.addEventListener('mouseleave', () => {
            this.aboutDot.classList.remove('visible')
            this.lithoDot.classList.remove('visible')
            this.dioramaDot.classList.remove('visible')
        })

        // Arrow area enter + exit events
        this.leftArea.addEventListener('mouseenter', () => { this.leftArrow.classList.add('visible') })
        this.rightArea.addEventListener('mouseenter', () => { this.rightArrow.classList.add('visible') })
        this.leftArea.addEventListener('mouseleave', () => { this.leftArrow.classList.remove('visible') })
        this.rightArea.addEventListener('mouseleave', () => { this.rightArrow.classList.remove('visible') })

        // Page dot click events
        this.homeButton.addEventListener('click', () => { if(this.currentSection != 0) this.changeSection(0) })
        this.aboutDot.addEventListener('click', () => { if(this.currentSection != 1) this.changeSection(1) })
        this.lithoDot.addEventListener('click', () => { if(this.currentSection != 2) this.changeSection(2) })
        this.dioramaDot.addEventListener('click', () => { if(this.currentSection != 3) this.changeSection(3) })

        // Area click events
        this.leftArea.addEventListener('click', () => { if(this.currentSection > 0) this.changeSection(this.currentSection -1) })
        this.rightArea.addEventListener('click', () => { if(this.currentSection < this.totalSections) this.changeSection(this.currentSection + 1) })

        // Arrow key down event
        window.addEventListener('keydown', (event) =>
        {
            if(event.keyCode == '37')
            {
                if(this.currentSection > 0) this.changeSection(this.currentSection -1)
                // else if(!this.isAnimating) this.EndSection(0.1)
            }
            else if(event.keyCode == '39')
            {
                if(this.currentSection < this.totalSections) this.changeSection(this.currentSection + 1)
                // else if(!this.isAnimating) this.EndSection(-4 * this.totalSections - 0.1)
            }
        })
    }

    changeSection(int)
    {
        this.closeCurrentSection()
        this.currentSection = int
        this.objects.currentObject = this.currentSection
        clearTimeout(this.timeout)
        this.openCurrentSection()
        this.moveObjects()
    }

    moveObjects()
    {
        // gsap.to(this.objects.group.position, { x: -this.currentSection * 2, duration: 1, ease: "power2.out"})
    }

    closeCurrentSection()
    {
        switch(this.currentSection)
        {
            case 0: //HELLO
            gsap.to(this.objects.helloMat.map.offset, { x: this.objects.helloMat.map.offset.x > 0.34 ?
                (this.objects.helloMat.map.offset.x > 0.67 ? 1 : 0.67) : 0.34, duration: 0.8, ease: "power2.out",
                callbackScope: this, onComplete: function() { this.objects.group.children[0].visible = false } })
            break
            case 1: //PROFILE
                gsap.to(this.objects.profileMat.uniforms.uCircleScale, { value: 0.0, duration: 0.3, ease: "power2.out", delay: 0.15 })
                setTimeout(() => { this.objects.profileMat.uniforms.uShowTop.value = 0.0 }, 150)
                gsap.to(this.objects.profileMat.uniforms.uMapOffset.value, { y: 0.15, duration: 0.4, ease: "power2.out" })
                this.text.classList.remove('visible')
                this.aboutDot.children[0].style.opacity = 0.2
            break
            case 2: // LITHO
                gsap.to(this.objects.group.children[2].children[0].scale, { x: 0.0, y: 0.0, z: 0.0, duration: 0.3, ease: "power2.out", delay: 0 })
                this.objects.group.children[2].children[0].rotation.set(0, 0, 0)
                this.text.classList.remove('visible')
                this.lithoDot.children[0].style.opacity = 0.2
            break
            case 3: // CONTACT
                this.dioramaDot.children[0].style.opacity = 0.2
                this.text.classList.remove('visible')
            break
        }
    }

    openCurrentSection()
    {
        switch(this.currentSection)
        {
            case 0: //HELLO
                this.objects.group.children[0].visible = true
            break
            case 1: //PROFILE
                this.objects.group.children[1].visible = true
                gsap.to(this.objects.profileMat.uniforms.uCircleScale, { value: 0.35, duration: 0.8, ease: "power2.out", delay: 0.6 })
                setTimeout(() => { this.objects.profileMat.uniforms.uShowTop.value = 1.0 }, 1100)
                gsap.to(this.objects.profileMat.uniforms.uMapOffset.value, { y: 0.08, duration: 1.5, ease: "power1.inOut", delay: 1 })
                this.aboutDot.children[0].style.opacity = 1
                this.timeout = setTimeout(() => {
                    this.text.children[0].children[0].innerHTML = "Hi, I'm Ben"
                    this.text.children[0].children[1].innerHTML = "I'm a Product Designer living in London"
                    this.text.children[0].children[2].innerHTML = "I love crafting beautiful products and interactive experiences with code"
                    this.text.classList.add('visible') }, 1100)
            break
            case 2: // LITHO
                this.objects.group.children[2].visible = true
                gsap.to(this.objects.group.children[2].children[0].scale, { x: 0.5, y: 0.5, z: 0.5, duration: 1, ease: "power2.out", delay: 0.5 })
                gsap.to(this.objects.group.children[2].children[0].rotation, { y: Math.PI * 6, duration: 1, ease: "power2.out", delay: 0.5 })
                this.lithoDot.children[0].style.opacity = 1
                this.timeout = setTimeout(() => {
                    this.text.children[0].children[0].innerHTML = "Litho"
                    this.text.children[0].children[1].innerHTML = "I've been working for Litho, an AR startup"
                    this.text.children[0].children[2].innerHTML = "We built a wearable controller for the real world"
                    this.text.classList.add('visible')
                }, 1100)
            break
            case 3: //CONTACT
                // this.objects.group.children[3].visible = true
                // gsap.to(this.objects.contactMat.uniforms.uCircleScale, { value: 0.35, duration: 0.8, ease: "power2.out", delay: 0.6 })
                this.dioramaDot.children[0].style.opacity = 1
        }
    }
}