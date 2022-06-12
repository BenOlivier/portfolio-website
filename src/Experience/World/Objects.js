import * as THREE from 'three'
import Experience from '../Experience.js'
import wavyCircleVertexShader from '../Shaders/WavyCircle/vertex.glsl'
import wavyCircleFragmentShader from '../Shaders/WavyCircle/fragment.glsl'

export default class Objects
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.sizes = this.experience.sizes
        this.resources = this.experience.resources
        this.pointer = this.experience.pointer
        this.time = this.experience.time
        this.debug = this.experience.debug

        // Parameters
        this.params = {
            rotationSmoothing: 0.2,
            rotationExtent: 0.2
        }

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('object')
        }

        // Reset timer on mouse move
        this.timer = 0
        this.pointer.on('mousemove', () => { this.timer = 0 })

        // Resize event
        this.sizes.on('resize', () => { this.resize() })
        
        // Resources
        this.helloResource = this.resources.items.hello
        this.hello_albedo = this.resources.items.hello_albedo
        this.hello_albedo.wrapS = THREE.RepeatWrapping
        this.hello_albedo.wrapT = THREE.RepeatWrapping
        this.hello_albedo.repeat.set(0.15, 0.15)
        this.lithoResource = this.resources.items.litho
        this.profileMap = this.resources.items.profile
        this.squashMap = this.resources.items.squash
        this.cookingMap = this.resources.items.cooking
        this.londonResource = this.resources.items.london

        this.setModels()
    }

    setModels()
    {
        this.group = new THREE.Group()
        this.scale = this.sizes.width < 1400? this.sizes.width / 1400 : 1
        
        // Hello
        this.hello = this.helloResource.scene
        this.helloMat = new THREE.MeshBasicMaterial({
            map: this.hello_albedo,
            side: THREE.DoubleSide,
            toneMapped: false,
            transparent: true,
            depthTest: false
        })
        this.helloMat.map.offset.x = 0.35
        this.hello.traverse((o) => { if (o.isMesh) o.material = this.helloMat })
        this.hello.scale.set(this.scale, this.scale, this.scale)
        this.hello.position.set(0, 0, 0)
        this.group.add(this.hello)

        this.colors = {
            profileColor: "#ff0000",
            squashColor: "#00ff00",
            cookingColor: "#0000ff"
        }

        // Profile
        this.profileGeometry = new THREE.PlaneBufferGeometry(0.7, 0.7, 16, 16)
        this.profileMat = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0.0 },
                uWaveMagnitude: { value: 0.04 },
                uWaveFrequency: { value: new THREE.Vector2(10, 0.2) },
                uWaveSpeed: { value: 0.001 },
                uColorMap: { value: this.profileMap },
                uCirleColor: { value: new THREE.Vector3(0.0, 0.0, 0.5) },
                uCircleScale: { value: 0.0 },
                uMapOffset: { value: new THREE.Vector2(-0.35, 0.0) },
                uMapScale: { value: new THREE.Vector2(1.6, 1.2) }
            },
            vertexShader: wavyCircleVertexShader,
            fragmentShader: wavyCircleFragmentShader,
            transparent: true,
            toneMapped: false,
        })
        this.profile = new THREE.Mesh(this.profileGeometry, this.profileMat)
        this.profile.position.set(0, 0, -0.01)
        this.profile.position.set(3, 0, -2.5)
        this.group.add(this.profile)

        // Hobbies
        // this.hobbiesGeometry = new THREE.PlaneBufferGeometry(0.8, 0.8, 16, 16)
        // this.hobbiesMat = new THREE.ShaderMaterial({
        //     uniforms: {
        //         uTime: { value: 0.0 },
        //         uWaveMagnitude: { value: 0.04 },
        //         uWaveFrequency: { value: new THREE.Vector2(10, 0.2) },
        //         uWaveSpeed: { value: 0.001 },
        //         uColorMap: { value: this.squashMap },
        //         uCirleColor: { value: this.colors.squashColor },
        //         uMapOffset: { value: new THREE.Vector2(0, 0) },
        //         uMapScale: { value: new THREE.Vector2(1.3, 1.3) }
        //     },
        //     vertexShader: wavyTriangleVertexShader,
        //     fragmentShader: wavyTriangleFragmentShader,
        //     transparent: true,
        //     toneMapped: false
        // })
        // this.hobbies = new THREE.Mesh(this.hobbiesGeometry, this.hobbiesMat)
        // this.hobbies.position.set(0, 0.4, 0)
        // this.hobbies.scale.set(0.7, 0.7, 0.7)

        // this.hobbies.position.set(3, 0, -2.5)
        // this.group.add(this.hobbies)

        // Litho
        this.litho = this.lithoResource.scene
        this.litho.scale.set(this.scale, this.scale, this.scale)
        this.litho.position.set(3, 0, -2.5)
        this.litho.children[0].rotation.set(Math.PI * 0.1, Math.PI * -0.15, 0)
        this.group.add(this.litho)

        this.scene.add(this.group)
        this.currentObject = 0
        this.targetQuaternion = new THREE.Quaternion()

        // Debug
        if(this.debug.active)
        {
            this.debugFolder
                .add(this.params, 'rotationSmoothing')
                .name('rotationSmoothing')
                .min(0)
                .max(0.05)
                .step(0.0005)

            this.debugFolder
                .add(this.params, 'rotationExtent')
                .name('rotationExtent')
                .min(0)
                .max(2000)
                .step(10)
        }
    }

    update()
    {
        this.timer += this.time.delta / 1000
        if(this.timer > 1.2)
        {
            this.targetQuaternion.setFromEuler(new THREE.Euler(0, 0, 0))
            this.params.rotationSmoothing = 0.04
        }
        else
        {
            // this.targetQuaternion.setFromEuler(new THREE.Euler
            //     (0 + (-this.pointer.pointerPos.y * this.params.rotationExtent),
            //     0 + (this.pointer.pointerPos.x * this.params.rotationExtent), 0))
            
            this.targetQuaternion.setFromEuler(new THREE.Euler
                (0, 0 + (this.pointer.pointerPos.x * this.params.rotationExtent), 0))

            this.params.rotationSmoothing = 0.2
        }

        // Rotate with mouse position
        this.group.children[this.currentObject].quaternion.slerp
            (this.targetQuaternion, this.params.rotationSmoothing)

        // Offset hello colors
        this.helloMat.map.offset.x -= this.time.delta / 18000
        // this.helloMat.map.offset.x = -this.pointer.pointerPos.x / 4
        // this.hello.scale.set(this.pointer.pointerPos.x * 10, this.pointer.pointerPos.y * 10, 0.5)

        this.profileMat.uniforms.uTime.value += this.time.delta
    }

    resize()
    {
        this.scale = this.sizes.width < 1400? this.sizes.width / 1400 : 1
        this.hello.scale.set(this.scale, this.scale, this.scale)
        this.litho.scale.set(this.scale, this.scale, this.scale)
    }
}