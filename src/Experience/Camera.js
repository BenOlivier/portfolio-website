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
            positionY: 2,
            positionZ: 10,
            rotationX: 0
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
        this.instance.position.set(0, this.params.positionY, this.params.positionZ)

        this.updatePosition = () =>
        {
            this.instance.position.set(0, this.params.positionY, this.params.positionZ)
        }
        this.updateRotation = () =>
        {
            this.instance.rotation.x = -this.params.rotationX
        }
        
        this.scene.add(this.instance)

        // Debug
        if(this.debug.active)
        {
            this.debugFolder
                .add(this.params, 'positionY')
                .name('positionY')
                .min(0)
                .max(20)
                .step(0.1)
                .onChange(() =>
                {
                    this.updatePosition()
                })

            this.debugFolder
                .add(this.params, 'positionZ')
                .name('positionZ')
                .min(0)
                .max(50)
                .step(0.1)
                .onChange(() =>
                {
                    this.updatePosition()
                })

            this.debugFolder
                .add(this.params, 'rotationX')
                .name('rotationX')
                .min(Math.PI * -0.5)
                .max(Math.PI * 0.5)
                .step(0.01)
                .onChange(() =>
                {
                    this.updateRotation()
                })
        }
    }

    resize()
    {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }
}