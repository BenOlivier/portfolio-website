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
        this.debug = this.experience.debug

        // Parameters
        this.params = {
            
        }

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('loading')
        }

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
        this.scene.add(this.overlay)
    }

    fadeOverlay()
    {
        let alpha = 1
        let interval = setInterval(() =>
        {
            fade(this.overlayMaterial.uniforms.uAlpha)
        }, 10)

        function fade()
        {
            if(alpha > 0)
            {
                alpha -= 0.001
                console.log(alpha)
            }
            else
            {
                clearInterval(interval)
            }
        }
        this.overlayMaterial.uniforms.uAlpha = 0
    }

    
}