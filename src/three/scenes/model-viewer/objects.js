import * as THREE from 'three'

export default class Objects
{
    constructor(_model)
    {
        this.experience = window.experience
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.loading = this.experience.loading
        this.camera = this.experience.camera
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.selector = document.getElementById('model-selector')
        this.selector.addEventListener('change', () => {
            this.changeModel()
        })

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

    changeModel()
    {
        this.loading.fadeOverlay(1, 0.3)
        setTimeout(() => {
            this.removeModel()
        }, 300)
        setTimeout(() => {
            this.setModel(this.selector.value)
            this.setAnimation()
        }, 300)
        setTimeout(() => {
            this.loading.fadeOverlay(0, 0.5)
        }, 300)
    }

    removeModel()
    {
        this.animate = false
        this.scene.remove(this.model)
        this.model.children.forEach(function (child)
        {
            if(child instanceof THREE.Mesh)
            {
                child.geometry.dispose()
                for(const key in child.material)
                {
                    const value = child.material[key]
                    if(value && typeof value.dispose === 'function')
                    {
                        value.dispose()
                    }
                }
            }
        })
    }
}