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
        this.pointer = this.experience.pointer;
        this.time = this.experience.time;

        this.autoRotate = true;
        this.timer = 0;

        this.canvas.addEventListener('click', () => { this.pauseRotation(); });
        this.canvas.addEventListener('touchend', () => { this.pauseRotation(); });

        this.setCamera();
    }

    setCamera()
    {
        this.camera = new THREE.PerspectiveCamera(35,
            this.sizes.width / this.sizes.height, 0.1, 100);
        this.camera.position.set(0, 0, 2);
        this.scene.add(this.camera);

        this.controls = new OrbitControls(this.camera, this.canvas);
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = -2;
        this.controls.enablePan = false;
        this.controls.enableZoom = false;
    }

    update()
    {
        this.controls.update();
        if (!this.autoRotate)
        {
            this.timer += this.time.delta;
            if (this.timer > 3000)
            {
                this.controls.autoRotate = true;
                this.autoRotate = true;
            }
        }
    }

    pauseRotation()
    {
        this.controls.autoRotate = false;
        this.autoRotate = false;
        this.timer = 0;
    }

    resize()
    {
        this.camera.aspect = this.sizes.width / this.sizes.height;
        this.camera.updateProjectionMatrix();
    }
}
