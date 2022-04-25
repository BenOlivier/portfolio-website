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
            aboutX: 0,
            aboutY: 2.5,
            aboutZ: 2,

            workX: -1.2,
            workY: 1.2,
            workZ: 0,

            contactX: 0,
            contactY: 0,
            contactZ: 4
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
            case this.object.overlay1.children[0]:
                this.camera.moveCamera(new THREE.Vector3(this.params.aboutX,
                    this.params.aboutY, this.params.aboutZ), new THREE.Quaternion(0, 0, 0, 0))
                break

            case this.object.overlay2.children[0]:
                this.camera.moveCamera(new THREE.Vector3(this.params.workX,
                    this.params.workY, this.params.workZ), new THREE.Quaternion(0, -0.7071068, 0, 0.7071068))
                break

            case this.object.overlay3.children[0]:
                this.camera.moveCamera(new THREE.Vector3(this.params.contactX,
                    this.params.contactY, this.params.contactZ), new THREE.Quaternion(0, 0, 0, 0))
                break
        }
    }
}