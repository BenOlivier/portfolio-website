import * as THREE from 'three'
import Experience from './Experience.js'

export default class Camera
{
    constructor()
    {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas
        this.debug = this.experience.debug

        // Parameters
        this.params = {
            cameraY: 2,
            cameraZ: 10
        }

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('camera')
        }

        this.setInstance()
    }

    setInstance()
    {
        this.instance = new THREE.PerspectiveCamera
            (35, this.sizes.width / this.sizes.height, 0.1, 100)
        this.instance.position.set(0, 2, this.params.cameraZ)
        this.scene.add(this.instance)

        this.updatePosition = () =>
        {
            this.instance.position.set(0, this.params.cameraY, this.params.cameraZ)
        }

        // Debug
        if(this.debug.active)
        {
            this.debugFolder
                .add(this.params, 'cameraY')
                .name('cameraY')
                .min(0)
                .max(20)
                .step(0.1)
                .onChange(this.updatePosition())

            this.debugFolder
                .add(this.params, 'cameraZ')
                .name('cameraZ')
                .min(0)
                .max(50)
                .step(0.1)
                .onChange(this.updatePosition())
        }
    }

    resize()
    {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    updatePosition()
    {
        console.log('move cam')
    }
}