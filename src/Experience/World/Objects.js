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
            rotationExtent: 0.5
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
        
        // Resource
        this.resource = this.resources.items.hello

        this.setModel()
        this.setAnimation()
    }

    setModel()
    {
        // Model
        this.model = this.resource.scene
        if(this.sizes.width < 800)
        {
            this.model.scale.set(this.params.objectScale / 2,
                this.params.objectScale / 2, this.params.objectScale / 2)
        }
        else
        {
            this.model.scale.set(this.params.objectScale,
                this.params.objectScale, this.params.objectScale)
        }
        this.model.position.set(0, 0, -4)
        this.scene.add(this.model)

        this.model2 = this.model.clone()
        this.model.position.set(0, 0, -2)
        this.scene.add(this.model2)

        this.targetQuaternion = new THREE.Quaternion()

        // Debug
        if(this.debug.active)
        {
            this.debugFolder
                .add(this.params, 'objectScale')
                .name('objectScale')
                .min(0)
                .max(2)
                .step(0.01)
                .onChange(() =>
                {
                    this.model.scale.set(this.params.objectScale,
                        this.params.objectScale, this.params.objectScale)
                })
            
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

    setAnimation()
    {
        this.animation = {}
        this.animation.mixer = new THREE.AnimationMixer(this.model)
        this.animation.action = this.animation.mixer.clipAction(this.resource.animations[0])
        this.animation.action.play()
    }

    update()
    {
        // this.animation.mixer.update(this.time.delta * 0.001)

        this.timer += this.time.delta / 1000
        if(this.timer > 1.2)
        {
            this.targetQuaternion.setFromEuler(new THREE.Euler(0, 0, 0, 'XYZ'))
            this.params.rotationSmoothing = 0.04
        }
        else
        {
            this.targetQuaternion.setFromEuler(new THREE.Euler
                (0, this.pointer.pointerPos.x * this.params.rotationExtent, 0, 'XYZ'))
            this.params.rotationSmoothing = 0.2
        }

        // Rotate with mouse position
        this.model.quaternion.slerp(this.targetQuaternion, this.params.rotationSmoothing)
    }

    resize()
    {
        if(this.sizes.width < 800)
        {
            this.model.scale.set(this.params.objectScale / 2,
                this.params.objectScale / 2, this.params.objectScale / 2)
        }
        else
        {
            this.model.scale.set(this.params.objectScale,
                this.params.objectScale, this.params.objectScale)
        }
    }
}