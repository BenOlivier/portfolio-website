import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Objects
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.sizes = this.experience.sizes
        this.resources = this.experience.resources
        this.pointer = this.experience.pointer
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.currentObject = 0

        // Parameters
        this.params = {
            rotationSmoothing: 0.2,
            rotationExtent: 0.2
        }

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('object')
        }

        // Reset timer on mouse move
        this.timer = 0
        this.pointer.on('mousemove', () => { this.timer = 0 })

        // Resize event
        this.sizes.on('desktop', () => { this.resizeDesktop() })
        this.sizes.on('mobile', () => { this.resizeMobile() })
        
        // Resources
        this.helloResource = this.resources.items.hello
        this.lithoResource = this.resources.items.litho

        this.setModels()
    }

    setModels()
    {
        this.group = new THREE.Group()
        
        // Hello
        this.hello = this.helloResource.scene
        this.hello.scale.set(0.5, 0.5, 0.5)
        this.hello.position.set(0, 0, 0)
        this.group.add(this.hello)

        // Litho
        this.litho = this.lithoResource.scene
        this.litho.scale.set(0.5, 0.5, 0.5)
        this.litho.position.set(4.8, 0, 0)
        this.litho.children[0].rotation.set(Math.PI * 0.1, Math.PI * -0.15, 0)
        this.group.add(this.litho)

        this.scene.add(this.group)

        this.targetQuaternion = new THREE.Quaternion()

        // Debug
        if(this.debug.active)
        {
            this.debugFolder
                .add(this.params, 'rotationSmoothing')
                .name('rotationSmoothing')
                .min(0)
                .max(0.05)
                .step(0.0005)

            this.debugFolder
                .add(this.params, 'rotationExtent')
                .name('rotationExtent')
                .min(0)
                .max(2000)
                .step(10)
        }
    }

    update()
    {
        this.timer += this.time.delta / 1000
        if(this.timer > 1.2)
        {
            this.targetQuaternion.setFromEuler(new THREE.Euler(0, 0, 0))
            this.params.rotationSmoothing = 0.04
        }
        else
        {
            this.targetQuaternion.setFromEuler(new THREE.Euler
                (0 + (-this.pointer.pointerPos.y * this.params.rotationExtent),
                0 + (this.pointer.pointerPos.x * this.params.rotationExtent), 0))

            this.params.rotationSmoothing = 0.2
        }

        // Rotate with mouse position
        this.group.children[this.currentObject].quaternion.slerp
            (this.targetQuaternion, this.params.rotationSmoothing)
        
    }

    resizeDesktop()
    {
        this.hello.scale.set(0.5, 0.5, 0.5)
        this.litho.scale.set(0.5, 0.5, 0.5)
    }

    resizeMobile()
    {
        this.hello.scale.set(0.25, 0.25, 0.25)
        this.litho.scale.set(0.25, 0.25, 0.25)

        this.litho.position.set(4, 0.2, 0)
    }
}