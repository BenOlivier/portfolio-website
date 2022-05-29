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

        // Parameters
        this.params = {
            objectScale: 0.5,
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
        this.pointer.on('mousemove', () =>
        {
            this.timer = 0
        })
        
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
        this.setObjectScale(this.hello)
        this.hello.position.set(0, 0, -1)
        this.group.add(this.hello)

        // Litho
        this.litho = this.lithoResource.scene
        this.setObjectScale(this.litho)
        this.litho.position.set(4, 0, -1)
        this.lithoRot = new THREE.Euler(Math.PI * 0.1, Math.PI * -0.15, 0)
        this.litho.rotation.set(this.lithoRot.x, this.lithoRot.y, this.lithoRot.z)
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

    setObjectScale(object) //TODO: only scale when necessary
    {
        if(this.sizes.width < 800)
        {
            object.scale.set(this.params.objectScale / 2, this.params.objectScale / 2,
                this.params.objectScale / 2)
        }
        else
        {
            object.scale.set(this.params.objectScale, this.params.objectScale, this.params.objectScale)
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
        this.hello.quaternion.slerp
            (this.targetQuaternion, this.params.rotationSmoothing)
    }

    resize()
    {
        this.setObjectScale(this.hello) //TODO: Scale whole scene
        this.setObjectScale(this.litho)
    }
}