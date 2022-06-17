import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Raycaster
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.pointer = this.experience.pointer
        this.camera = this.experience.camera
        this.objects = this.experience.objects

        this.setRaycaster()
    }

    setRaycaster()
    {
        this.raycaster = new THREE.Raycaster()
        window.addEventListener('mousedown', (event) => { this.castRay() })
    }

    castRay()
    {
        this.raycaster.setFromCamera(this.pointer.pointerPos, this.camera.camera)
        this.intersects = this.raycaster.intersectObjects([this.objects.group.litho])

        // Hover on overlay
        if(this.intersects.length)
        {
            console.log('hit litho')
        }
    }
}