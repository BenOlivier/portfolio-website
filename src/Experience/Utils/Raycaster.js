import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Raycaster
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.pointer = this.experience.pointer
        this.camera = this.experience.camera
        this.objects = this.experience.objects

        this.raycaster = new THREE.Raycaster()
    }

    castRay()
    {
        this.raycaster.setFromCamera(this.pointer.pointerPos, this.camera.camera)
        this.intersects = this.raycaster.intersectObjects([
            this.objects.dioramaSquares[0],
            this.objects.dioramaSquares[1],
            this.objects.dioramaSquares[2],
            this.objects.dioramaSquares[3],
            this.objects.dioramaSquares[4],
            this.objects.dioramaSquares[5],
            this.objects.dioramaSquares[6],
            this.objects.dioramaSquares[7],
            this.objects.dioramaSquares[8]
        ])

        if(this.intersects.length)
        {
            console.log('hit ' + this.intersects[0])
        }
    }
}