import * as THREE from 'three'
import gsap from 'gsap'
import Experience from '../experience.js'

export default class Objects
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.sizes = this.experience.sizes
        this.resources = this.experience.resources
        this.pointer = this.experience.pointer
        this.camera = this.experience.camera
        this.time = this.experience.time
        this.debug = this.experience.debug

        // Resize event
        this.sizes.on('resize', () => { this.resize() })

        this.setModels()
        // this.setRaycaster()
    }

    setModels()
    {
        // Hello
        this.helloResource = this.resources.items.hello
        this.hello_tex = this.resources.items.hello_tex
        this.hello_tex.wrapS = THREE.RepeatWrapping
        this.hello_tex.wrapT = THREE.RepeatWrapping
        this.hello_tex.repeat.set(0.15, 0.15)

        this.hello2_tex = this.resources.items.hello2_tex
        this.hello2_tex.wrapS = THREE.RepeatWrapping
        this.hello2_tex.wrapT = THREE.RepeatWrapping
        this.hello2_tex.repeat.set(0.15, 0.15)

        this.hello = this.helloResource.scene
        this.helloMat = new THREE.MeshBasicMaterial({
            map: this.hello_tex,
            side: THREE.DoubleSide,
            toneMapped: false,
            transparent: true,
            depthTest: false,
            wireframe: true
        })
        this.hello.traverse((o) => { if (o.isMesh) o.material = this.helloMat })
        this.hello.children[0].scale.set(1.8, 1.8, 1.8)
        this.hello.rotation.z = 0.5

        this.hello2 = this.hello.clone()
        this.hello2Mat = new THREE.MeshBasicMaterial({
            map: this.hello2_tex,
            side: THREE.DoubleSide,
            toneMapped: false,
            transparent: true,
            depthTest: false,
            wireframe: true
        })
        this.hello2.traverse((o) => { if (o.isMesh) o.material = this.hello2Mat })
        this.hello2.children[0].scale.set(2.8, 2.8, 2.8)
        this.hello2.rotation.z = -0.5
        this.hello2.position.z = -1

        this.resize()
        this.group = new THREE.Group()
        this.group.add(this.hello, this.hello2)
        this.scene.add(this.group)
        this.currentObject = 0
        this.targetQuaternion1 = new THREE.Quaternion()
        this.targetQuaternion2 = new THREE.Quaternion()
    }

    update()
    {
        this.targetQuaternion1.setFromEuler(new THREE.Euler
            (0, this.pointer.pointerPos.x * 0.4, 0.5))
        this.hello.quaternion.slerp(this.targetQuaternion1, 0.2)
        this.targetQuaternion2.setFromEuler(new THREE.Euler
            (this.pointer.pointerPos.x * 0.4, 0, -0.5))
        this.hello2.quaternion.slerp(this.targetQuaternion2, 0.2)

        this.helloMat.map.offset.x += this.time.delta / 18000
        if (this.helloMat.map.offset.x > 1) this.helloMat.map.offset.x = 0
        this.hello2Mat.map.offset.x += this.time.delta / 18000
        if (this.hello2Mat.map.offset.x > 1) this.hello2Mat.map.offset.x = 0
    }

    resize()
    {
        this.setObjectScale(this.hello, 1)
    }

    setObjectScale(object, factor)
    {
        this.scale = this.sizes.width < 1400? Math.pow(this.sizes.width / 1400, factor) : 1
        object.scale.set(this.scale, this.scale, this.scale)
    }
}