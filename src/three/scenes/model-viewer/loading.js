import * as THREE from 'three';
import gsap from 'gsap';

export default class Loading
{
    constructor()
    {
        this.experience = window.experience;
        this.sizes = this.experience.sizes;
        this.time = this.experience.time;
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;

        // Events
        this.sizes.on('resize', () =>
        {
            this.resize();
        });
        this.time.on('tick', () =>
        {
            if (this.loadingBar.parent == this.scene) this.updateLoadingBar();
        });

        this.setLoadingBar();
        this.setOverlay();
    }

    initiateLoadedSequence()
    {
        // Fade out loading bar
        setTimeout(() =>
        {
            this.fadeAlpha(this.loadingBarMaterial.uniforms.uAlpha, 0, 1);
        }, 200);
        // Fade out overlay
        setTimeout(() =>
        {
            this.fadeAlpha(this.overlayMaterial.uniforms.uAlpha, 0, 1);
        }, 600);
        // Destroy loading bar and overlay
        setTimeout(() =>
        {
            this.destroy(this.overlay);
            this.destroy(this.loadingBar);
        }, 2000);
    }

    setOverlay()
    {
        this.overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);
        this.overlayMaterial = new THREE.ShaderMaterial({
            transparent: true,
            uniforms:
            {
                uAlpha: { value: 1 },
                uColor: { value: new THREE.Color('#1a1a1a') },
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
            `,
        });

        this.overlay = new THREE.Mesh(this.overlayGeometry, this.overlayMaterial);
        this.overlay.renderOrder = 0;
        this.scene.add(this.overlay);
    }

    setLoadingBar()
    {
        this.loadingBarWidth = 0.5;

        if (this.sizes.width > 1000)
        {
            this.loadingBarWidth = 300 / this.sizes.width;
        }

        this.loadingBarGeometry = new THREE.PlaneGeometry(this.loadingBarWidth,
            this.sizes.height * 0.00001, 1, 1);
        this.loadingBarMaterial = new THREE.ShaderMaterial({
            transparent: true,
            uniforms:
            {
                uProgress: { value: 0.0 },
                uAlpha: { value: 1.0 },
                uResolution: { value: new THREE.Vector2(this.sizes.width, this.sizes.height) },
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
                varying vec2 vUv;
                void main()
                {
                    vec3 barColor = step(vUv.x, uProgress) * vec3(1.0, 1.0, 1.0);
                    vec3 backgroundColor = step(uProgress, vUv.x) * vec3(0.0, 0.0, 0.0);
                    gl_FragColor = vec4(barColor + backgroundColor, uAlpha);
                }
            `,
        });

        this.loadingBar = new THREE.Mesh(this.loadingBarGeometry, this.loadingBarMaterial);
        this.loadingBar.renderOrder = 999;
        this.loadingBar.position.set(0, 0, 0);
        this.scene.add(this.loadingBar);
    }

    updateLoadingBar()
    {
        if (this.resources.progressRatio == 0)
        {
            this.loadingBarMaterial.uniforms.uProgress.value += 0.002;
        }
        else
        {
            this.loadingBarMaterial.uniforms.uProgress.value +=
                this.resources.progressRatio * 0.05;
        }
    }

    fadeAlpha(target, value, duration)
    {
        gsap.to(target, {
            value: value,
            duration: duration,
            ease: 'power1.in',
        });
    }

    resize()
    {
        this.loadingBarMaterial.uniforms.uResolution.value.x =
            this.sizes.width;
        this.loadingBarMaterial.uniforms.uResolution.value.y =
            this.sizes.height;
    }

    destroy(object)
    {
        this.scene.remove(object);
        object.children.forEach(function(child)
        {
            if (child instanceof THREE.Mesh)
            {
                child.geometry.dispose();
                if (child.material && typeof value.dispose === 'function')
                {
                    value.dispose();
                }
            }
        });
    }
}
