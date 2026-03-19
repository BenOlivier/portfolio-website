import * as THREE from 'three';

export default class Camera
{
    constructor()
    {
        this.experience = window.experience;
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;

        this.setCamera();
    }

    setCamera()
    {
        this.baseZ = 3;
        this.baseHeight = this.sizes.height;
        this.camera = new THREE.PerspectiveCamera(35,
            this.sizes.width / this.sizes.height, 0.1, 100);
        this.camera.position.set(0, 0, this.baseZ);
        this.scene.add(this.camera);
    }

    update()
    {
    }

    resize()
    {
        // Adjust camera Z so objects stay the same pixel size
        // regardless of window height — only width changes framing
        this.camera.position.z = this.baseZ * (this.sizes.height / this.baseHeight);
        this.camera.aspect = this.sizes.width / this.sizes.height;
        this.camera.updateProjectionMatrix();
    }
}
