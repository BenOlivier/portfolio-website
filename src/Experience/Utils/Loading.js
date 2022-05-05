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
        this.model = this.experience.object.model
        gsap.to(this.model.position, {
            duration: 1,
            ease: "elastic.out(1, 1.2)",
            x: 0,
            y: 0,
            z: 0
        })

        // Fade in floor
        this.floor = this.experience.environment.floor
        gsap.to(this.floor.material.uniforms.uAlpha, {
            duration: 1,
            ease: "sine.inOut",
            value: 0.6
        })
    }
}