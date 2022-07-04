import * as THREE from 'three'
import gsap from 'gsap'
import Experience from './experience.js'
import { getPalette } from './color-palettes.js'

function randomInRange(min, max) {
    return Math.random() * (max - min) + min
}

export default class Objects
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.pointer = this.experience.pointer
        this.time = this.experience.time

        this.mouseDown = false
        this.moved = false

        this.pointer.on('mousedown', () =>
        {
            this.mouseDown = true
            this.moved = false
        })
        this.pointer.on('mousemove', () =>
        {
            this.moved = true
        })
        this.pointer.on('mouseup', () =>
        {
            if(!this.moved)
            {
                clearInterval(this.interval)
                this.destroyModel()
                this.setModel()
            }
        })

        this.setModel()
    }

    setModel()
    {
        this.boxes = []
        this.number = 20
        this.distance = 0.5

        for(let i = 0; i < this.number; i++)
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
                randomInRange(-this.distance, this.distance),
                randomInRange(-this.distance, this.distance),
                randomInRange(-this.distance, this.distance)
            )
            this.scene.add(box)
            this.boxes.push(box)
        }

        this.interval = setInterval(() =>
        {
            this.animateCube()
        }, 300)
    }

    animateCube()
    {
        const axis = Math.floor(Math.random() * 3)
        // switch(axis){
        //     case 0: value = new THREE.Vector3(-1, 1, 1)
        //         break
        //     case 1: value = new THREE.Vector3(1, -1, 1)
        //         break
        //     case 2: value = new THREE.Vector3(1, 1, -1)
        //         break
        // }

        const value = new THREE.Vector3(
            axis != 0? 1 : -1,
            axis != 1? 1 : -1,
            axis != 2? 1 : -1
        )
        const index = Math.floor(Math.random() * this.number)
        gsap.to(this.boxes[index].position, {
            x: value.x * this.boxes[index].position.x,
            y: value.y * this.boxes[index].position.y,
            z: value.z * this.boxes[index].position.z,
            duration: 2,
            ease: 'elastic.out(0.1, 0.05)'
        })
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