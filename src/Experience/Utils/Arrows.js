import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Arrows
{
    constructor()
    {
        // Setup
        this.experience = new Experience()
        this.pointer = this.experience.pointer
        this.leftArrow = document.getElementById("left-arrow")

        // this.pointer.on('mousemove', () =>
        // {
        //     this.checkPosition()
        // })
    }

    checkPosition()
    {
        // this.leftArrow.element.classList.add('visible')
    }
}