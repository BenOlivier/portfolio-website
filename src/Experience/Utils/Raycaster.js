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
            aboutX: -3.8,
            aboutY: 0.63,
            aboutZ: 0.5,

            workX: -0.5,
            workY: 1.8,
            workZ: 4,

            contactX: -3,
            contactY: 2.95,
            contactZ: 1
        }

        this.aboutSection = document.querySelector('.aboutSection')
        this.workSection = document.querySelector('.workSection')
        this.contactSection = document.querySelector('.contactSection')

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
                // this.castRay()
            }
        })

        window.addEventListener('click', () =>
        {
            if(this.currentIntersect)
            {
                // Clicked on something
            }

            else
            {
                // Clicked on nothing
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
        // switch(this.currentIntersect.object)
        // {
        //     case this.object.overlay1:
        //         this.camera.moveCamera(new THREE.Vector3(this.params.aboutX,
        //             this.params.aboutY, this.params.aboutZ), new THREE.Euler(0, Math.PI * -0.35, 0),
        //             2.5, "power2.inOut")
        //         break
        // }
    }
}