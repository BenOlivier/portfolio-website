import * as THREE from 'three'
import { Raycaster } from 'three'
import Experience from './experience.js'

export default class Points
{
    constructor()
    {
        this.experience = new Experience()
        this.objects = this.experience.objects
        this.camera = this.experience.camera
        this.sizes = this.experience.sizes
        
        // Points
        this.points = [
            
            {
                position: new THREE.Vector3(0, 0.3, 0),
                element: document.getElementById('point-0')
            },
            {
                position: new THREE.Vector3(0.3, -0.14, 0),
                element: document.getElementById('point-1')
            },
            {
                position: new THREE.Vector3(-0.3, -0.3, 0),
                element: document.getElementById('point-2')
            }
        ]
        this.raycaster = new THREE.Raycaster()
    }

    update()
    {
        for(const point of this.points)
        {
            const worldPosition = this.objects.litho.localToWorld(point.position.clone())
            const screenPosition = worldPosition.clone().project(this.camera.camera)

            this.raycaster.setFromCamera(screenPosition, this.camera.camera)
            const intersects = this.raycaster.intersectObjects([this.objects.litho.children[0]])
            if(intersects.length == 0) { point.element.classList.add('visible') }
            else
            {
                const intersectionDistance = intersects[0].distance
                const pointDistance = worldPosition.distanceTo(this.camera.camera.position)
                if(intersectionDistance < pointDistance)
                {
                    point.element.classList.remove('visible')
                }
                else
                {
                    point.element.classList.add('visible')
                }
            }

            const translateX = screenPosition.x * this.sizes.width * 0.5 - 20
            const translateY = -screenPosition.y * this.sizes.height * 0.5 - 20 - 160
            point.element.style.transform = `translate(${translateX}px, ${translateY}px)`
        }
    }
}