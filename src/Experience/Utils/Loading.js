import * as THREE from 'three'
import Experience from '../Experience.js'
import gsap from 'gsap'

export default class Loading
{
    constructor()
    {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.time = this.experience.time
        this.scene = this.experience.scene

        // Events
        this.sizes.on('resize', () =>
        {
            this.resize()
        })
        this.time.on('tick', () =>
        {
            if(this.loadingBar.parent == this.scene) this.updateLoadingBar()
        })
        
        this.setLoadingBar()
        this.setOverlay()
    }

    initiateLoadedSequence()
    {
        // Fade out loading bar
        setTimeout(() => {
            this.fadeLoadingBar()
        }, 200)
        // Fade out overlay
        this.hello = this.experience.objects.hello
        setTimeout(() => {
            this.fadeOverlay()
        }, 400)
        // Animate hello
        setTimeout(() => {
            gsap.to(this.hello.position, {
                duration: 0.7,
                z: 0,
                ease: "power3.out"
            })
        }, 400)
        // Destroy loading bar and overlay
        setTimeout(() => {
            this.destroy()
        }, 2500)
    }

    setOverlay()
    {
        this.overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1)
        this.overlayMaterial = new THREE.ShaderMaterial({
            transparent: true,
            uniforms:
            {
                uAlpha: { value: 1 },
                uColor: { value: new THREE.Color('#e5e5e5') }
            },
            vertexShader: `
                void main()
                {
                    gl_Position = vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float uAlpha;
                uniform vec3 uColor;
                void main()
                {
                    gl_FragColor = vec4(uColor, uAlpha);
                }
            `
        })

        this.overlay = new THREE.Mesh(this.overlayGeometry, this.overlayMaterial)
        this.overlay.renderOrder = 0
        this.scene.add(this.overlay)
    }

    setLoadingBar()
    {
        this.loadingBarWidth = 0.5

        if(this.sizes.width > 1000)
        {
            this.loadingBarWidth = 300 / this.sizes.width
        }
        
        this.loadingBarGeometry = new THREE.PlaneGeometry(this.loadingBarWidth,
            this.sizes.height * 0.00001, 1, 1)
        this.loadingBarMaterial = new THREE.ShaderMaterial({
            transparent: true,
            uniforms:
            {
                uProgress: { value: 0.0 },
                uAlpha: { value: 1.0 },
                uColor: { value: new THREE.Color('#e5e5e5') },
                uResolution: { value: new THREE.Vector2(this.sizes.width, this.sizes.height) }
            },
            vertexShader: `
                varying vec2 vUv;
                void main()
                {
                    gl_Position = vec4(position, 1.0);
                    vUv = uv;
                }
            `,
            fragmentShader: `
                uniform float uProgress;
                uniform float uAlpha;
                uniform vec3 uColor;
                varying vec2 vUv;
                void main()
                {
                    vec3 barColor = step(vUv.x, uProgress) * vec3(1.0, 1.0, 1.0);
                    vec3 backgroundColor = step(uProgress, vUv.x) * uColor;
                    gl_FragColor = vec4(barColor + backgroundColor, uAlpha);
                }
            `
        })

        this.loadingBar = new THREE.Mesh(this.loadingBarGeometry, this.loadingBarMaterial)
        this.loadingBar.renderOrder = 999
        this.loadingBar.position.set(0, 0, 0)
        this.scene.add(this.loadingBar)
    }

    updateLoadingBar()
    {
        if(this.experience.resources.progressRatio == 0)
        {
            this.loadingBarMaterial.uniforms.uProgress.value += 0.002
        }
        else
        {
            this.loadingBarMaterial.uniforms.uProgress.value +=
                this.experience.resources.progressRatio * 0.05
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
                overlayAlpha -= 1 / 50
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
    }

}