import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Loading
{
    constructor()
    {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas
        this.renderer = this.experience.renderer
        this.debug = this.experience.debug

        // Parameters
        this.params = {
            
        }

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('loading')
        }
        
        // this.setLoadingBar()
        this.setOverlay()
    }

    setOverlay()
    {
        this.overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1)
        this.overlayMaterial = new THREE.ShaderMaterial({
            transparent: true,
            // depthFunc: THREE.GreaterEqualDepth,
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
        this.loadingBarGeometry = new THREE.PlaneGeometry(2, 0.02, 1, 1)
        this.loadingBarMaterial = new THREE.ShaderMaterial({
            depthTest: false,
            depthWrite: true,
            // depthFunc: THREE.GreaterEqualDepth,
            uniforms:
            {
                completion: { value: 0 }
            },
            vertexShader: `
                void main()
                {
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                void main()
                {
                    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
                }
            `
        })

        this.loadingBar = new THREE.Mesh(this.loadingBarGeometry, this.loadingBarMaterial)
        this.loadingBar.renderOrder = 999
        this.scene.add(this.loadingBar)
    }

    fadeOverlay()
    {
        let alpha = 1
        let interval = setInterval(() =>
        {
            this.overlayMaterial.uniforms.uAlpha.value = fade(alpha)
        }, 10)

        function fade()
        {
            if(alpha > 0)
            {
                alpha -= 0.01
                return alpha
            }
            else
            {
                clearInterval(interval)
                return 0
            }
        }
    }

    
}