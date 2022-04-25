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
            rotationExtent: 100,

            overlayFadeTime: 0.5,
            overlayAlpha: 0.5
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

        this.text1.visible = false
        this.text2.visible = false
        this.text3.visible = false

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
                this.fadeOverlay(this.currentIntersect.object, this.params.overlayAlpha)
            }
        }
        else
        {
            if(this.currentIntersect)
            {
                this.fadeOverlay(this.currentIntersect.object, 0)
                this.currentIntersect = null
            }
        }
    }

    // Animate overlay alpha
    fadeOverlay(overlay, target)
    {
        let currentAlpha = overlay.material.uniforms.uAlpha.value
        const fadeTime = this.params.overlayFadeTime
        const targetAlpha = target

        let interval = setInterval(() =>
        {
            overlay.material.uniforms.uAlpha.value = animateFade(currentAlpha)
        }, 10)

        // console.log(interval)

        function animateFade()
        {
            if(target > 0)
            {
                if(currentAlpha < targetAlpha)
                {
                    currentAlpha += 1 / (fadeTime * 100)
                    return currentAlpha
                }
                else
                {
                    clearInterval(interval)
                    return targetAlpha
                }
            }
            else
            {
                if(currentAlpha > targetAlpha)
                {
                    currentAlpha -= 1 / (fadeTime * 100)
                    return currentAlpha
                }
                else
                {
                    clearInterval(interval)
                    return targetAlpha
                }
            }
        }
    }
}