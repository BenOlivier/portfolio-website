import * as THREE from 'three'
import Experience from '../Experience.js'
import gsap from 'gsap'

export default class Scroll
{
    constructor()
    {
        this.experience = new Experience()
        this.pointer = this.experience.pointer
        this.objects = this.experience.objects
        this.sizes = this.experience.sizes
        this.camera = this.experience.camera

        this.leftArea = document.getElementById("left-area")
        this.rightArea = document.getElementById("right-area")
        this.leftArrow = document.getElementById("left-arrow")
        this.rightArrow = document.getElementById("right-arrow")

        this.text = document.getElementById("text")
        
        this.currentSection = 0
        this.totalSections = 3

        this.startPos = new THREE.Vector3(3, 0, -2.5)
        this.endPos = new THREE.Vector3(-3, 0, -2.5)

        // Arrow area enter + exit events
        this.leftArea.addEventListener('mouseenter', () => { this.leftArrow.classList.add('visible') })
        this.rightArea.addEventListener('mouseenter', () => { this.rightArrow.classList.add('visible') })
        this.leftArea.addEventListener('mouseleave', () => { this.leftArrow.classList.remove('visible') })
        this.rightArea.addEventListener('mouseleave', () => { this.rightArrow.classList.remove('visible') })

        // Area click events
        this.leftArea.addEventListener('click', () =>
        {
            if(this.currentSection > 0) this.ChangeSection(-1)
        })
        this.rightArea.addEventListener('click', () =>
        {
            if(this.currentSection < this.totalSections) this.ChangeSection(1)
        })

        // Arrow key down event
        window.addEventListener('keydown', (event) =>
        {
            if(event.keyCode == '37')
            {
                if(this.currentSection > 0) this.ChangeSection(-1)
                // else if(!this.isAnimating) this.EndSection(0.1)
            }
            else if(event.keyCode == '39')
            {
                if(this.currentSection < this.totalSections) this.ChangeSection(1)
                // else if(!this.isAnimating) this.EndSection(-4 * this.totalSections - 0.1)
            }
        })
    }

    ChangeSection(int)
    {
        this.currentSection += int
        this.objects.currentObject = this.currentSection
        clearTimeout(this.timeout)
        this.Timeline()
    }

    Timeline()
    {
        switch(this.currentSection)
        {
            case 0: //HELLO
                // Hello
                this.objects.group.children[0].visible = true
                // Profile
                gsap.to(this.objects.profileMat.uniforms.uCircleScale, { value: 0.0, duration: 0.3, ease: "power2.out", delay: 0.15 })
                setTimeout(() => { this.objects.profileMat.uniforms.uShowTop.value = 0.0 }, 150)
                gsap.to(this.objects.profileMat.uniforms.uMapOffset.value, { y: 0.15, duration: 0.4, ease: "power2.out",
                callbackScope: this, onComplete: function() { this.objects.group.children[1].visible = false }
                })
                // Text
                this.text.classList.remove('visible')
            break
            case 1: //PROFILE
                // Hello
                gsap.to(this.objects.helloMat.map.offset, { x: this.objects.helloMat.map.offset.x > 0.34 ?
                        (this.objects.helloMat.map.offset.x > 0.67 ? 1 : 0.67) : 0.34, duration: 0.8, ease: "power2.out",
                    callbackScope: this,onComplete: function() { this.objects.group.children[0].visible = false } })
                // Profile
                this.objects.group.children[1].visible = true
                gsap.to(this.objects.profileMat.uniforms.uCircleScale, { value: 0.35, duration: 0.8, ease: "power2.out", delay: 0.6 })
                setTimeout(() => { this.objects.profileMat.uniforms.uShowTop.value = 1.0 }, 1100)
                gsap.to(this.objects.profileMat.uniforms.uMapOffset.value, { y: 0.08, duration: 1.5, ease: "power1.inOut", delay: 1 })
                // Litho
                gsap.to(this.objects.group.children[2].children[0].scale, { x: 0.0, y: 0.0, z: 0.0, duration: 0.3, ease: "power2.out", delay: 0 })
                // Text
                this.text.classList.remove('visible')
                setTimeout(() => {
                    this.text.children[0].children[0].innerHTML = "Hi, I'm Ben"
                    this.text.children[0].children[1].innerHTML = "I'm a Product Designer living in London"
                    this.text.children[0].children[2].innerHTML = "I love crafting beautiful products and interfaces with code"
                    this.text.classList.add('visible') }, 1100)
            break
            case 2: // LITHO
                // Profile
                gsap.to(this.objects.profileMat.uniforms.uCircleScale, { value: 0.0, duration: 0.3, ease: "power2.out", delay: 0.15 })
                // Litho
                this.objects.group.children[2].visible = true
                gsap.to(this.objects.group.children[2].children[0].scale, { x: 0.5, y: 0.5, z: 0.5, duration: 1, ease: "power2.out", delay: 0.5 })
                setTimeout(() => { this.objects.profileMat.uniforms.uShowTop.value = 0.0 }, 150)
                gsap.to(this.objects.profileMat.uniforms.uMapOffset.value, { y: 0.15, duration: 0.4, ease: "power2.out",
                    callbackScope: this, onComplete: function() { this.objects.group.children[0].visible = false } })
                // Text
                this.text.classList.remove('visible')
                setTimeout(() => {
                    this.text.children[0].children[0].innerHTML = "Litho"
                    this.text.children[0].children[1].innerHTML = "I've been working for Litho, an AR startup"
                    this.text.children[0].children[2].innerHTML = "We built a wearable controller for the real world"
                    this.text.classList.add('visible')
                }, 1100)
            break
        }
    }
}