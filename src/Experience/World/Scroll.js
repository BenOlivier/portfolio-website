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
        this.isAnimating = false

        this.startPos = new THREE.Vector3(3, 0, -2.5)
        this.endPos = new THREE.Vector3(-3, 0, -2.5)
        this.screenVec = new THREE.Vector3()
        this.objectPos = new THREE.Vector3()
        this.SetObjectPos()

        this.sizes.on('resize', () =>
        {
            this.SetObjectPos()
            if(this.currentSection > 0)
            {
                this.AnimateObject(this.objects.group.children[this.currentSection], this.objectPos)
            }
        })

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

    SetObjectPos()
    {
        if(this.sizes.width > 800)
        {
            // Right side screen pos (0-1)
            this.screenX = this.sizes.width > 1400?
            350 / ((this.sizes.width - 1400) / 2 + 700) : 0.5
            // Vector projected from screen pos
            this.screenVec.set(this.screenX, 0, 0)
                .unproject(this.camera.camera).sub(this.camera.camera.position).normalize()
            // Object position projected along vector
            this.objectPos.copy(this.camera.camera.position).add(this.screenVec.multiplyScalar(2))
        }
        else
        {
            // Vector projected from screen pos
            this.screenVec.set(0, 0.3, 0)
                .unproject(this.camera.camera).sub(this.camera.camera.position).normalize()
            // Object position projected along vector
            this.objectPos.copy(this.camera.camera.position).add(this.screenVec.multiplyScalar(2))
        }
    }

    ChangeSection(int)
    {
        this.currentSection += int
        this.objects.currentObject = this.currentSection
        this.Timeline()
    }

    // this.AnimateObject(this.objects.group.children[this.currentSection], this.objectPos)
    // this.AnimateObject(this.objects.group.children[this.currentSection + 1], this.startPos)

    Timeline()
    {
        switch(this.currentSection)
        {
            case 0: // HELLO
                clearTimeout(this.timeout)
                this.text.classList.remove('visible')
                // Reset profile
                gsap.to(this.objects.profileMat.uniforms.uCircleScale, {
                    value: 0.0,
                    duration: 0.2,
                    ease: "power2.out",
                    delay: 0.15
                })
                setTimeout(() => {
                    this.objects.profileMat.uniforms.uShowTop.value = 0.0
                }, 150)
                gsap.to(this.objects.profileMat.uniforms.uMapOffset.value, {
                    y: 0.0,
                    duration: 0.4,
                    ease: "power2.out"
                })
            break
            case 1: // PROFILE
                clearTimeout(this.timeout)
                // Close hello
                gsap.to(this.objects.helloMat.map.offset, {
                    x: this.objects.helloMat.map.offset.x > 0.35 ?
                        (this.objects.helloMat.map.offset.x > 0.67 ? 1 : 0.67) : 0.35,
                    duration: 0.8,
                    ease: "power2.out"
                })
                this.objects.group.children[1].position.set(this.objectPos.x, this.objectPos.y, this.objectPos.z)
                this.timeout = setTimeout(() => { this.text.classList.add('visible') }, 500)
                // Expand profile circle
                gsap.to(this.objects.profileMat.uniforms.uCircleScale, {
                    value: 0.35,
                    duration: 0.5,
                    ease: "power2.out",
                    delay: 0.8
                })
                // Pop up profile image
                setTimeout(() => {
                    this.objects.profileMat.uniforms.uShowTop.value = 1.0
                }, 1100)
                gsap.to(this.objects.profileMat.uniforms.uMapOffset.value, {
                    y: -0.1,
                    duration: 1.8,
                    ease: "power3.out",
                    delay: 1.1
                })
            break
            case 2:
                // Reset profile
                gsap.to(this.objects.profileMat.uniforms.uCircleScale, {
                    value: 0.0,
                    duration: 0.2,
                    ease: "power2.out",
                    delay: 0.15
                })
                setTimeout(() => {
                    this.objects.profileMat.uniforms.uShowTop.value = 0.0
                }, 150)
                gsap.to(this.objects.profileMat.uniforms.uMapOffset.value, {
                    y: 0.0,
                    duration: 0.4,
                    ease: "power2.out"
                })
            break
        }
    }

    AnimateObject(object, position)
    {
        this.isAnimating = true
        gsap.killTweensOf(object.position)
        gsap.to(object.position, {
            x: position.x,
            y: position.y,
            z: position.z,
            duration: 1,
            ease: "power2.out",
            callbackScope: this,
            onComplete: function() { this.isAnimating = false }
        })
    }

    // EndSection(int)
    // {
    //     this.isAnimating = true
    //     gsap.killTweensOf(this.objects.group.position)
    //     gsap.to(this.objects.group.position, {
    //         x: int,
    //         duration: 0.2,
    //         ease: "power1.out",
    //         yoyo: true,
    //         repeat: 1,
    //         callbackScope: this,
    //         onComplete: function()
    //         {
    //             this.isAnimating = false
    //         }
    //     })
    //     this.text.classList.remove('visible')
    // }
}