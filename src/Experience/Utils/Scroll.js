import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Scroll
{
    constructor()
    {
        // Setup
        this.experience = new Experience()
        this.scrollPos = 0

        // Scroll event
        window.addEventListener('scroll', (event) =>
        {
            console.log(window.scrollY)
        })
    }
}