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
            case 0: /////////////////////////////////////////////////////// HELLO
                // Hello
                this.objects.group.children[0].visible = true
                // Profile
                gsap.to(this.objects.profileMat.uniforms.uCircleScale, {
                    value: 0.0,
                    duration: 0.3,
                    ease: "power2.out",
                    delay: 0.15
                })
                setTimeout(() => {
                    this.objects.profileMat.uniforms.uShowTop.value = 0.0
                }, 150)
                gsap.to(this.objects.profileMat.uniforms.uMapOffset.value, {
                    y: 0.0,
                    duration: 0.4,
                    ease: "power2.out",
                    callbackScope: this,
                    onComplete: function() { this.objects.group.children[1].visible = false }
                })
                // Text
                this.text.classList.remove('visible')
            break
            case 1: /////////////////////////////////////////////////////// PROFILE
                // Profile
                this.objects.group.children[1].visible = true
                gsap.to(this.objects.profileMat.uniforms.uCircleScale, {
                    value: 0.35,
                    duration: 0.5,
                    ease: "power2.out",
                    delay: 0.6
                })
                setTimeout(() => {
                    this.objects.profileMat.uniforms.uShowTop.value = 1.0
                }, 900)
                gsap.to(this.objects.profileMat.uniforms.uMapOffset.value, {
                    y: -0.1,
                    duration: 1.8,
                    ease: "power3.out",
                    delay: 0.9
                })
                // Hello
                gsap.to(this.objects.helloMat.map.offset, {
                    x: this.objects.helloMat.map.offset.x > 0.34 ?
                        (this.objects.helloMat.map.offset.x > 0.67 ? 1 : 0.67) : 0.34,
                    duration: 0.8,
                    ease: "power2.out",
                    callbackScope: this,
                    onComplete: function() { this.objects.group.children[0].visible = false }
                })
                // Text
                this.timeout = setTimeout(() => { this.text.classList.add('visible') }, 700)
            break
            case 2:
                // Litho
                this.objects.group.children[2].visible = true
                // Profile
                gsap.to(this.objects.profileMat.uniforms.uCircleScale, {
                    value: 0.0,
                    duration: 0.3,
                    ease: "power2.out",
                    delay: 0.15
                })
                setTimeout(() => {
                    this.objects.profileMat.uniforms.uShowTop.value = 0.0
                }, 150)
                gsap.to(this.objects.profileMat.uniforms.uMapOffset.value, {
                    y: 0.0,
                    duration: 0.4,
                    ease: "power2.out",
                    callbackScope: this,
                    onComplete: function() { this.objects.group.children[0].visible = false }
                })
            break
        }
    }
}