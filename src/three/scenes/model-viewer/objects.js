import * as THREE from 'three'

export default class Objects
{
    constructor()
    {
        this.experience = window.experience
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.camera = this.experience.camera
        this.time = this.experience.time
        this.debug = this.experience.debug

        this.setModel()
        this.setAnimation()
    }

    setModel()
    {
        this.resource = this.resources.items.maven

        this.maven = this.resource.scene
        this.maven.position.set(0, -0.5, 0)
        this.maven.scale.set(0.2, 0.2, 0.2)
        this.scene.add(this.maven)

        this.maven.traverse((child) =>
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
        this.animation = {}
        this.animation.mixer = new THREE.AnimationMixer(this.maven)
        this.animation.action = this.animation.mixer.clipAction(this.resource.animations[0])
        this.animation.action.play()
    }

    update()
    {
        this.animation.mixer.update(this.time.delta * 0.001)
    }
}