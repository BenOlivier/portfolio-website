import * as THREE from 'three'
import { Vector3 } from 'three'
import Experience from '../Experience.js'

export default class Scroll
{
    constructor()
    {
        // Setup
        this.experience = new Experience()
        this.direction = new THREE.Vector3(0, 1, -2)
        this.smoothing = 0.5

        this.params = {
            smoothing: 0.5,
            offset: 1
        }

        this.objects = {
            hello: this.experience.objects.hello,
            litho: this.experience.objects.litho
        }

        this.helloPos = this.objects.hello.position
        this.lithoPos = this.objects.litho.position
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
        this.helloTargetPos.copy(this.direction).normalize().multiplyScalar(window.scrollY * 0.0004)
        this.lithoTargetPos.copy(this.direction).normalize().multiplyScalar(window.scrollY * 0.0004 - 2)
    }

    update()
    {
        this.helloPos = this.helloPos.lerp(this.helloTargetPos, this.params.smoothing)
        this.lithoPos = this.lithoPos.lerp(this.lithoTargetPos, this.params.smoothing)

        this.objects.hello.position.set(this.helloPos.x, this.helloPos.y, this.helloPos.z)
        this.objects.litho.position.set(this.lithoPos.x, this.lithoPos.y, this.lithoPos.z)
    }
}