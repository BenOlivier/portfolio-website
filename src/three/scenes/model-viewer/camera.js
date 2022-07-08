import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'

export default class Camera
{
    constructor()
    {
        this.experience = window.experience
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas
        this.pointer = this.experience.pointer
        this.time = this.experience.time
        this.debug = this.experience.debug

        this.autoRotate = true
        this.timer = 0

        this.canvas.addEventListener('click', (event) =>
        {
            this.controls.autoRotate = false
            this.autoRotate = false
            this.timer = 0
        })

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
        this.scene.add(this.camera)

        this.controls = new OrbitControls(this.camera, this.canvas)
        this.controls.autoRotate = true
        this.controls.enableDamping = true
        this.controls.dampingFactor = 0.2
        this.controls.enablePan = false
        this.controls.maxPolarAngle = Math.PI * 0.6
        this.controls.minPolarAngle = Math.PI * 0.1
        this.controls.maxDistance = 3
        this.controls.minDistance = 1
        this.controls.zoomSpeed = 0.5
    }

    update()
    {
        this.controls.update()
        if(!this.autoRotate)
        {
            this.timer += this.time.delta
            if(this.timer > 3000)
            {
                this.controls.autoRotate = true
                this.autoRotate = true
            }
        }
    }

    resize()
    {
        this.camera.aspect = this.sizes.width / this.sizes.height
        this.camera.updateProjectionMatrix()
    }
}