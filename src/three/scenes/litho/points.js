import * as THREE from 'three';

export default class Points
{
    constructor()
    {
        this.experience = window.experience;
        this.objects = this.experience.objects;
        this.camera = this.experience.camera;
        this.sizes = this.experience.sizes;
        this.canvas = this.experience.canvas;

        // Points of interest
        this.points = [
            {
                position: new THREE.Vector3(0, 0.28, 0),
                element: document.getElementById('point-0'),
            },
            {
                position: new THREE.Vector3(0.3, -0.11, 0),
                element: document.getElementById('point-1'),
            },
            {
                position: new THREE.Vector3(-0.3, -0.28, 0),
                element: document.getElementById('point-2'),
            },
        ];
        this.raycaster = new THREE.Raycaster();
    }

    update()
    {
        for (const point of this.points)
        {
            // Point screen position (-1 to 1)
            const screenPosition = point.position.clone();
            screenPosition.project(this.camera.camera);

            this.raycaster.setFromCamera(screenPosition, this.camera.camera);
            const intersects = this.raycaster.intersectObjects([this.objects.litho.children[0]]);
            if (intersects.length == 0)
            {
                point.element.classList.add('visible');
            }
            else
            {
                const intersectionDistance = intersects[0].distance;
                const pointDistance = point.position.distanceTo(this.camera.camera.position);
                if (intersectionDistance < pointDistance)
                {
                    point.element.classList.remove('visible');
                    // point.element.children[1].style.opacity = 0;
                }
                else
                {
                    point.element.classList.add('visible');
                }
            }

            const translateX = this.sizes.width * 0.5 +
                screenPosition.x * this.sizes.width * 0.5 - 20;
            const translateY = this.sizes.height * 0.5 -
                screenPosition.y * this.sizes.height * 0.5 - 20;

            point.element.style.transform = `translate(${translateX}px, ${translateY}px)`;
        }
    }
}
