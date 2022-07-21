import * as THREE from 'three';

export default class Environment
{
    constructor()
    {
        this.experience = window.experience;
        this.canvas = this.experience.canvas;
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.renderer = this.experience.renderer;

        this.setEnvironmentMaps();
    }

    setEnvironmentMaps()
    {
        const pmremGenerator = new THREE.PMREMGenerator(this.renderer.renderer);
        pmremGenerator.compileEquirectangularShader();
        const envMap = pmremGenerator.fromEquirectangular(this.resources.items.HDRI).texture;
        this.scene.environment = envMap;
        this.resources.items.HDRI.dispose();
        pmremGenerator.dispose();
    }
}
