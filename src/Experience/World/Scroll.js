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
        
        // Pointer down event
        window.addEventListener('mousedown', (event) =>
        {
            if(this.pointer.pointerPos.x > 0) //TODO: && not on nav buttons
            {
                if(this.currentSection < 4)
                this.NextSection()
            }
            else
            {
                if(this.currentSection > 0)
                this.PrevSection()
            }
        })
    }

    NextSection()
    {
        this.currentSection ++
        
        gsap.to(this.objects.group.position, {
            x: -5 * this.currentSection,
            duration: 1,
            ease: "elastic.out(0.3, 0.3)"
        })
    }

    PrevSection()
    {
        this.currentSection --
        
        gsap.to(this.objects.group.position, {
            x: -5 * this.currentSection,
            duration: 1,
            ease: "elastic.out(0.3, 0.3)"
        })
    }
}