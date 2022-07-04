import * as THREE from 'three'
import Experience from './experience.js'
import { getPalette } from './color-palettes.js'

export default class Objects
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene

        window.addEventListener('click', () => {
            this.destroyModel()
            this.setModel()
        })

        this.setModel()
    }

    setModel()
    {
        function randomInRange(min, max) {
            return Math.random() * (max - min) + min
        }

        this.boxes = []

        for(let i = 0; i < 20; i++)
        {
            const boxGeo = new THREE.BoxGeometry(
                randomInRange(0.1, 0.5),
                randomInRange(0.1, 0.5),
                randomInRange(0.1, 0.5)
            )
            const boxMat = new THREE.MeshStandardMaterial({
                color: getPalette()[Math.floor(Math.random() * 6)]
            })
            const box = new THREE.Mesh(boxGeo, boxMat)
            box.position.set(
                Math.pow(randomInRange(-0.5, 0.5), 2),
                Math.pow(randomInRange(-0.5, 0.5), 2),
                Math.pow(randomInRange(-0.5, 0.5), 2)
            )
            this.scene.add(box)
            this.boxes.push(box)
        }
    }

    destroyModel()
    {
        for(let i = 0; i < this.boxes.length; i++)
        {
            this.scene.remove(this.boxes[i])
            this.boxes[i].geometry.dispose()
            this.boxes[i].material.dispose()
            this.boxes[i] = undefined
        }
    }
}