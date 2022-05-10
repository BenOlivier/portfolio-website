import * as THREE from 'three'
import { Quaternion } from 'three'
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
        
        // Resources
        this.helloResource = this.resources.items.hello
        this.lithoResource = this.resources.items.litho
        this.scanResource = this.resources.items.scan

        this.setModels()
        this.setAnimation()
    }

    setModels()
    {
        // Hello
        this.hello = this.helloResource.scene
        this.setObjectScale(this.hello)
        this.hello.position.set(0, 0, -1)
        this.scene.add(this.hello)

        // Litho
        this.litho = this.lithoResource.scene
        this.setObjectScale(this.litho)
        this.litho.position.set(0, -2, -2)
        this.litho.rotation.set(Math.PI * 0.05, Math.PI * 0.2, 0)
        this.scene.add(this.litho)

        // Scan
        this.scan = this.scanResource.scene
        this.setObjectScale(this.scan)
        this.scan.position.set(0, 0, 0)
        // this.scene.add(this.scan)

        this.helloTargetQuaternion = new THREE.Quaternion()
        this.lithoTargetQuaternion = new THREE.Quaternion()

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

    setObjectScale(object)
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

    setAnimation()
    {
        this.animation = {}
        this.animation.mixer = new THREE.AnimationMixer(this.hello)
        this.animation.action = this.animation.mixer.clipAction(this.helloResource.animations[0])
        this.animation.action.play()
    }

    update()
    {
        // this.animation.mixer.update(this.time.delta * 0.001)

        this.timer += this.time.delta / 1000
        if(this.timer > 1.2)
        {
            this.helloTargetQuaternion.setFromEuler(new THREE.Euler(0, 0, 0, 'XYZ'))
            this.lithoTargetQuaternion.setFromEuler(new THREE.Euler(Math.PI * 0.15, Math.PI * 0.1, 0, 'XYZ'))
            this.params.rotationSmoothing = 0.04
        }
        else
        {
            this.helloTargetQuaternion.setFromEuler(new THREE.Euler
                (0, this.pointer.pointerPos.x * this.params.rotationExtent, 0, 'XYZ'))
            this.lithoTargetQuaternion.setFromEuler(new THREE.Euler
                (-this.pointer.pointerPos.y * this.params.rotationExtent,
                    this.pointer.pointerPos.x * this.params.rotationExtent, 0, 'XYZ'))
            this.params.rotationSmoothing = 0.2
        }

        // Rotate with mouse position
        this.hello.quaternion.slerp(this.helloTargetQuaternion, this.params.rotationSmoothing)
        this.litho.quaternion.slerp(this.lithoTargetQuaternion, this.params.rotationSmoothing)
    }

    resize()
    {
        if(this.sizes.width < 800)
        {
            this.hello.scale.set(this.params.objectScale / 2,
                this.params.objectScale / 2, this.params.objectScale / 2)
        }
        else
        {
            this.hello.scale.set(this.params.objectScale,
                this.params.objectScale, this.params.objectScale)
        }
    }
}