import * as THREE from 'three'
import gsap from 'gsap'
import Experience from '../Experience.js'
import profileVertexShader from '../Shaders/Profile/vertex.glsl'
import profileFragmentShader from '../Shaders/Profile/fragment.glsl'
import contactVertexShader from '../Shaders/Contact/vertex.glsl'
import contactFragmentShader from '../Shaders/Contact/fragment.glsl'

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

        // Parameters
        this.params = {
            rotationSmoothing: 0.2,
            rotationExtent: 0.4
        }

        // Debug
        if(this.debug.active){ this.debugFolder = this.debug.ui.addFolder('object') }

        // Reset timer on mouse move
        this.timer = 0
        this.pointer.on('mousemove', () => { this.timer = 0 })

        // Resize event
        this.screenVec = new THREE.Vector3()
        this.objectPos = new THREE.Vector3()
        this.sizes.on('resize', () => { this.resize() })
        
        // Resources
        this.helloResource = this.resources.items.hello
        this.lightResource = this.resources.items.light
        this.hello_albedo = this.resources.items.hello_albedo
        this.hello_albedo.wrapS = THREE.RepeatWrapping
        this.hello_albedo.wrapT = THREE.RepeatWrapping
        this.hello_albedo.repeat.set(0.15, 0.15)
        this.lithoResource = this.resources.items.litho
        this.profileMap = this.resources.items.profile

        this.setObjectPos()
        this.setModels()
    }

    setModels()
    {
        this.group = new THREE.Group()
        
        // Hello
        this.hello = this.helloResource.scene
        this.helloMat = new THREE.MeshBasicMaterial({
            map: this.hello_albedo,
            side: THREE.DoubleSide,
            toneMapped: false,
            transparent: true,
            depthTest: false
        })
        this.hello.traverse((o) => { if (o.isMesh) o.material = this.helloMat })

        // Light
        // this.light = this.lightResource.scene
        // this.light.position.set(-1, -1, -3)
        // this.light.scale.set(0.2, 0.2, 0.2)
        // this.light.rotation.set(0, Math.PI * -0.35, 0)

        // Profile
        this.profileGeometry = new THREE.PlaneBufferGeometry(0.7, 0.7, 16, 16)
        this.profileMat = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0.0 },
                uWaveMagnitude: { value: 0.04 },
                uWaveFrequency: { value: new THREE.Vector2(10.0, 0.2) },
                uWaveSpeed: { value: 0.001 },
                uColorMap: { value: this.profileMap },
                uCirleColor: { value: new THREE.Vector3(0.0, 0.0, 0.5) },
                uCircleScale: { value: 0.0 },
                uShowTop: { value: 0.0 },
                uMapOffset: { value: new THREE.Vector2(-0.08, 0.15) },
                uMapScale: { value: new THREE.Vector2(1.2, 0.9) }
            },
            vertexShader: profileVertexShader,
            fragmentShader: profileFragmentShader,
            transparent: true,
            toneMapped: false,
            depthTest: false
        })
        this.profile = new THREE.Mesh(this.profileGeometry, this.profileMat)
        // this.profile.position.set(this.objectPos.x, this.objectPos.y, this.objectPos.z)
        this.profile.visible = false

        // Litho
        this.litho = this.lithoResource.scene
        // this.litho.position.set(this.objectPos.x, this.objectPos.y, this.objectPos.z)
        // this.litho.children[0].rotation.set(Math.PI * 0.1, Math.PI * -0.15, 0)
        this.litho.children[0].scale.set(0, 0, 0)
        this.litho.children[0].children[3].visible = false
        this.litho.visible = false
        // this.pointer.on('mousedown', () => {
        //     if(this.currentObject == 2) this.litho.children[0].children[3].visible = true
        // })
        // this.pointer.on('mouseup', () => {
        //     if(this.currentObject == 2) this.litho.children[0].children[3].visible = false
        // })

        // Contact
        // this.githubGeometry = new THREE.SphereGeometry(0.1, 16, 16)
        // this.githubMat = new THREE.MeshBasicMaterial({ color: '#6E5494' })
        // this.github = new THREE.Mesh(this.githubGeometry, this.githubMat)
        // this.githubPlaneGeo = new THREE.PlaneGeometry(0.2, 0.2, 1, 1)
        // this.githubPlaneMat = new THREE.MeshBasicMaterial({ color: '#ff0000' })
        // this.githubPlane = new THREE.Mesh(this.githubPlaneGeo, this.githubPlaneMat)
        // this.github.add(this.githubPlane)




        this.contactGeometry = new THREE.PlaneBufferGeometry(1, 1, 16, 16)
        this.contactMat = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0.0 },
                uWaveMagnitude: { value: 0.05 },
                uWaveFrequency: { value: new THREE.Vector2(12.0, 0.2) },
                uWaveSpeed: { value: 0.001 },
                uCirleColor: { value: new THREE.Vector3(0.0, 0.0, 0.5) },
                uCircleScale: { value: 0.0 }
            },
            vertexShader: contactVertexShader,
            fragmentShader: contactFragmentShader,
            transparent: true,
            toneMapped: false,
            depthTest: false
        })
        this.contact = new THREE.Mesh(this.contactGeometry, this.contactMat)
        this.profile.visible = false

        this.group = new THREE.Group()
        this.group.add(this.hello, this.profile, this.litho)
        this.resize()
        this.scene.add(this.group)
        this.currentObject = 0
        this.targetQuaternion = new THREE.Quaternion()
        this.setObjectPos()

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
        if(this.currentObject != 1)
        {
            this.timer += this.time.delta / 1000
            if(this.timer > 1.2)
            {
                this.targetQuaternion.setFromEuler(new THREE.Euler(0, 0, 0))
                this.params.rotationSmoothing = 0.04
            }
            else
            {
                if(this.currentObject == 0)
                {
                    this.targetQuaternion.setFromEuler(new THREE.Euler
                        (0, this.pointer.pointerPos.x * this.params.rotationExtent, 0))
                }
                else if(this.currentObject == 2)
                {
                    this.targetQuaternion.setFromEuler(new THREE.Euler
                        (-this.pointer.pointerPos.y * 0.7,
                        this.pointer.pointerPos.x * 0.7, 0))
                }
                this.params.rotationSmoothing = 0.2
            }

            if(this.group.children[this.currentObject] != null)
            {
                // Rotate with mouse position
                this.group.children[this.currentObject].quaternion.slerp
                    (this.targetQuaternion, this.params.rotationSmoothing)
            }
        }

        // Offset hello colors
        if(this.currentObject == 0)
        {
            this.helloMat.map.offset.x += this.time.delta / 18000
            if (this.helloMat.map.offset.x > 1) this.helloMat.map.offset.x = 0
        }

        this.profileMat.uniforms.uTime.value += this.time.delta
        this.contactMat.uniforms.uTime.value += this.time.delta
    }

    resize()
    {
        this.setObjectScale(this.hello, 1)
        this.setObjectScale(this.profile, 0.2)
        this.setObjectScale(this.litho, 0.2)

        this.setObjectPos()
        this.animateObject(this.profile, this.objectPos)
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
        }
        else
        {
            // Vector projected from screen pos
            this.screenVec.set(0, 0.3, 0)
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