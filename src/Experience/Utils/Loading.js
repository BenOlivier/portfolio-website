import * as THREE from 'three'
import { MathUtils } from 'three'
import Experience from '../Experience.js'

export default class Loading
{
    constructor()
    {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.time = this.experience.time
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas
        this.renderer = this.experience.renderer
        this.debug = this.experience.debug

        // Events
        this.sizes.on('resize', () =>
        {
            this.resize()
        })
        this.time.on('tick', () =>
        {
            if(this.loadingBar) this.updateLoadingBar()
        })

        // Parameters
        this.params = {
            loadingBarSmoothing: 0.01,
            loadingBarProgress: 0.0
        }

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('loading')
        }
        
        this.setLoadingBar()
        this.setOverlay()
    }

    setOverlay()
    {
        this.overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1)
        this.overlayMaterial = new THREE.ShaderMaterial({
            transparent: true,
            uniforms:
            {
                uAlpha: { value: 1 }
            },
            vertexShader: `
                void main()
                {
                    gl_Position = vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float uAlpha;
                void main()
                {
                    gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
                }
            `
        })

        this.overlay = new THREE.Mesh(this.overlayGeometry, this.overlayMaterial)
        this.overlay.renderOrder = 0
        this.scene.add(this.overlay)
    }

    setLoadingBar()
    {
        console.log('set loading bar')
        
        this.loadingBarGeometry = new THREE.PlaneGeometry(0.2, 0.01, 1, 1)
        this.loadingBarMaterial = new THREE.ShaderMaterial({
            transparent: true,
            uniforms:
            {
                uProgress: { value: this.params.loadingBarProgress },
                uAlpha: { value: 1.0 },
                uResolution: { value: new THREE.Vector2(this.sizes.width, this.sizes.height) }
            },
            vertexShader: `
            uniform vec2 uResolution;
            varying vec2 vUv;

            void main()
            {
                gl_Position = vec4(position, 1.0);
                vUv = uv;
            }`,
            fragmentShader: `
            uniform float uProgress;
            uniform float uAlpha;
            uniform vec2 uResolution;
            varying vec2 vUv;

            void main()
            {
                float fragColor = step(vUv.x, uProgress);
                gl_FragColor = vec4(vec3(fragColor), uAlpha);
            }`
        })

        this.loadingBar = new THREE.Mesh(this.loadingBarGeometry, this.loadingBarMaterial)
        this.loadingBar.renderOrder = 999
        this.loadingBar.position.set(0, 2, 0)
        this.scene.add(this.loadingBar)

        if(this.debug.active)
        {
            this.debugFolder
            .add(this.params, 'loadingBarProgress')
            .name('loadingBarProgress')
            .min(0)
            .max(1)
            .step(0.01)
            .onChange(val => { this.loadingBarMaterial.uniforms.uProgress.value = val })
        }
    }

    updateLoadingBar()
    {
        if(this.experience.resources.progressRatio == 0)
        {
            this.loadingBarMaterial.uniforms.uProgress.value += 0.0005
        }
        else
        {
            this.loadingBarMaterial.uniforms.uProgress.value += this.experience.resources.progressRatio
                * this.params.loadingBarSmoothing
        }
    }

    fadeLoadingBar()
    {
        let barAlpha = 1
        let interval = setInterval(() =>
        {
            this.loadingBarMaterial.uniforms.uAlpha.value = animateFade(barAlpha)
        }, 10)

        function animateFade()
        {
            if(barAlpha > 0)
            {
                barAlpha -= 0.05
                return barAlpha
            }
            else
            {
                clearInterval(interval)
                return 0
            }
        }
    }

    fadeOverlay()
    {
        let overlayAlpha = 1
        let interval = setInterval(() =>
        {
            this.overlayMaterial.uniforms.uAlpha.value = animateFade(overlayAlpha)
        }, 10)

        function animateFade()
        {
            if(overlayAlpha > 0)
            {
                overlayAlpha -= 0.01
                return overlayAlpha
            }
            else
            {
                clearInterval(interval)
                return 0
            }
        }
    }

    resize()
    {
        this.loadingBarMaterial.uniforms.uResolution.value.x
            = this.sizes.width
        this.loadingBarMaterial.uniforms.uResolution.value.y
            = this.sizes.height
    }

    destroy()
    {
        this.scene.remove(this.loadingBar)
        this.scene.remove(this.overlay)
        this.overlayGeometry.dispose()
        this.loadingBarGeometry.dispose()
        this.overlayMaterial.dispose()
        this.loadingBarMaterial.dispose()

        console.log('destroyed')
    }
}