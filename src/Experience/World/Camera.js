import * as THREE from 'three'
import { Euler, Vector3 } from 'three'
import Experience from '../Experience.js'
import gsap from 'gsap'
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

        // Debug
        if(this.debug.active)
        {
            this.setOrbitControls()
        }
    }

    setCamera()
    {
        this.camera = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 100)

        this.startPosition = new THREE.Vector3(-8, 4, 8)
        this.defaultPosition = new THREE.Vector3(-6, 1.7, 6)
        this.camera.position.set(this.startPosition.x, this.startPosition.y, this.startPosition.z)
        this.camera.rotation.order = "YXZ"
        this.camera.rotation.set(Math.PI * -0.07, Math.PI * -0.25, 0)
        this.defaultOrientation = new THREE.Euler(0, Math.PI * -0.25, 0)

        this.scene.add(this.camera)
    }

    setOrbitControls()
    {
        this.controls = new OrbitControls(this.camera, this.canvas)
        this.controls.enableDamping = true
    }

    updateOrbitControls()
    {
        this.controls.update()
    }

    resize()
    {
        this.camera.aspect = this.sizes.width / this.sizes.height
        this.camera.updateProjectionMatrix()
    }

    moveCamera(targetPos, targetOrientation, duration, ease)
    {
        gsap.to(this.camera.position, {
            duration: duration,
            ease: ease,
            x: targetPos.x,
            y: targetPos.y,
            z: targetPos.z
        })

        gsap.to(this.camera.rotation, {
            duration: duration,
            ease: ease,
            x: targetOrientation.x,
            y: targetOrientation.y,
            z: targetOrientation.z
        })
    }

    resetCamera(duration, ease)
    {
        this.moveCamera(new Vector3(this.defaultPosition.x, this.defaultPosition.y,
            this.defaultPosition.z), this.defaultOrientation, duration, ease)
    }
}