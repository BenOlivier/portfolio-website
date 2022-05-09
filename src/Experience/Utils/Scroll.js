import * as THREE from 'three'
import { Vector3 } from 'three'
import Experience from '../Experience.js'

export default class Scroll
{
    constructor()
    {
        // Setup
        this.experience = new Experience()
        this.direction = new THREE.Vector3(0, 0.7, -2).normalize()

        this.params = {
            smoothing: 0.5,
            offset: 1
        }

        this.objects = {
            hello: this.experience.objects.hello,
            litho: this.experience.objects.litho
        }

        this.helloTargetPos = this.objects.hello.position
        this.lithoTargetPos = this.objects.litho.position

        // Scroll event
        window.addEventListener('scroll', (event) =>
        {
            this.scroll()
        })
    }

    scroll()
    {
        this.helloTargetPos = this.direction.clone().multiplyScalar(window.scrollY * 0.0005)
        this.lithoTargetPos = this.direction.clone().multiplyScalar(window.scrollY * 0.0005 - 3)
    }

    update()
    {
        this.objects.hello.position.lerp(this.helloTargetPos, this.params.smoothing)
        this.objects.litho.position.lerp(this.lithoTargetPos, this.params.smoothing)
    }
}