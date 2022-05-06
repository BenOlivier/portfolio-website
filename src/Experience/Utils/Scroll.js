import * as THREE from 'three'
import { MathUtils } from 'three'
import Experience from '../Experience.js'

export default class Scroll
{
    constructor()
    {
        // Setup
        this.experience = new Experience()
        this.model = this.experience.object.model
        this.scrollPos = 0
        this.targetPos = 0
        this.smoothing = 0.5

        // Scroll event
        window.addEventListener('scroll', (event) =>
        {
            this.scroll()
            // console.log(window.scrollY)
        })
    }

    scroll()
    {
        this.targetPos = -window.scrollY * 0.001
    }

    update()
    {
        this.scrollPos = MathUtils.lerp(this.scrollPos, this.targetPos, this.smoothing)
        this.model.position.x = this.scrollPos
    }
}