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
    }

    setModel()
    {
        this.resource = this.resources.items.abstractForm

        this.abstractForm = this.resource.scene
        this.abstractForm.position.set(0, -0.5, 0)
        this.scene.add(this.abstractForm)

        this.abstractForm.traverse((child) =>
        {
            if(child instanceof THREE.Mesh)
            {
                child.castShadow = true
                child.receiveShadow = true
            }
        })
    }

    update()
    {
        
    }
}