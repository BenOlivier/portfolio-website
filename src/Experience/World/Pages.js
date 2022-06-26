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

        // Area click events
        this.UI.leftArea.addEventListener('click', () => { if(this.currentSection > 0) this.changeSection(this.currentSection -1) })
        this.UI.rightArea.addEventListener('click', () => { if(this.currentSection < this.totalSections) this.changeSection(this.currentSection + 1) })

        // Page dot click events
        this.UI.aboutDot.addEventListener('click', () => { if(this.currentSection != 1) this.changeSection(1) })
        this.UI.lithoDot.addEventListener('click', () => { if(this.currentSection != 2) this.changeSection(2) })
        this.UI.dioramaDot.addEventListener('click', () => { if(this.currentSection != 3) this.changeSection(3) })

        // Arrow key down event
        window.addEventListener('keydown', (event) =>
        {
            if(event.keyCode == '37') { if(this.currentSection > 0) this.changeSection(this.currentSection -1) }
            else if(event.keyCode == '39') { if(this.currentSection < this.totalSections) this.changeSection(this.currentSection + 1) }
        })

        // Video link clicks
        this.UI.lithoVideoLink.addEventListener('click', () => { this.openVideo(this.UI.lithoVideo) })
        this.UI.videosContainer.addEventListener('click', () => { this.closeVideo(this.UI.lithoVideo) })
    }

    openVideo(video)
    {
        this.closeCurrentSection()
        this.UI.videosContainer.style.display = 'flex'
        setTimeout(() => { video.classList.add('visible') }, 10)
    }
    closeVideo(video)
    {
        this.openCurrentSection()
        const iframeSrc = video.src
        video.src = iframeSrc
        video.classList.remove('visible')
        setTimeout(() => { this.UI.videosContainer.style.display = 'none' }, 500)
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
            case 0: // HELLO
                gsap.to(this.objects.helloMat.map.offset, { x: this.objects.helloMat.map.offset.x > 0.34 ?
                (this.objects.helloMat.map.offset.x > 0.67 ? 1 : 0.67) : 0.34, duration: 0.8, ease: "power2.out",
                callbackScope: this, onComplete: function() { this.objects.group.children[0].visible = false } })
            break
            case 1: // ABOUT
                gsap.killTweensOf([this.objects.aboutMat.uniforms.uCircleScale, this.objects.aboutMat.uniforms.uMapOffset.value])
                gsap.to(this.objects.aboutMat.uniforms.uCircleScale, { value: 0.0, duration: 0.3, ease: "power2.out", delay: 0.15,
                    callbackScope: this, onStart: function(){ this.objects.aboutMat.uniforms.uShowTop.value = 0.0 }})
                gsap.to(this.objects.aboutMat.uniforms.uMapOffset.value, { y: 0.15, duration: 0.4, ease: "power2.out" })
                this.UI.aboutDot.classList.remove('current-page')
                this.showText(this.UI.aboutText, false)
            break
            case 2: // LITHO
                gsap.killTweensOf(this.objects.group.children[2].children[0].scale)
                gsap.to(this.objects.group.children[2].children[0].scale, { x: 0.0, y: 0.0, z: 0.0, duration: 0.3, ease: "power2.out", delay: 0 })
                this.objects.group.children[2].children[0].rotation.set(0, 0, 0)
                this.UI.pointsVisible = false
                this.UI.lithoDot.classList.remove('current-page')
                this.showText(this.UI.lithoText, false)
            break
            case 3: // DIORAMA
                for(let i = 0; i < 9; i++){
                    gsap.to(this.objects.group.children[3].children[i].position, { z: -1, duration: 0.5, ease: "power1.out", delay: i * 0.05 })}
                // this.objects.group.children[3].visible = false //TODO: on complete
                this.UI.dioramaDot.classList.remove('current-page')
                this.showText(this.UI.dioramaText, false)
            break
        }
    }

    openCurrentSection()
    {
        switch(this.currentSection)
        {
            case 0: // HELLO
                gsap.killTweensOf(this.objects.helloMat.map.offset)
                this.objects.group.children[0].visible = true
            break
            case 1: // ABOUT
                this.objects.group.children[1].visible = true
                gsap.to(this.objects.aboutMat.uniforms.uCircleScale, { value: 0.35, duration: 0.8, ease: "expo.out", delay: 0.6, 
                    callbackScope: this, onStart: function(){ this.objects.aboutMat.uniforms.uShowTop.value = 1.0 }})
                gsap.to(this.objects.aboutMat.uniforms.uMapOffset.value, { y: 0.08, duration: 1, ease: "power1.inOut", delay: 0.8 })
                this.UI.aboutDot.classList.add('current-page')
                this.showText(this.UI.aboutText, true)
            break
            case 2: // LITHO
                this.objects.group.children[2].visible = true
                gsap.killTweensOf(this.objects.group.children[2].children[0].scale)
                gsap.to(this.objects.group.children[2].children[0].scale, { x: 0.5, y: 0.5, z: 0.5, duration: 1, ease: "power2.out", delay: 0.5,
                    callbackScope: this, onComplete: function() { this.UI.pointsVisible = true }})
                gsap.to(this.objects.group.children[2].children[0].rotation, { y: Math.PI * 4, duration: 1, ease: "power2.out", delay: 0.5 })
                this.UI.lithoDot.classList.add('current-page')
                this.showText(this.UI.lithoText, true)
            break
            case 3: // DIORAMA
                this.objects.group.children[3].visible = true
                for(let i = 0; i < 9; i++){
                    gsap.to(this.objects.group.children[3].children[i].position, { z: 0, duration: 0.5, ease: "power1.out", delay: i * 0.05 })
                    // gsap.to(this.objects.group.children[3].children[i].material.opacity, { value: 1, duration: 0.4, ease: "power1.out", delay: i * 0.05 })
                }
            
                this.UI.dioramaDot.classList.add('current-page')    
                this.showText(this.UI.dioramaText, true)
            break
        }
    }

    showText(text, bool)
    {
        if(bool) // If should show
        {
            setTimeout(() => { text.classList.add('displayed') }, 300) // Display after .3s
            setTimeout(() => { text.classList.add('visible') }, 310) // Fade in after .3s
        }
        else
        {
            text.classList.remove('visible') // Fade out immeditately
            setTimeout(() => { text.classList.remove('displayed') }, 300) // Hide after .3s
        }
    }
}