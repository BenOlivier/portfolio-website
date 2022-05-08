import * as THREE from 'three'
import { Vector3 } from 'three'
import Experience from '../Experience.js'

export default class Scroll
{
    constructor()
    {
        // Setup
        this.experience = new Experience()
        this.scrollPos = new THREE.Vector3(0, 0, 0)
        this.targetPos = new THREE.Vector3(0, 0, 0)
        this.smoothing = 0.5

        this.params = {
            smoothing: 0.5,
            offset: 1
        }

        this.objects = {
            hello: this.experience.objects.model,
            // litho: this.experience.object.litho
        }

        // Scroll event
        window.addEventListener('scroll', (event) =>
        {
            this.scroll()
        })
    }

    scroll()
    {
        // this.targetPos.x = -window.scrollY * 0.001
        this.targetPos.y = window.scrollY * 0.0005
        this.targetPos.z = -window.scrollY * 0.001
    }

    update()
    {
        this.scrollPos = this.scrollPos.lerp(this.targetPos, this.params.smoothing)

        this.objects.hello.position.set(this.scrollPos.x, this.scrollPos.y -0.4, this.scrollPos.z)
        // this.objects.litho.position.set(this.scrollPos.x, this.scrollPos.y -0.8, this.scrollPos.z + 2)
    }
}