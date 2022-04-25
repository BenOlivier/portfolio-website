import * as THREE from 'three'
import { Euler, Vector3 } from 'three'
import Experience from '../Experience.js'
import gsap from 'gsap'

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
            startPosX: -6,
            startPosY: 1.2,
            startPosZ: 5,

            hoverDuration: 3,
            clickDuration: 2
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
        this.defaultPosition = new THREE.Vector3(this.params.startPosX, this.params.startPosY, this.params.startPosZ)
        this.camera.position.set(this.defaultPosition.x, this.defaultPosition.y, this.defaultPosition.z)
        this.camera.rotation.y = Math.PI * -0.25
        this.defaultOrientation = this.camera.rotation.clone()
        this.scene.add(this.camera)
    }

    resize()
    {
        this.camera.aspect = this.sizes.width / this.sizes.height
        this.camera.updateProjectionMatrix()
    }

    moveCamera(targetPos, targetOrientation)
    {
        gsap.to(this.camera.position, {
            duration: this.params.hoverDuration,
            ease: "power1.inOut",
            x: targetPos.x,
            y: targetPos.y,
            z: targetPos.z
        })

        gsap.to(this.camera.rotation, {
            duration: this.params.hoverDuration,
            ease: "power1.inOut",
            x: targetOrientation.x,
            y: targetOrientation.y,
            z: targetOrientation.z
        })
    }

    resetCamera()
    {
        this.moveCamera(new Vector3(this.defaultPosition.x, this.defaultPosition.y,
            this.defaultPosition.z), this.defaultOrientation)
    }
}