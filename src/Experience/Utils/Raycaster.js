import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Raycaster
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.debug = this.experience.debug
        this.pointer = this.experience.pointer
        this.camera = this.experience.camera
        this.object = this.experience.object

        // Parameters
        this.params = {
            aboutClickX: 0,
            aboutClickY: 2.5,
            aboutClickZ: 2,

            workClickX: -1.2,
            workClickY: 1.2,
            workClickZ: 0,

            contactClickX: 0,
            contactClickY: 0,
            contactClickZ: 4
        }

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('raycaster')
        }

        this.setRaycaster()
    }

    setRaycaster()
    {
        this.raycaster = new THREE.Raycaster()
        this.mainMenu = true

        // Cast ray on mouse move
        window.addEventListener('mousemove', (event) => {
            if(this.mainMenu)
            {
                this.castRay()
            }
        })

        window.addEventListener('click', () =>
        {
            // Clicked on overlay
            if(this.currentIntersect)
            {
                this.sendAnimation()
                this.object.fadeOutOverlay(this.currentIntersect.object)
                this.currentIntersect = null
                this.mainMenu = false
            }
            // Clicked away from room
            else
            {
                if(!this.mainMenu)
                {
                    this.camera.resetCamera()
                    this.mainMenu = true
                }
            }
        })
    }

    castRay()
    {
        this.raycaster.setFromCamera(this.pointer.pointerPos, this.camera.camera)
        this.intersects = this.raycaster.intersectObjects
            ([this.object.overlay1, this.object.overlay2, this.object.overlay3])

        // Hover on overlay
        if(this.intersects.length)
        {
            if(this.currentIntersect == null)
            {
                this.currentIntersect = this.intersects[0]
                this.object.fadeInOverlay(this.currentIntersect.object)
            }
        }
        // Exit hover
        else
        {
            if(this.currentIntersect)
            {
                this.object.fadeOutOverlay(this.currentIntersect.object)
                this.currentIntersect = null
            }
        }
    }

    sendAnimation()
    {
        switch(this.currentIntersect.object)
        {
            case this.object.overlay1:
                this.camera.moveCamera(new THREE.Vector3(this.params.aboutClickX,
                    this.params.aboutClickY, this.params.aboutClickZ), new THREE.Quaternion(0, 0, 0, 0))
                break

            case this.object.overlay2:
                this.camera.moveCamera(new THREE.Vector3(this.params.workHoverX,
                    this.params.workClickY, this.params.workClickZ), new THREE.Quaternion(0, -0.7071068, 0, 0.7071068))
                break

            case this.object.overlay3:
                this.camera.moveCamera(new THREE.Vector3(this.params.contactClickX,
                    this.params.contactClickY, this.params.contactClickZ), new THREE.Quaternion(0, 0, 0, 0))
                break
        }
    }
}