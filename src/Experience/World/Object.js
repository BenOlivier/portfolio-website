import * as THREE from 'three'
import Experience from '../Experience.js'
import overlayVertexShader from '../Shaders/Overlay/vertex.glsl'
import overlayFragmentShader from '../Shaders/Overlay/fragment.glsl'

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
            rotationExtent: 100
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

        this.overlays = this.model.children[0].children[1]
        this.overlay1 = this.overlays.children[0].children[0]
        this.overlay2 = this.overlays.children[1].children[0]
        this.overlay3 = this.overlays.children[2].children[0]

        this.text1 = this.overlays.children[0].children[1]
        this.text2 = this.overlays.children[1].children[1]
        this.text3 = this.overlays.children[2].children[1]
        
        this.overlay1.visible = false
        this.overlay2.visible = false
        this.overlay3.visible = false

        // this.text1.visible = false
        // this.text2.visible = false
        // this.text3.visible = false


        this.overlayMaterial = new THREE.ShaderMaterial({
            transparent: true,
            uniforms:
            {
                uAlpha: { value: 0.4 }
            },
            vertexShader: overlayVertexShader,
            fragmentShader: overlayFragmentShader
        })

        this.overlay1.material = this.overlayMaterial
        this.overlay2.material = this.overlayMaterial
        this.overlay3.material = this.overlayMaterial


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
        }
    }

    setRaycaster()
    {
        this.raycaster = new THREE.Raycaster()

        window.addEventListener('mousemove', (event) =>
        {
            this.castRays()
        })
    }

    castRays()
    {
        this.raycaster.setFromCamera(this.pointer.pointerPos, this.camera.camera)
        this.intersects = this.raycaster.intersectObjects([this.overlay1, this.overlay2, this.overlay3])

        if(this.intersects.length)
        {
            if(this.currentIntersect == null)
            {
                this.currentIntersect = this.intersects[0]
                this.currentIntersect.object.visible = true

                if(this.currentIntersect.object == this.overlay1)
                {
                    // this.fadeOverlay()
                }
                else if(this.currentIntersect.object == this.overlay2)
                {
                    
                }
                else if(this.currentIntersect.object == this.overlay3)
                {
                    
                }
            }
        }
        else
        {
            if(this.currentIntersect)
            {
                this.currentIntersect.object.visible = false
                this.currentIntersect = null
            }
        }
    }

    fadeOverlay()
    {
        let overlayAlpha = 0
        let fadeInTime = 1
        let interval = setInterval(() =>
        {
            // this.overlayMaterial1.uniforms.uAlpha.value = animateFade(overlayAlpha)
        }, 10)

        function animateFade()
        {
            if(overlayAlpha < 1)
            {
                overlayAlpha += 1 / (fadeInTime * 100)
                return overlayAlpha
            }
            else
            {
                clearInterval(interval)
                return 1
            }
        }
    }
}