import * as THREE from 'three'
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js'
import Experience from '../Experience.js'

export default class Objects
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.sizes = this.experience.sizes

        this.setText()
    }

    setText()
    {
        this.element = document.createElement( 'div' )
        this.element.style.width = '100px'
        this.element.style.height = '100px'
        this.element.style.opacity = 1
        this.element.style.background = new THREE.Color('#ff0000').getStyle()
        this.element.textContent = "Yo yo yo yo!"
        this.element.setAttribute('contenteditable', '')

        this.domObject = new CSS3DObject( this.element )
        this.scene.add( this.domObject )
    }
}