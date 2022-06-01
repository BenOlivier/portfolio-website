import * as THREE from 'three'
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js'
import Experience from '../Experience.js'

export default class Text
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.sizes = this.experience.sizes
        this.objects = this.experience.objects

        // this.setText()
    }

    setText()
    {
        this.element = document.createElement( 'div' )
        this.element.style.width = '250px'
        this.element.style.height = '200px'
        // this.element.style.background = new THREE.Color('#ffff00').getStyle()
        // this.element.style.margin = 'auto'
        this.element.style.lineHeight = 1.5
        this.element.style.textAlign = 'center'
        this.element.style.display = 'flex'
        this.element.textContent = "For the last few years I've been at Litho, a London-based startup"
        this.element.setAttribute('contenteditable', '')

        this.domObject = new CSS3DObject( this.element )
        this.domObject.position.set(3.6, 0, 0)
        this.domObject.scale.set(0.003, 0.003, 0.003)
        this.domObject.rotation.set(0, Math.PI * 0.1, 0)
        this.objects.group.add( this.domObject )
    }
}