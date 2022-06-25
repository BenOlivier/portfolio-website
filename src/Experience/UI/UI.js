import * as THREE from 'three'
import { Raycaster } from 'three'
import Experience from '../Experience.js'

export default class UI
{
    constructor()
    {
        this.experience = new Experience()
        this.objects = this.experience.objects
        this.camera = this.experience.camera
        this.sizes = this.experience.sizes

        this.homeButton = document.getElementById("home-button")
        this.homeButton.addEventListener('click', () => { if(this.currentSection != 0) this.changeSection(0) })

        // Page dots
        this.aboutDot = document.getElementById("about-dot")
        this.lithoDot = document.getElementById("litho-dot")
        this.dioramaDot = document.getElementById("diorama-dot")

        // Arrows
        this.leftArea = document.getElementById("left-area")
        this.rightArea = document.getElementById("right-area")
        this.leftArrow = document.getElementById("left-arrow")
        this.rightArrow = document.getElementById("right-arrow")

        // Text
        this.aboutText = document.getElementById("about-text")
        this.lithoText = document.getElementById("litho-text")
        this.dioramaText = document.getElementById("diorama-text")

        // Video links
        this.lithoVideoLink = document.getElementById("litho-video-link")

        // Videos
        this.videosContainer = document.getElementById("videos-container")
        this.lithoVideo = document.getElementById("litho-video")

        this.lithoVideoLink.addEventListener('click', () => { this.videosContainer.style.display = 'flex' })

        // Arrow area enter + exit events
        this.leftArea.addEventListener('mouseenter', () => { this.leftArrow.classList.add('visible') })
        this.rightArea.addEventListener('mouseenter', () => { this.rightArrow.classList.add('visible') })
        this.leftArea.addEventListener('mouseleave', () => { this.leftArrow.classList.remove('visible') })
        this.rightArea.addEventListener('mouseleave', () => { this.rightArrow.classList.remove('visible') })
        
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