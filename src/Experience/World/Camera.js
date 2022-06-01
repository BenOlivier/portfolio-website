import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Camera
{
    constructor()
    {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas
        this.pointer = this.experience.pointer
        this.time = this.experience.time
        this.debug = this.experience.debug

        // Reset timer on mouse move
        this.timer = 0
        this.pointer.on('mousemove', () =>
        {
            this.timer = 0
        })
        // Declare camera target position
        this.targetPos = new THREE.Vector3(0, 0, 0)

        // Parameters
        this.params =
        {
            moveSmoothing: 0.2,
            moveExtent: 0.02
        }

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('camera')
        }

        this.setCamera()
    }

    setCamera()
    {
        this.camera = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 100)
        this.camera.position.set(0, 0, 2)
        this.targetPos = new THREE.Vector3(0, 0, 0)

        this.scene.add(this.camera)
    }

    update()
    {
        this.timer += this.time.delta / 1000
        if(this.timer > 1.2)
        {
            this.targetPos.set(0, 0, 2)
            this.params.moveSmoothing = 0.04
        }
        else
        {
            this.targetPos.set(this.pointer.pointerPos.x *this.params.moveExtent,
                this.pointer.pointerPos.y * this.params.moveExtent, 2)
            this.params.moveSmoothing = 0.2
        }

        // Lerp camera to position
        // this.camera.position.lerp(this.targetPos, this.params.moveSmoothing)
    }

    resize()
    {
        this.camera.aspect = this.sizes.width / this.sizes.height
        this.camera.updateProjectionMatrix()
    }
}