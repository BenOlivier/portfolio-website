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
            this.updateLoadingBar()
        })

        // Parameters
        this.params = {
            loadingBarSmoothing: 0.01,
            loadingBarProgress: 0.5
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
        let progressController = {
            progressValue: 0.4375
        }
        
        this.loadingBarGeometry = new THREE.PlaneGeometry(0.25, 0.01, 1, 1)
        this.loadingBarMaterial = new THREE.ShaderMaterial({
            transparent: true,
            uniforms:
            {
                progress: { value: progressController.progressValue },
                alpha: { value: 1.0 },
                u_resolution: { type: 'v2', value:
                    new THREE.Vector2(this.sizes.width, this.sizes.height) }
            },
            vertexShader: `
            uniform vec2 u_resolution;    
            void main()
                {
                    // gl_Position = vec4((position.x / u_resolution.x) * 100.0,
                    //     (position.y / u_resolution.y) * 500.0, position.z, 1.0);

                    gl_Position = vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float progress;
                uniform float alpha;
                uniform vec2 u_resolution;
                float plot(vec2 st, float pct)
                {
                    return  smoothstep(pct - 0.02, pct, st.y) -
                        smoothstep(pct, pct + 0.02, st.y);
                }
                void main()
                {
                    vec2 st = gl_FragCoord.xy / u_resolution;
                    
                    float y = step(st.x, progress);
                    vec3 color = vec3(y);

                    float pct = plot(st, y);
                    color = (1.0 - pct) * color
                        + pct * vec3(0.0,1.0,0.0);

                    gl_FragColor = vec4(color,alpha);
                }
            `
        })

        this.loadingBar = new THREE.Mesh(this.loadingBarGeometry, this.loadingBarMaterial)
        this.loadingBar.renderOrder = 999
        this.loadingBar.position.set(0, 2, 0)
        this.scene.add(this.loadingBar)

        this.debugFolder
                .add(this.params, 'loadingBarProgress')
                .name('loadingBarProgress')
                .min(0)
                .max(1)
                .step(0.01)
                .onChange(val => { this.loadingBarMaterial.uniforms.progress.value = val })
    }

    updateLoadingBar()
    {
        if(this.experience.resources.progressRatio == 0)
        {
            this.loadingBarMaterial.uniforms.progress.value += 0.0005
        }
        else
        {
            this.loadingBarMaterial.uniforms.progress.value +=
                MathUtils.lerp(0.4375, 0.5625, this.experience.resources.progressRatio)
                * this.params.loadingBarSmoothing
        }
    }

    fadeLoadingBar()
    {
        let barAlpha = 1
        let interval = setInterval(() =>
        {
            this.loadingBarMaterial.uniforms.alpha.value = animateFade(barAlpha)
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
        this.loadingBarMaterial.uniforms.u_resolution.value.x
            = this.sizes.width
        this.loadingBarMaterial.uniforms.u_resolution.value.y
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