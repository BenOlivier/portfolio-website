import * as THREE from 'three'
import gsap from 'gsap'
import Experience from './experience.js'

export default class Objects
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.sizes = this.experience.sizes
        this.resources = this.experience.resources
        this.pointer = this.experience.pointer
        this.camera = this.experience.camera
        this.time = this.experience.time

        // Resize event
        this.screenVec = new THREE.Vector3()
        this.objectPos = new THREE.Vector3()
        // this.sizes.on('resize', () => { this.setScale() })

        this.setModels()
    }

    setModels()
    {
        // Hello
        this.lithoResource = this.resources.items.litho

        this.litho = this.lithoResource.scene
        this.litho.children[0].scale.set(0.8, 0.8, 0.8)
        // this.setScale()
        this.scene.add(this.litho)
    }

    update()
    {
        
    }

    setScale()
    {
        this.scale = this.sizes.width < 1400? Math.pow(this.sizes.width / 1400, 0.5) : 1
        this.litho.scale.set(this.scale, this.scale, this.scale)
    }
}