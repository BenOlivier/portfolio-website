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
        this.object = this.experience.object

        // Parameters
        this.params = {
            aboutX: -5,
            aboutY: 0.8,
            aboutZ: -1.2,

            workX: 0.5,
            workY: 1.9,
            workZ: 3.4,

            contactX: -4,
            contactY: 3,
            contactZ: -1
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
                document.body.style.cursor = 'default'
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
                document.body.style.cursor = 'pointer'
            }
        }
        // Exit hover
        else
        {
            if(this.currentIntersect)
            {
                this.object.fadeOutOverlay(this.currentIntersect.object)
                this.currentIntersect = null
                document.body.style.cursor = 'default'
            }
        }
    }

    sendAnimation()
    {
        switch(this.currentIntersect.object)
        {
            case this.object.overlay1:
                this.camera.moveCamera(new THREE.Vector3(this.params.aboutX,
                    this.params.aboutY, this.params.aboutZ), new THREE.Euler(0, Math.PI * -0.5, 0))
                break

            case this.object.overlay2:
                this.camera.moveCamera(new THREE.Vector3(this.params.workX,
                    this.params.workY, this.params.workZ), new THREE.Euler(0, 0, 0))
                break

            case this.object.overlay3:
                this.camera.moveCamera(new THREE.Vector3(this.params.contactX,
                    this.params.contactY, this.params.contactZ), new THREE.Euler(0, Math.PI * -0.5, 0))
                break
        }
    }
}