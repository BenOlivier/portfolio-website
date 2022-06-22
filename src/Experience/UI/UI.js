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
        this.scene = this.experience.scene

        // this.navBar = document.getElementById("nav-bar")
        // this.aboutDot = document.getElementById("about-dot")
        // this.lithoDot = document.getElementById("litho-dot")
        // this.dioramaDot = document.getElementById("diorama-dot")
        // Home button hover event
        // this.homeButton.addEventListener('mouseenter', () => {
        //     this.aboutDot.classList.add('visible')
        //     this.lithoDot.classList.add('visible')
        //     this.dioramaDot.classList.add('visible')
        // })
        // this.navBar.addEventListener('mouseleave', () => {
        //     this.aboutDot.classList.remove('visible')
        //     this.lithoDot.classList.remove('visible')
        //     this.dioramaDot.classList.remove('visible')
        // })
        // Page dot click events
        // this.aboutDot.addEventListener('click', () => { if(this.currentSection != 1) this.changeSection(1) })
        // this.lithoDot.addEventListener('click', () => { if(this.currentSection != 2) this.changeSection(2) })
        // this.dioramaDot.addEventListener('click', () => { if(this.currentSection != 3) this.changeSection(3) })

        this.homeButton = document.getElementById("home-button")
        this.leftArea = document.getElementById("left-area")
        this.rightArea = document.getElementById("right-area")
        this.leftArrow = document.getElementById("left-arrow")
        this.rightArrow = document.getElementById("right-arrow")

        this.aboutText = document.getElementById("about-text")
        this.lithoText = document.getElementById("litho-text")
        this.dioramaText = document.getElementById("diorama-text")

        // Arrow area enter + exit events
        this.leftArea.addEventListener('mouseenter', () => { this.leftArrow.classList.add('visible') })
        this.rightArea.addEventListener('mouseenter', () => { this.rightArrow.classList.add('visible') })
        this.leftArea.addEventListener('mouseleave', () => { this.leftArrow.classList.remove('visible') })
        this.rightArea.addEventListener('mouseleave', () => { this.rightArrow.classList.remove('visible') })
        
        // Points
        this.points = [
            {
                position: new THREE.Vector3(0.4, 0.5, 0),
                element: document.querySelector('.point-0')
            }
        ]
        this.raycaster = new Raycaster()

        this.tempGeo = new THREE.BoxGeometry(0.02, 0.02, 0.02)
        this.tempMat = new THREE.MeshStandardMaterial({color: '#ff0000'})
        this.tempMesh = new THREE.Mesh(this.tempGeo, this.tempMat)
        this.scene.add(this.tempMesh)
    }

    update()
    {
        if(this.objects.currentObject == 2)
        {
            for(const point of this.points)
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
        }
    }
}