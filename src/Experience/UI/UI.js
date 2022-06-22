import * as THREE from 'three'
import Experience from '../Experience.js'

export default class UI
{
    constructor()
    {
        this.experience = new Experience()
        this.objects = this.experience.objects
        this.camera = this.experience.camera
        this.sizes = this.experience.sizes

        // this.navBar = document.getElementById("nav-bar")
        // this.homeButton = document.getElementById("home-button")
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
        // this.homeButton.addEventListener('click', () => { if(this.currentSection != 0) this.changeSection(0) })
        // this.aboutDot.addEventListener('click', () => { if(this.currentSection != 1) this.changeSection(1) })
        // this.lithoDot.addEventListener('click', () => { if(this.currentSection != 2) this.changeSection(2) })
        // this.dioramaDot.addEventListener('click', () => { if(this.currentSection != 3) this.changeSection(3) })

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
                position: new THREE.Vector3(0.1, 0.45, 0),
                element: document.querySelector('.point-0')
            },
            {
                position: new THREE.Vector3(-0.1, -0.35, 0),
                element: document.querySelector('.point-1')
            }
        ]
    }

    update()
    {
        for(const point of this.points)
        {
            const screenPosition = this.objects.litho.children[0].localToWorld(point.position.clone())
            // const screenPosition = point.position.clone()
            //     .add(new THREE.Vector3. this.objects.litho.children[0].position)
            screenPosition.project(this.camera.camera)
            const translateX = screenPosition.x * this.sizes.width * 0.5
            const translateY = -screenPosition.y * this.sizes.height * 0.5
            point.element.style.transform = `translate(${translateX}px, ${translateY}px)`
        }
    }
}