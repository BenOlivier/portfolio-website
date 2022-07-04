import * as THREE from 'three'
import gsap from 'gsap'

export default class Environment
{
    constructor()
    {
        this.experience = window.experience
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        this.setLights()
    }

    setLights()
    {
        const dirLight1 = new THREE.DirectionalLight({
            color: '#ff0000',
            intensity: 5
        })
        dirLight1.position.set(1, 2, 2)
        this.scene.add(dirLight1)

        const dirLight2 = new THREE.DirectionalLight({
            color: '#00ff00',
            intensity: 5
        })
        dirLight1.position.set(-2, 2, -4)

        const ambientLight = new THREE.AmbientLight({
            color: '#ff0000',
            intensity: 1
        })
        dirLight1.position.set(1, 2, 2)

        this.scene.add(dirLight1, dirLight2, ambientLight)
    }
}