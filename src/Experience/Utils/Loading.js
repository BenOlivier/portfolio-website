import * as THREE from 'three'
import Experience from '../Experience.js'
import gsap from 'gsap'

export default class Loading
{
    constructor()
    {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.time = this.experience.time
        this.scene = this.experience.scene
    }

    initiateLoadedSequence()
    {
        // Animate in hello
        this.model = this.experience.objects.model
        gsap.to(this.model.position, {
            duration: 1,
            ease: "elastic.out(1, 1.2)",
            x: 0,
            y: 0,
            z: 0
        })
    }
}