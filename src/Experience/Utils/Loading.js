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
            // if(this.loadingBar.parent == this.scene) this.updateLoadingBar()
        })
        
        // this.setLoadingBar()
    }

    initiateLoadedSequence()
    {
        // // Fade out loading bar
        // setTimeout(() => {
        //     this.fadeLoadingBar()
        // }, 250)
        // // Destroy loading bar and overlay
        // setTimeout(() => {
        //     this.destroy()
        // }, 2200)

        // Animate in hello
        this.model = this.experience.object.model
        gsap.to(this.model.position, {
            duration: 1,
            ease: "elastic.out(1, 1.2)",
            x: 0,
            y: 0,
            z: 0
        })

        // Fade in floor
        this.floor = this.experience.environment.floor
        gsap.to(this.floor.material.uniforms.uAlpha, {
            duration: 1,
            ease: "sine.inOut",
            value: 0.5
        })
    }

    // setLoadingBar()
    // {
    //     this.loadingBarWidth = 0.5

    //     if(this.sizes.width > 1000)
    //     {
    //         this.loadingBarWidth = 300 / this.sizes.width
    //     }
        
    //     this.loadingBarGeometry = new THREE.PlaneGeometry(this.loadingBarWidth,
    //         this.sizes.height * 0.00001, 1, 1)
    //     this.loadingBarMaterial = new THREE.ShaderMaterial({
    //         transparent: true,
    //         uniforms:
    //         {
    //             uProgress: { value: 0.0 },
    //             uAlpha: { value: 1.0 },
    //             uResolution: { value: new THREE.Vector2(this.sizes.width, this.sizes.height) }
    //         },
    //         vertexShader: `
    //             varying vec2 vUv;

    //             void main()
    //             {
    //                 gl_Position = vec4(position, 1.0);
    //                 vUv = uv;
    //             }
    //         `,
    //         fragmentShader: `
    //             uniform float uProgress;
    //             uniform float uAlpha;
    //             varying vec2 vUv;

    //             void main()
    //             {
    //                 float fragColor = step(vUv.x, uProgress);
    //                 gl_FragColor = vec4(vec3(fragColor), uAlpha);
    //             }
    //         `
    //     })

    //     this.loadingBar = new THREE.Mesh(this.loadingBarGeometry, this.loadingBarMaterial)
    //     this.loadingBar.renderOrder = 999
    //     this.loadingBar.position.set(0, 2, 0)
    //     this.scene.add(this.loadingBar)
    // }

    // updateLoadingBar()
    // {
    //     if(this.experience.resources.progressRatio == 0)
    //     {
    //         this.loadingBarMaterial.uniforms.uProgress.value += 0.002
    //     }
    //     else
    //     {
    //         this.loadingBarMaterial.uniforms.uProgress.value +=
    //             this.experience.resources.progressRatio * 0.05
    //     }
    // }

    // resize()
    // {
    //     this.loadingBarMaterial.uniforms.uResolution.value.x
    //         = this.sizes.width
    //     this.loadingBarMaterial.uniforms.uResolution.value.y
    //         = this.sizes.height
    // }

    // destroy()
    // {
    //     this.scene.remove(this.loadingBar)
    //     this.scene.remove(this.overlay)
    //     this.overlayGeometry.dispose()
    //     this.loadingBarGeometry.dispose()
    //     this.overlayMaterial.dispose()
    //     this.loadingBarMaterial.dispose()
    // }
}