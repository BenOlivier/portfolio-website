import * as THREE from 'three'
import EventEmitter from './EventEmitter.js'
import Experience from '../Experience.js'

export default class Mouse extends EventEmitter
{
    constructor()
    {
        super()

        // Setup
        this.mouse = new THREE.Vector2()
        this.experience = new Experience()
        this.sizes = this.experience.sizes

        // Mouse move event
        window.addEventListener('mousemove', (event) =>
        {
            this.mouse.x = event.clientX / this.sizes.width * 2 - 1
            this.mouse.y = - (event.clientY / this.sizes.height) * 2 + 1

            this.trigger('mousemove')

            console.log('Mouse moved')
        })
    }
}