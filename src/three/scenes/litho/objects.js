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
        this.sizes.on('resize', () => { this.resize() })

        this.setModels()
    }

    setModels()
    {
        // Hello
        this.lithoResource = this.resources.items.litho

        this.litho = this.lithoResource.scene
        this.litho.children[0].scale.set(0.7, 0.7, 0.7)
        // this.hello.rotation.z = 0.5
        this.scene.add(this.litho)
    }

    update()
    {
        
    }

    setObjectScale(object, factor)
    {
        this.scale = this.sizes.width < 1400? Math.pow(this.sizes.width / 1400, factor) : 1
        object.scale.set(this.scale, this.scale, this.scale)
    }
}