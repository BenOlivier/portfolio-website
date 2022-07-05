import * as THREE from 'three'

export default class Loading
{
    constructor()
    {
        this.experience = window.experience
        this.sizes = this.experience.sizes
        this.time = this.experience.time
        this.scene = this.experience.scene
        this.setOverlay()
    }

    initiateLoadedSequence()
    {
        // Fade out overlay
        setTimeout(() => {
            this.fadeOverlay()
        }, 0)
        // Destroy overlay
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
                uColor: { value: new THREE.Color('#f8f8f8') }
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
        this.scene.add(this.overlay)
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

    destroy()
    {
        this.scene.remove(this.overlay)
        this.overlayGeometry.dispose()
        this.overlayMaterial.dispose()
    }

}