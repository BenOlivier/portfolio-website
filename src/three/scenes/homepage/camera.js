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
        this.refFov = 35; // FOV at refHeight
        this.refHeight = 900; // reference screen height in px
        this.heightFovInfluence = 0.8; // 0 = FOV locked to refFov, 1 = fully scales with height
        this.camera = new THREE.PerspectiveCamera(this.fovForHeight(this.sizes.height),
            this.sizes.width / this.sizes.height, 0.1, 100);
        this.camera.position.set(0, 0, 3);
        this.scene.add(this.camera);
    }

    fovForHeight(height)
    {
        const ratio = height / this.refHeight;
        const blend = 1 - this.heightFovInfluence + this.heightFovInfluence * ratio;
        const refTan = Math.tan(THREE.MathUtils.degToRad(this.refFov / 2));
        return THREE.MathUtils.radToDeg(Math.atan(refTan * blend)) * 2;
    }

    update()
    {
    }

    resize()
    {
        this.camera.fov = this.fovForHeight(this.sizes.height);
        this.camera.aspect = this.sizes.width / this.sizes.height;
        this.camera.updateProjectionMatrix();
    }
}
