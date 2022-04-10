import * as THREE from 'three'
import EventEmitter from './EventEmitter.js'
import Experience from '../Experience.js'

export default class Pointer extends EventEmitter
{
    constructor()
    {
        super()

        // Setup
        this.targetPos = new THREE.Vector2()
        this.pointerPos = new THREE.Vector2()
        this.experience = new Experience()
        this.time = this.experience.time
        this.sizes = this.experience.sizes
        this.debug = this.experience.debug
        this.shouldUpdate = false
        this.timer = 0

        // Parameters
        this.params = {
            pointerSmoothing: 0.4
        }

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('pointer')
            this.debugFolder.add(this.params, 'pointerSmoothing').name('pointerSmoothing')
                .min(0).max(1).step(0.001)
        }

        // Time tick event
        this.time.on('tick', () => { this.updatePointerPosition() })

        // Pointer down event
        window.addEventListener('pointerdown', (event) =>
        {
            this.targetPos.x = event.clientX / this.sizes.width * 2 - 1
            this.targetPos.y = -(event.clientY / this.sizes.height) * 2 + 1
        })

        // Pointer move event
        window.addEventListener('pointermove', (event) =>
        {
            this.targetPos.x = event.clientX / this.sizes.width * 2 - 1
            this.targetPos.y = -(event.clientY / this.sizes.height) * 2 + 1
        })
    }

    // Update pointer position
    updatePointerPosition()
    {
        this.pointerPos.x = THREE.MathUtils.lerp(this.pointerPos.x, this.targetPos.x, this.params.pointerSmoothing)
        this.pointerPos.y = THREE.MathUtils.lerp(this.pointerPos.y, this.targetPos.y, this.params.pointerSmoothing)
    }
}