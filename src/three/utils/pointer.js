import * as THREE from 'three'
import EventEmitter from './event-emitter.js'

export default class Pointer extends EventEmitter
{
    constructor()
    {
        super()

        // Setup
        this.pointerPos = new THREE.Vector2()
        this.experience = window.experience
        this.sizes = this.experience.sizes
        this.leftArrow = document.getElementById("left-arrow")

        // Pointer move event
        window.addEventListener('mousemove', (event) =>
        {
            this.pointerPos.x = event.clientX / this.sizes.width * 2 - 1
            this.pointerPos.y = -(event.clientY / this.sizes.height) * 2 + 1
            this.trigger('mousemove')
        })

        // Pointer down event
        window.addEventListener('mousedown', (event) =>
        {
            this.pointerPos.x = event.clientX / this.sizes.width * 2 - 1
            this.pointerPos.y = -(event.clientY / this.sizes.height) * 2 + 1
            this.trigger('mousedown')
        })

        // Pointer up event
        window.addEventListener('mouseup', (event) =>
        {
            this.trigger('mouseup')
        })
    }
}