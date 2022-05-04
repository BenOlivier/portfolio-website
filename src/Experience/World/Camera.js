import * as THREE from 'three'
import Experience from '../Experience.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class Camera
{
    constructor()
    {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas
        this.debug = this.experience.debug

        this.setCamera()
        this.setOrbitControls()
    }

    setCamera()
    {
        this.camera = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 100)

        this.startPosition = new THREE.Vector3(-8, 4, 8)
        this.camera.position.set(this.startPosition.x, this.startPosition.y, this.startPosition.z)
        // this.camera.rotation.order = 'YXZ'
        // this.camera.rotation.set(Math.PI * -0.07, Math.PI * -0.25, 0)

        this.scene.add(this.camera)
    }

    setOrbitControls()
    {
        this.controls = new OrbitControls(this.camera, this.canvas)
        this.controls.enableDamping = true
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