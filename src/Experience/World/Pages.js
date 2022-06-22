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
        this.UI = this.experience.UI
        
        this.currentSection = 0
        this.totalSections = 3

        // Area and home button click events
        this.UI.homeButton.addEventListener('click', () => { if(this.currentSection != 0) this.changeSection(0) })
        this.UI.leftArea.addEventListener('click', () => { if(this.currentSection > 0) this.changeSection(this.currentSection -1) })
        this.UI.rightArea.addEventListener('click', () => { if(this.currentSection < this.totalSections) this.changeSection(this.currentSection + 1) })

        // Arrow key down event
        window.addEventListener('keydown', (event) =>
        {
            if(event.keyCode == '37') { if(this.currentSection > 0) this.changeSection(this.currentSection -1) }
            else if(event.keyCode == '39') { if(this.currentSection < this.totalSections) this.changeSection(this.currentSection + 1) }
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
            case 1: //ABOUT
                gsap.to(this.objects.profileMat.uniforms.uCircleScale, { value: 0.0, duration: 0.3, ease: "power2.out", delay: 0.15 })
                setTimeout(() => { this.objects.profileMat.uniforms.uShowTop.value = 0.0 }, 150)
                gsap.to(this.objects.profileMat.uniforms.uMapOffset.value, { y: 0.15, duration: 0.4, ease: "power2.out" })
                this.toggleText(this.UI.aboutText)
            break
            case 2: // LITHO
                gsap.to(this.objects.group.children[2].children[0].scale, { x: 0.0, y: 0.0, z: 0.0, duration: 0.3, ease: "power2.out", delay: 0 })
                this.objects.group.children[2].children[0].rotation.set(0, 0, 0)
                this.UI.pointsVisible = false
                this.toggleText(this.UI.lithoText)
            break
            case 3: // DIORAMA
                this.toggleText(this.UI.dioramaText)
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
                this.toggleText(this.UI.aboutText)
            break
            case 2: // LITHO
                this.objects.group.children[2].visible = true
                gsap.to(this.objects.group.children[2].children[0].scale, { x: 0.5, y: 0.5, z: 0.5, duration: 1, ease: "power2.out", delay: 0.5 })
                gsap.to(this.objects.group.children[2].children[0].rotation, { y: Math.PI * 4, duration: 1, ease: "power2.out", delay: 0.5 })
                setTimeout(() => { this.UI.pointsVisible = true }, 1500)
                this.toggleText(this.UI.lithoText)
            break
            case 3: //CONTACT
                this.toggleText(this.UI.dioramaText)
            break
        }
    }

    toggleText(text)
    {
        if(text.classList.contains('displayed'))
        {
            text.classList.remove('visible')
            setTimeout(() => { text.classList.remove('displayed') }, 300)

            // text.addEventListener('transitioned', () => //TODO:
            // {
            //     text.classList.remove('displayed')
            // })
        }
        else
        {
            setTimeout(() => { text.classList.add('displayed') }, 300)
            setTimeout(() => { text.classList.add('visible') }, 800)
        }
    }
}