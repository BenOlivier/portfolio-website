import * as THREE from 'three';

export default class Renderer
{
    constructor()
    {
        this.experience = window.experience;
        this.canvas = this.experience.canvas;
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.camera = this.experience.camera;

        this.setRenderer();
    }

    setRenderer()
    {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true,
        });
        this.renderer.physicallyCorrectLights = true;
        this.renderer.outputEncoding = THREE.LinearEncoding;
        this.renderer.toneMapping = THREE.CineonToneMapping;
        this.renderer.toneMappingExposure = 3;
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));
    }

    resize()
    {
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));
    }

    update()
    {
        this.renderer.render(this.scene, this.camera.camera);
    }
}
