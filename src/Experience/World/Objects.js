import * as THREE from 'three'
import gsap from 'gsap'
import Experience from '../Experience.js'
import aboutVertexShader from '../Shaders/About/vertex.glsl'
import aboutFragmentShader from '../Shaders/About/fragment.glsl'

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

        // Debug
        if(this.debug.active){ this.debugFolder = this.debug.ui.addFolder('object') }

        // Resize event
        this.screenVec = new THREE.Vector3()
        this.objectPos = new THREE.Vector3()
        this.sizes.on('resize', () => { this.resize() })

        this.setModels()
        this.setRaycaster()
    }

    setModels()
    {
        // Hello
        this.helloResource = this.resources.items.hello
        this.hello_albedo = this.resources.items.hello_albedo
        this.hello_albedo.wrapS = THREE.RepeatWrapping
        this.hello_albedo.wrapT = THREE.RepeatWrapping
        this.hello_albedo.repeat.set(0.15, 0.15)

        this.hello = this.helloResource.scene
        this.helloMat = new THREE.MeshBasicMaterial({
            map: this.hello_albedo,
            side: THREE.DoubleSide,
            toneMapped: false,
            transparent: true,
            depthTest: false
        })
        this.hello.traverse((o) => { if (o.isMesh) o.material = this.helloMat })

        // About
        this.about_albedo = this.resources.items.about
        this.aboutGeo = new THREE.PlaneBufferGeometry(0.7, 0.7, 1, 1)
        this.aboutMat = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0.0 },
                uWaveMagnitude: { value: 0.04 },
                uWaveFrequency: { value: new THREE.Vector2(10.0, 0.2) },
                uWaveSpeed: { value: 0.001 },
                uColorMap: { value: this.about_albedo },
                uCirleColor: { value: new THREE.Vector3(0.0, 0.0, 0.5) },
                uCircleScale: { value: 0.0 },
                uShowTop: { value: 0.0 },
                uMapOffset: { value: new THREE.Vector2(-0.08, 0.15) },
                uMapScale: { value: new THREE.Vector2(1.2, 0.9) }
            },
            vertexShader: aboutVertexShader,
            fragmentShader: aboutFragmentShader,
            transparent: true,
            toneMapped: false,
            depthTest: false
        })
        this.about = new THREE.Mesh(this.aboutGeo, this.aboutMat)
        this.about.visible = false

        // Litho
        this.lithoResource = this.resources.items.litho
        this.litho = this.lithoResource.scene
        this.litho.children[0].scale.set(0, 0, 0)
        this.litho.children[0].children[3].visible = false
        this.litho.visible = false

        // Diorama
        this.orb = this.resources.items.orb
        this.dioramaGeo = new THREE.PlaneBufferGeometry(0.4, 0.4, 1, 1)
        this.dioramaMat = new THREE.MeshBasicMaterial({
            map: this.orb,
            toneMapped: false
        })
        this.dioramaSquare1 = new THREE.Mesh(this.dioramaGeo, this.dioramaMat)

        this.diorama = new THREE.Group()
        this.diorama.add(this.dioramaSquare1)


        this.resize()
        this.setObjectPos()
        this.group = new THREE.Group()
        this.group.add(this.hello, this.about, this.litho, this.diorama)
        this.scene.add(this.group)
        this.currentObject = 0
        this.targetQuaternion = new THREE.Quaternion()
    }

    setRaycaster()
    {
        this.raycaster = new THREE.Raycaster()
        this.timer = 0

        this.pointer.on('mousemove', () =>
        {
            if(this.currentObject == 2) this.castRay()
            // this.timer = 0
        })

        this.pointer.on('mousedown', () =>
        {
            if(this.currentIntersect)
            {
                if(!this.grabbing)
                {
                    this.touchDownPos = this.pointer.pointerPos.clone()
                    this.startingQuaternion = this.litho.quaternion.clone()
                }
                this.grabbing = true
            }
        })

        this.pointer.on('mouseup', () =>
        {
            this.grabbing = false
            // this.nearestY = new THREE.Euler
            // this.nearestY.setFromQuaternion(this.litho.quaternion)
            this.timer = 0
        })
    }

    castRay()
    {
        this.raycaster.setFromCamera(this.pointer.pointerPos, this.camera.camera)
        this.intersects = this.raycaster.intersectObjects([this.group.children[2]])

        // Hover on Litho
        if(this.intersects.length)
        {
            if(this.currentIntersect == null)
            {
                this.currentIntersect = this.intersects[0]
                document.body.style.cursor = 'grab'
            }
        }
        // Exit hover
        else
        {
            if(this.currentIntersect)
            {
                this.currentIntersect = null
                document.body.style.cursor = 'default'
            }
        }
    }

    update()
    {
        this.timer += this.time.delta / 1000
        
        switch(this.currentObject)
        {
            case 0: //HELLO
                if(this.timer < 1.2) //TODO: After mouse stop
                {
                    this.targetQuaternion.setFromEuler(new THREE.Euler
                        (0, this.pointer.pointerPos.x * 0.4, 0))
                    this.hello.quaternion.slerp(this.targetQuaternion, 0.2)
                }
                else
                {
                    this.targetQuaternion.setFromEuler(new THREE.Euler(0, 0, 0))
                    this.hello.quaternion.slerp(this.targetQuaternion, 0.02)
                }
                
                this.helloMat.map.offset.x += this.time.delta / 18000
                if (this.helloMat.map.offset.x > 1) this.helloMat.map.offset.x = 0
            break
            case 1:
                this.aboutMat.uniforms.uTime.value += this.time.delta
            break
            case 2:
                if(this.grabbing) //TODO: reset matrix each release
                {
                    const dragOffset = new THREE.Vector2(-(this.pointer.pointerPos.y - this.touchDownPos.y) * 4,
                        (this.pointer.pointerPos.x - this.touchDownPos.x) * 4)
                    this.targetQuaternion.setFromEuler(new THREE.Euler(dragOffset.x, dragOffset.y, 0))
                    this.litho.quaternion.slerp(this.startingQuaternion.clone().multiply(this.targetQuaternion), 0.4)
                }
                else if(this.timer > 1.2)//TODO: Closest to last Y rotation + pause on point hover
                {
                    this.targetQuaternion.setFromEuler(new THREE.Euler
                        (Math.sin(this.timer * 0.1) * 0.4, this.timer * 0.2, 0))
                    this.litho.quaternion.slerp(this.targetQuaternion, 0.01)
                }
            break
        }
    }

    resize()
    {
        this.setObjectScale(this.hello, 1)
        this.setObjectScale(this.about, 0.2)
        this.setObjectScale(this.litho, 0.5)

        this.setObjectPos()
        this.animateObject(this.about, this.objectPos)
        this.animateObject(this.litho, this.objectPos)
    }

    setObjectScale(object, factor)
    {
        this.scale = this.sizes.width < 1400? Math.pow(this.sizes.width / 1400, factor) : 1
        object.scale.set(this.scale, this.scale, this.scale)
    }

    setObjectPos()
    {
        if(this.sizes.width > 1000)
        {
            // Right side screen pos (0-1)
            this.screenX = this.sizes.width > 1400?
            350 / ((this.sizes.width - 1400) / 2 + 700) : 0.4
            // Vector projected from screen pos
            this.screenVec.set(this.screenX, 0, 0)
                .unproject(this.camera.camera).sub(this.camera.camera.position).normalize()
            // Object position projected along vector
            this.objectPos.copy(this.camera.camera.position).add(this.screenVec.multiplyScalar(2))


            // console.log(this.screenX)
            // console.log(this.screenVec)
            // console.log(this.objectPos)
        }
        else
        {
            // Vector projected from screen pos
            this.screenVec.set(0, 0.45, 0)
                .unproject(this.camera.camera).sub(this.camera.camera.position).normalize()
            // Object position projected along vector
            this.objectPos.copy(this.camera.camera.position).add(this.screenVec.multiplyScalar(2))
        }
    }

    animateObject(object, position)
    {
        this.isAnimating = true
        gsap.killTweensOf(object.position)
        gsap.to(object.position, {
            x: position.x,
            y: position.y,
            z: position.z,
            duration: 1,
            ease: "power2.out",
            callbackScope: this,
            onComplete: function() { this.isAnimating = false }
        })
    }
}