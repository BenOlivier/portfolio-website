import * as THREE from 'three'
import Experience from '../../experience.js'

export default class Hello
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.camera = this.experience.camera
        this.time = this.experience.time
        this.debug = this.experience.debug

        this.setModel()
    }

    setModel()
    {
        this.helloResource = this.resources.items.hello
        this.hello_tex = this.resources.items.hello_tex
        this.hello_tex.wrapS = THREE.RepeatWrapping
        this.hello_tex.wrapT = THREE.RepeatWrapping
        this.hello_tex.repeat.set(0.15, 0.15)

        this.hello = this.helloResource.scene
        // this.helloMat = new THREE.MeshBasicMaterial({
        //     map: this.hello_tex,
        //     side: THREE.DoubleSide,
        //     toneMapped: false,
        //     transparent: true,
        //     depthTest: false
        // })
        // this.hello.traverse((o) => { if (o.isMesh) o.material = this.helloMat })
        this.hello.scale.set(0.8, 0.8, 0.8)
        this.scene.add(this.hello)
    }

    update()
    {
        // this.helloMat.map.offset.x += this.time.delta / 18000
        // if (this.helloMat.map.offset.x > 1) this.helloMat.map.offset.x = 0
    }
}