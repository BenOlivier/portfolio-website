import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default class Camera
{
    constructor()
    {
        this.experience = window.experience;
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;

        this.setCamera();
    }

    setCamera()
    {
        this.camera = new THREE.PerspectiveCamera(35,
            this.sizes.width / this.sizes.height, 0.1, 100);
        this.camera.position.set(0, 0, 3);
        this.scene.add(this.camera);

        this.controls = new OrbitControls(this.camera, this.canvas);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.2;
        this.controls.enablePan = false;
        this.controls.enableZoom = false;
    }

    update()
    {
        this.controls.update();
    }

    resize()
    {
        this.camera.aspect = this.sizes.width / this.sizes.height;
        this.camera.updateProjectionMatrix();
    }
}
