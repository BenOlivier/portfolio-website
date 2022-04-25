import * as THREE from 'three'
import Experience from '../Experience.js'
import overlayVertexShader from '../Shaders/Overlay/vertex.glsl'
import overlayFragmentShader from '../Shaders/Overlay/fragment.glsl'
import gsap from 'gsap'

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
        this.camera = this.experience.camera

        // Parameters
        this.params = {
            objectScale: 0.5,
            rotationSmoothing: 0.005,
            rotationExtent: 100,

            overlayFadeTime: 0.2,
            overlayAlpha: 0.2
        }

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('object')
        }
        
        // Resource
        this.resource = this.resources.items.objectModel

        this.setModel()
    }

    setModel()
    {
        // Model
        this.model = this.resource.scene
        this.overlay1 = this.model.children[0].children[1].children[0]
        this.overlay2 = this.model.children[0].children[1].children[1]
        this.overlay3 = this.model.children[0].children[1].children[2]

        // Materials
        this.debugObject = {
            overlay1Color: '#ff8e7a',
            overlay2Color:'#9eee81',
            overlay3Color: '#99bbff'
        }
        
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

        this.overlay1.children[0].material = this.overlay1Material
        this.overlay2.children[0].material = this.overlay2Material
        this.overlay3.children[0].material = this.overlay3Material

        this.model.scale.set(this.params.objectScale,
            this.params.objectScale, this.params.objectScale)
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

    fadeInOverlay(overlay)
    {
        gsap.to(overlay.material.uniforms.uAlpha, {
            duration: this.params.overlayFadeTime,
            ease: "power1.out",
            value: this.params.overlayAlpha
        })

        gsap.to(overlay.parent.children[1].scale, {
            duration: this.params.overlayFadeTime,
            ease: "power1.out",
            x: 0.65,
            y: 0.65,
            z: 0.65
        })
    }

    fadeOutOverlay(overlay)
    {
        gsap.to(overlay.material.uniforms.uAlpha, {
            duration: this.params.overlayFadeTime,
            ease: "power1.out",
            value: 0
        })

        gsap.to(overlay.parent.children[1].scale, {
            duration: this.params.overlayFadeTime,
            ease: "power1.out",
            x: 0.6,
            y: 0.6,
            z: 0.6
        })
    }
}