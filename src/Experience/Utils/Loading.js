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

        // Resize event
        this.sizes.on('resize', () =>
        {
            this.resize()
        })
        
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
        this.loadingBarGeometry = new THREE.PlaneGeometry(0.5, 0.01, 1, 1)
        this.loadingBarMaterial = new THREE.ShaderMaterial({
            transparent: true,
            uniforms:
            {
                completion: { value: 0.75 },
                u_resolution: { type: 'v2', value:
                    new THREE.Vector2(this.sizes.width, this.sizes.height) }
            },
            vertexShader: `
                void main()
                {
                    gl_Position = vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float completion;
                uniform vec2 u_resolution;
                float plot(vec2 st, float pct)
                {
                    return  smoothstep(pct - 0.02, pct, st.y) -
                        smoothstep(pct, pct + 0.02, st.y);
                }
                void main()
                {
                    vec2 st = gl_FragCoord.xy / u_resolution;
                    
                    float y = step(st.x, completion);
                    vec3 color = vec3(y);

                    float pct = plot(st, y);
                    color = (1.0 - pct) * color
                        + pct * vec3(1.0,1.0,1.0);

                    gl_FragColor = vec4(color,1.0);
                }
            `
        })

        this.loadingBar = new THREE.Mesh(this.loadingBarGeometry, this.loadingBarMaterial)
        this.loadingBar.renderOrder = 999
        this.loadingBar.position.set(0, 2, 0)
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

    resize()
    {
        this.loadingBarMaterial.uniforms.u_resolution.value.x
            = this.sizes.width
        this.loadingBarMaterial.uniforms.u_resolution.value.y
            = this.sizes.height
    }
}