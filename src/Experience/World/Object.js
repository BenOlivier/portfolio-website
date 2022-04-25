import * as THREE from 'three'
import Experience from '../Experience.js'
import overlayVertexShader from '../Shaders/Overlay/vertex.glsl'
import overlayFragmentShader from '../Shaders/Overlay/fragment.glsl'
import gsap from 'gsap'
import { Quaternion, Vector3 } from 'three'

export default class Object
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.sizes = this.experience.sizes
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.pointer = this.experience.pointer
        this.camera = this.experience.camera

        // Parameters
        this.params = {
            objectScale: 0.5,
            rotationSmoothing: 0.005,
            rotationExtent: 100,

            overlayFadeTime: 0.2,
            overlayAlpha: 0.5,

            aboutHoverX: -5,
            aboutHoverY: 2,
            aboutHoverZ: 4,

            workHoverX: -6,
            workHoverY: 1.2,
            workHoverZ: 4,

            contactHoverX: -5,
            contactHoverY: 0.8,
            contactHoverZ: 5,

            aboutClickX: 0,
            aboutClickY: 2.5,
            aboutClickZ: 2,

            workClickX: -1.2,
            workClickY: 1.2,
            workClickZ: 0,

            contactClickX: 0,
            contactClickY: 0,
            contactClickZ: 4
        }

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('object')
        }
        
        // Resource
        this.resource = this.resources.items.objectModel

        this.setModel()
        this.setRaycaster()
    }

    setModel()
    {
        this.model = this.resource.scene
        this.model.scale.set(this.params.objectScale,
            this.params.objectScale, this.params.objectScale)
        // this.model.rotation.y = Math.PI * 0.25

        this.overlays = this.model.children[0].children[1]
        this.overlay1 = this.overlays.children[0].children[0]
        this.overlay2 = this.overlays.children[1].children[0]
        this.overlay3 = this.overlays.children[2].children[0]

        this.text1 = this.overlays.children[0].children[1]
        this.text2 = this.overlays.children[1].children[1]
        this.text3 = this.overlays.children[2].children[1]

        // this.text1.visible = false
        // this.text2.visible = false
        // this.text3.visible = false

        this.debugObject = {}
        this.debugObject.overlay1Color = '#ff8e7a'
        this.debugObject.overlay2Color = '#9eee81'
        this.debugObject.overlay3Color = '#99bbff'
        
        this.overlay1Material = new THREE.ShaderMaterial({
            transparent: true,
            uniforms:
            {
                uAlpha: { value: 0 },
                uColor: { value: new THREE.Color(this.debugObject.overlay1Color) }
            },
            vertexShader: overlayVertexShader,
            fragmentShader: overlayFragmentShader
        })

        this.overlay2Material = this.overlay1Material.clone()
        this.overlay2Material.uniforms.uColor.value = new THREE.Color(this.debugObject.overlay2Color)

        this.overlay3Material = this.overlay1Material.clone()
        this.overlay3Material.uniforms.uColor.value = new THREE.Color(this.debugObject.overlay3Color)

        this.overlay1.material = this.overlay1Material
        this.overlay2.material = this.overlay2Material
        this.overlay3.material = this.overlay3Material


        this.scene.add(this.model)

        // Debug
        if(this.debug.active)
        {
            this.debugFolder
                .add(this.params, 'objectScale')
                .name('objectScale')
                .min(0)
                .max(20)
                .step(0.1)
                .onChange(() =>
                {
                    this.model.scale.set(this.params.objectScale,
                        this.params.objectScale, this.params.objectScale)
                })
            
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

            this.debugFolder.addColor(this.debugObject, 'overlay1Color').name('overlay1Color').onChange(() =>
            {
                (this.overlay1Material.uniforms.uColor.value.set(this.debugObject.overlay1Color))
            })
            this.debugFolder.addColor(this.debugObject, 'overlay2Color').name('overlay2Color').onChange(() =>
            {
                (this.overlay2Material.uniforms.uColor.value.set(this.debugObject.overlay2Color))
            })
            this.debugFolder.addColor(this.debugObject, 'overlay3Color').name('overlay3Color').onChange(() =>
            {
                (this.overlay3Material.uniforms.uColor.value.set(this.debugObject.overlay3Color))
            })
        }
    }

    setRaycaster()
    {
        this.raycaster = new THREE.Raycaster()
        this.mainMenu = true
        window.addEventListener('mousemove', (event) => {
            if(this.mainMenu)
            {
                this.castRay()
            }
        })

        window.addEventListener('click', () =>
        {
            if(this.currentIntersect)
            {
                switch(this.currentIntersect.object)
                {
                    case this.overlay1:
                        this.camera.moveCamera(new THREE.Vector3(this.params.aboutClickX,
                            this.params.aboutClickY, this.params.aboutClickZ), new THREE.Quaternion(0, 0, 0, 0))
                        break

                    case this.overlay2:
                        this.camera.moveCamera(new THREE.Vector3(this.params.workHoverX,
                            this.params.workClickY, this.params.workClickZ), new THREE.Quaternion(0, -0.7071068, 0, 0.7071068))
                        break

                    case this.overlay3:
                        this.camera.moveCamera(new THREE.Vector3(this.params.contactClickX,
                            this.params.contactClickY, this.params.contactClickZ), new THREE.Quaternion(0, 0, 0, 0))
                        break
                }
                this.fadeOutOverlay()
                this.currentIntersect = null
                this.mainMenu = false
            }
            else
            {
                if(!this.mainMenu)
                {
                    this.resetCamera()
                    this.mainMenu = true
                }
            }
        })
    }

    castRay()
    {
        this.raycaster.setFromCamera(this.pointer.pointerPos, this.camera.camera)
        this.intersects = this.raycaster.intersectObjects([this.overlay1, this.overlay2, this.overlay3])

        if(this.intersects.length)
        {
            if(this.currentIntersect == null)
            {
                this.currentIntersect = this.intersects[0]

                gsap.to(this.currentIntersect.object.material.uniforms.uAlpha, {
                    duration: this.params.overlayFadeTime,
                    ease: "power1.out",
                    value: this.params.overlayAlpha
                })
            }
        }
        else
        {
            if(this.currentIntersect)
            {
                this.fadeOutOverlay()
                this.resetCamera()
                this.currentIntersect = null
            }
        }
    }

    fadeOutOverlay()
    {
        gsap.to(this.currentIntersect.object.material.uniforms.uAlpha, {
            duration: this.params.overlayFadeTime,
            ease: "power1.out",
            value: 0
        })
    }

    resetCamera()
    {
        this.camera.moveCamera(new Vector3(this.camera.defaultPosition.x, this.camera.defaultPosition.y,
            this.camera.defaultPosition.z), this.camera.defaultOrientation)
        
        console.log('reset')
    }
}