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

        this.currentSection = 0
        this.totalSections = 1

        this.isAnimating = false
        
        // Mouse down event
        window.addEventListener('mousedown', (event) =>
        {
            if(this.pointer.pointerPos.x > 0) //TODO: && not on nav buttons
            {
                if(this.currentSection < this.totalSections) this.ChangeSection(1)
                else if(!this.isAnimating) this.EndSection(-4 * this.totalSections - 0.1)
            }
            else
            {
                if(this.currentSection > 0) this.ChangeSection(-1)
                else if(!this.isAnimating) this.EndSection(0.1)
            }
        })

        // Arrow key down event
        window.addEventListener('keydown', (event) =>
        {
            if(event.keyCode == '39')
            {
                if(this.currentSection < this.totalSections) this.ChangeSection(1)
                else if(!this.isAnimating) this.EndSection(-4 * this.totalSections - 0.1)
            }
            else if(event.keyCode == '37')
            {
                if(this.currentSection > 0) this.ChangeSection(-1)
                else if(!this.isAnimating) this.EndSection(0.1)
            }
        })
    }

    ChangeSection(int)
    {
        this.isAnimating = true
        this.currentSection += int
        gsap.to(this.objects.group.position, {
            x: -4 * this.currentSection,
            duration: 1.5,
            ease: "elastic.out(0.25, 0.3)",
            callbackScope: this,
            onComplete: function()
            {
                this.isAnimating = false
            }
        })
    }

    EndSection(int)
    {
        this.isAnimating = true
        gsap.to(this.objects.group.position, {
            x: int,
            duration: 0.2,
            ease: "power1.out",
            yoyo: true,
            repeat: 1,
            callbackScope: this,
            onComplete: function()
            {
                this.isAnimating = false
            }
        })
    }
}