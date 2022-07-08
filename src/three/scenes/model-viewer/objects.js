import * as THREE from 'three'

export default class Objects
{
    constructor(_model)
    {
        this.experience = window.experience
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.camera = this.experience.camera
        this.time = this.experience.time
        this.debug = this.experience.debug

        this.setModel(_model)
        this.setAnimation()
    }

    setModel(_model)
    {
        this.resource = this.resources.items[_model]

        this.model = this.resource.scene
        this.model.position.set(0, -0.5, 0)
        this.scene.add(this.model)

        this.model.traverse((child) =>
        {
            if(child instanceof THREE.Mesh)
            {
                child.castShadow = true
                child.receiveShadow = true
            }
        })
    }

    setAnimation()
    {
        if(this.resource.animations.length > 0)
        {
            this.animate = true
            this.animation = {}
            this.animation.mixer = new THREE.AnimationMixer(this.model)
            this.animation.action = this.animation.mixer.clipAction(this.resource.animations[0])
            this.animation.action.play()
        }
    }

    update()
    {
        if(this.animate) this.animation.mixer.update(this.time.delta * 0.001)
    }
}