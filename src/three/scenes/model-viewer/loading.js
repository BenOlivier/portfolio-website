import * as THREE from 'three'
import gsap from 'gsap'

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

    setOverlay()
    {
        this.overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1)
        this.overlayMaterial = new THREE.ShaderMaterial({
            transparent: true,
            uniforms:
            {
                uAlpha: { value: 1 },
                uColor: { value: new THREE.Color('#1a1a1a') }
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

    fadeOverlay(_value, _duration)
    {
        gsap.to(this.overlayMaterial.uniforms.uAlpha, {
            value: _value,
            duration: _duration,
            ease: 'power1.in'
        })
    }
}