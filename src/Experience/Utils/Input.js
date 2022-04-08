import * as THREE from 'three'
import EventEmitter from './EventEmitter.js'
import Experience from '../Experience.js'

export default class Input extends EventEmitter
{
    constructor()
    {
        super()

        // Setup
        this.mousePos = new THREE.Vector2()
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.debug = this.experience.debug

        // Parameters
        this.params = {
            inputSmoothing: 0.5
        }

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('input')

            this.debugFolder
                .add(this.params, 'inputSmoothing')
                .name('inputSmoothing')
                .min(0)
                .max(1)
                .step(0.001)
        }

        // Mouse move event
        window.addEventListener('mousemove', (event) =>
        {
            this.mousePos.x = THREE.MathUtils.lerp
                (this.mousePos.x, event.clientX / this.sizes.width * 2 - 1,
                this.params.inputSmoothing)
            
            this.mousePos.y = THREE.MathUtils.lerp
                (this.mousePos.y, - (event.clientY / this.sizes.height) * 2 + 1,
                this.params.inputSmoothing)

            this.trigger('mousemove')
        })

        // Touch down event
        window.addEventListener('touchdown', (event) =>
        {
            this.mousePos.x = event.touches[0].clientX / this.sizes.width * 2 - 1
            
            this.mousePos.y = - (event.touches[0].clientY / this.sizes.height) * 2 + 1

            this.trigger('mousemove')
        })

        // Touch move event
        window.addEventListener('touchmove', (event) =>
        {
            this.mousePos.x = event.touches[0].clientX / this.sizes.width * 2 - 1
            
            this.mousePos.y = - (event.touches[0].clientY / this.sizes.height) * 2 + 1

            this.trigger('mousemove')
        })
    }
}