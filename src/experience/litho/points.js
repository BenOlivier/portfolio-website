import * as THREE from 'three'
import { Raycaster } from 'three'
import Experience from '../experience.js'

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
                position: new THREE.Vector3(0, 0.4, 0),
                element: document.getElementById('point-0')
            },
            {
                position: new THREE.Vector3(0.35, -0.2, 0),
                element: document.getElementById('point-1')
            },
            {
                position: new THREE.Vector3(-0.4, -0.4, 0),
                element: document.getElementById('point-2')
            }
        ]
        this.pointsVisible = false
        this.raycaster = new THREE.Raycaster()
    }

    update()
    {
        for(const point of this.points)
        {
            if(this.objects.currentObject == 2 && this.pointsVisible)
            {
                const worldPosition = this.objects.litho.children[0].localToWorld(point.position.clone())
                const screenPosition = worldPosition.clone().project(this.camera.camera)

                this.raycaster.setFromCamera(screenPosition, this.camera.camera)
                const intersects = this.raycaster.intersectObjects([this.objects.group.children[2]])
                if(intersects.length == 0) { point.element.classList.add('visible') }
                else
                {
                    const intersectionDistance = intersects[0].distance
                    const pointDistance = worldPosition.distanceTo(this.camera.camera.position)
                    if(intersectionDistance < pointDistance)
                    {
                        point.element.classList.remove('visible')
                    }
                    else {
                        point.element.classList.add('visible')
                    }
                }

                const translateX = screenPosition.x * this.sizes.width * 0.5 - 20
                const translateY = -screenPosition.y * this.sizes.height * 0.5 - 20
                point.element.style.transform = `translate(${translateX}px, ${translateY}px)`
            }
            else point.element.classList.remove('visible')
        }
    }
}