import * as THREE from 'three';

export default class Objects
{
    constructor()
    {
        this.experience = window.experience;
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.sizes = this.experience.sizes;
        this.pointer = this.experience.pointer;
        this.camera = this.experience.camera.camera;
        this.canvas = this.experience.canvas;

        this.raycaster = new THREE.Raycaster();
        this.dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        this.intersection = new THREE.Vector3();
        this.offset = new THREE.Vector3();
        this.isDragging = false;
        this.restPosition = new THREE.Vector3(0, 0, 0);

        this.setModel();
        this.setInteraction();
    }

    setModel()
    {
        this.balloonResource = this.resources.items.balloon;
        this.balloon = this.balloonResource.scene;
        this.balloonMat = new THREE.MeshStandardMaterial({
            color: 0x2266cc,
            metalness: 1.0,
            roughness: 0.05,
        });
        this.balloon.traverse((o) => { if (o.isMesh) o.material = this.balloonMat; });
        this.balloon.position.copy(this.restPosition);
        this.scene.add(this.balloon);
    }

    setInteraction()
    {
        this.pointer.on('mousedown', () =>
        {
            this.raycaster.setFromCamera(this.pointer.pointerPos, this.camera);

            const intersects = this.raycaster.intersectObject(this.balloon, true);
            if (intersects.length > 0)
            {
                this.isDragging = true;
                this.canvas.style.cursor = 'grabbing';

                // Set drag plane at balloon's Z depth
                this.dragPlane.constant = -this.balloon.position.z;

                // Calculate offset between click point and balloon centre
                this.raycaster.ray.intersectPlane(this.dragPlane, this.intersection);
                this.offset.copy(this.balloon.position).sub(this.intersection);
            }
        });

        this.pointer.on('mousemove', () =>
        {
            this.raycaster.setFromCamera(this.pointer.pointerPos, this.camera);

            if (this.isDragging)
            {
                this.raycaster.ray.intersectPlane(this.dragPlane, this.intersection);
                this.balloon.position.x = this.intersection.x + this.offset.x;
                this.balloon.position.y = this.intersection.y + this.offset.y;
            }
            else
            {
                const intersects = this.raycaster.intersectObject(this.balloon, true);
                this.canvas.style.cursor = intersects.length > 0 ? 'grab' : '';
            }
        });

        this.pointer.on('mouseup', () =>
        {
            if (this.isDragging)
            {
                this.isDragging = false;
                this.canvas.style.cursor = '';
            }
        });
    }

    update()
    {
        // Ease back to centre when not dragging
        if (!this.isDragging && this.balloon)
        {
            const ease = 1 - Math.pow(0.01, this.time.delta / 1000);
            this.balloon.position.x += (this.restPosition.x - this.balloon.position.x) * ease;
            this.balloon.position.y += (this.restPosition.y - this.balloon.position.y) * ease;
        }
    }
}
