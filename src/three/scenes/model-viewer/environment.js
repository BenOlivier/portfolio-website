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

        const settingsButton = document.getElementById('settings-button');
        const envMapThumbs = document.getElementById('envMapThumbs');
        const autoshopThumb = envMapThumbs.children[1];
        const marketThumb = envMapThumbs.children[2];
        const parkThumb = envMapThumbs.children[3];

        autoshopThumb.addEventListener('click', (event) =>
        {
            this.scene.environment = this.envMaps[0];
            this.renderer.renderer.toneMappingExposure = 4;
        });
        marketThumb.addEventListener('click', (event) =>
        {
            this.scene.environment = this.envMaps[1];
            this.renderer.renderer.toneMappingExposure = 4;
        });
        parkThumb.addEventListener('click', (event) =>
        {
            this.scene.environment = this.envMaps[2];
            this.renderer.renderer.toneMappingExposure = 6;
        });

        this.canvas.addEventListener('click', (event) =>
        {
            envMapThumbs.classList.remove('visible');
            settingsButton.classList.remove('hidden');
        });
        this.canvas.addEventListener('touchend', (event) => { envMapThumbs.classList.remove('visible'); });

        this.setEnvironmentMaps();
        this.setFloor();
    }

    setEnvironmentMaps()
    {
        this.envMaps = [];
        const pmremGenerator = new THREE.PMREMGenerator(this.renderer.renderer);
        pmremGenerator.compileEquirectangularShader();
        const autoshopEnvMap = pmremGenerator.fromEquirectangular(this.resources.items.autoshopHDRI).texture;
        const amphitheatreEnvMap = pmremGenerator.fromEquirectangular(this.resources.items.amphitheatreHDRI).texture;
        const decorShopEnvMap = pmremGenerator.fromEquirectangular(this.resources.items.decorShopHDRI).texture;
        this.envMaps.push(autoshopEnvMap, amphitheatreEnvMap, decorShopEnvMap);
        this.scene.environment = this.envMaps[0];
        this.resources.items.autoshopHDRI.dispose();
        this.resources.items.amphitheatreHDRI.dispose();
        this.resources.items.decorShopHDRI.dispose();
        pmremGenerator.dispose();
    }

    setFloor()
    {
        this.floorGeometry = new THREE.PlaneGeometry(3, 3);
        this.floorTexture = this.resources.items.floorTexture;
        this.floorMaterial = new THREE.MeshStandardMaterial({
            map: this.floorTexture,
            transparent: true,
            opacity: 0.1,
        });

        this.floor = new THREE.Mesh(this.floorGeometry, this.floorMaterial);
        this.floor.position.y = -0.8;
        this.floor.rotation.x = - Math.PI * 0.5;
        this.floor.receiveShadow = true;
        this.scene.add(this.floor);
    }
}
