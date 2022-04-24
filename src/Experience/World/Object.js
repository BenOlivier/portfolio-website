import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Object
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.sizes = this.experience.sizes
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.pointer = this.experience.pointer
        this.camera = this.experience.camera

        // Raycaster
        this.raycaster = new THREE.Raycaster()
        this.rayOrigin  = new THREE.Vector3(-3, 0, 0)
        this.rayDirection = new THREE.Vector3(10, 0, 0)
        this.rayDirection.normalize()
        this.raycaster.set(this.rayOrigin, this.rayDirection)
        // this.intersect = raycaster.intersectObject(overlay1)
        window.addEventListener('mousemove', (event) =>
        {
            this.castRays()
        })

        // Parameters
        this.params = {
            objectScale: 0.5,
            rotationSmoothing: 0.005,
            rotationExtent: 100
        }

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('object')
        }
        
        // Resource
        this.resource = this.resources.items.objectModel

        this.setModel()
        this.intersect = this.raycaster.intersectObject(this.overlay1)
    }

    setModel()
    {
        this.model = this.resource.scene
        this.model.scale.set(this.params.objectScale,
            this.params.objectScale, this.params.objectScale)
        this.scene.add(this.model)

        this.overlay1 = this.model.children[0].children[1].children[0]
        this.overlay2 = this.model.children[0].children[1].children[1]
        this.overlay3 = this.model.children[0].children[1].children[2]
        // this.overlays = [this.overlay1, this.overlay2, this.overlay3]

        // Debug
        if(this.debug.active)
        {
            this.debugFolder
                .add(this.params, 'objectScale')
                .name('objectScale')
                .min(0)
                .max(20)
                .step(0.1)
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

    castRays()
    {
        this.raycaster.setFromCamera(this.pointer, this.camera.camera)
        this.intersects = this.raycaster.intersectObjects(this.overlay1)

        console.log('update')

        if(this.intersects.length)
        {
            console.log('length')
            if(this.currentIntersect == null)
            {
                console.log('mouse enter')
            }
            this.currentIntersect = this.intersects[0]
        }
        else
        {
            if(this.currentIntersect)
            {
                console.log('mouse leave')
            }
            this.currentIntersect = null
        }
    }
}