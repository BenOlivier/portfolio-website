import * as THREE from 'three'
import Experience from '../experience.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

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

        this.controls = new OrbitControls(this.camera, this.canvas)
    }

    update()
    {
        this.controls.update()
    }

    resize()
    {
        this.camera.aspect = this.sizes.width / this.sizes.height
        this.camera.updateProjectionMatrix()
    }
}