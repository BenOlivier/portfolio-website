import * as THREE from 'three'
import { Vector3 } from 'three'
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
            startPosX: -0.7,
            startPosY: 1.2,
            startPosZ: 8
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
        this.camera = new THREE.PerspectiveCamera
            (35, this.sizes.width / this.sizes.height, 0.1, 100)
        this.camera.position.set(this.params.startPosX, this.params.startPosY, this.params.startPosZ)
        
        this.scene.add(this.camera)
    }

    resize()
    {
        this.camera.aspect = this.sizes.width / this.sizes.height
        this.camera.updateProjectionMatrix()
    }

    moveCamera(targetPos, targetMesh)
    {
        // this.startOrientation = this.camera.quaternion.clone()
        // this.targetOrientation = targetMesh.quaternion.clone().normalize();
        
        gsap.to(this.camera.position, {
            duration: 1,
            ease: "power1.inOut",
            x: targetPos.x,
            y: targetPos.y,
            z: targetPos.z
        })

        // gsap.to( {}, {
        //     duration: 1,
        //     onUpdate: function() {
        //         this.camera.lookAt(targetMesh.position)
        //         // this.camera.quaternion.copy(this.startOrientation).slerp(targetOrientation, this.progress())
        //     }
        // })
    }
}