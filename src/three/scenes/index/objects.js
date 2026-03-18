import * as THREE from 'three';
import * as CANNON from 'cannon-es';

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
        this.world = this.experience.physics.world;

        this.raycaster = new THREE.Raycaster();
        this.dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        this.intersection = new THREE.Vector3();
        this.isDragging = false;
        this.activeBalloon = null;
        this.constraint = null;
        this.jointBody = null;

        this.balloons = [];

        this.setModels();
        this.setPhysics();
        this.setInteraction();
    }

    setModels()
    {
        const source = this.resources.items.balloon;

        // Blue balloon — left of centre
        this.blueMat = new THREE.MeshStandardMaterial({
            color: 0x2266cc,
            metalness: 1.0,
            roughness: 0.05,
        });
        this.blueBalloon = source.scene;
        this.blueBalloon.traverse((o) => { if (o.isMesh) o.material = this.blueMat; });
        this.scene.add(this.blueBalloon);

        // Red balloon — right of centre (clone the model)
        this.redMat = new THREE.MeshStandardMaterial({
            color: 0xcc2222,
            metalness: 1.0,
            roughness: 0.05,
        });
        this.redBalloon = source.scene.clone(true);
        this.redBalloon.traverse((o) => { if (o.isMesh) o.material = this.redMat; });
        this.scene.add(this.redBalloon);
    }

    setPhysics()
    {
        // Compute collider radius from mesh bounds
        const box = new THREE.Box3().setFromObject(this.blueBalloon);
        const size = new THREE.Vector3();
        box.getSize(size);
        const radius = Math.max(size.x, size.y, size.z) * 0.5;

        // Blue body — left
        this.blueBody = new CANNON.Body({
            mass: 1,
            shape: new CANNON.Sphere(radius),
            position: new CANNON.Vec3(-0.2, 0, 0),
            linearDamping: 0.8,
            angularDamping: 0.8,
        });
        this.world.addBody(this.blueBody);

        const blueAnchor = new CANNON.Body({ mass: 0, position: new CANNON.Vec3(-0.2, 0, 0) });
        this.world.addBody(blueAnchor);
        this.blueSpring = new CANNON.Spring(this.blueBody, blueAnchor, {
            restLength: 0,
            stiffness: 5,
            damping: 1,
        });

        // Red body — right
        this.redBody = new CANNON.Body({
            mass: 1,
            shape: new CANNON.Sphere(radius),
            position: new CANNON.Vec3(0.2, 0, 0),
            linearDamping: 0.8,
            angularDamping: 0.8,
        });
        this.world.addBody(this.redBody);

        const redAnchor = new CANNON.Body({ mass: 0, position: new CANNON.Vec3(0.2, 0, 0) });
        this.world.addBody(redAnchor);
        this.redSpring = new CANNON.Spring(this.redBody, redAnchor, {
            restLength: 0,
            stiffness: 5,
            damping: 1,
        });

        // Debug collider wireframes
        const wireframeMat = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true,
            transparent: true,
            opacity: 0.3,
        });
        const sphereGeo = new THREE.SphereGeometry(radius, 16, 16);

        this.blueDebug = new THREE.Mesh(sphereGeo, wireframeMat);
        this.scene.add(this.blueDebug);

        this.redDebug = new THREE.Mesh(sphereGeo, wireframeMat);
        this.scene.add(this.redDebug);

        // Track balloon pairs for raycasting and syncing
        this.balloons = [
            { mesh: this.blueBalloon, body: this.blueBody, spring: this.blueSpring, debug: this.blueDebug },
            { mesh: this.redBalloon, body: this.redBody, spring: this.redSpring, debug: this.redDebug },
        ];

        // Joint body used as the drag target (massless, kinematic)
        this.jointBody = new CANNON.Body({ mass: 0 });
        this.jointBody.collisionResponse = false;
        this.world.addBody(this.jointBody);
    }

    setInteraction()
    {
        this.pointer.on('mousedown', () =>
        {
            this.raycaster.setFromCamera(this.pointer.pointerPos, this.camera);

            for (const balloon of this.balloons)
            {
                const intersects = this.raycaster.intersectObject(balloon.mesh, true);
                if (intersects.length > 0)
                {
                    this.isDragging = true;
                    this.activeBalloon = balloon;
                    this.canvas.style.cursor = 'grabbing';

                    const hitPoint = intersects[0].point;
                    this.dragPlane.constant = -balloon.body.position.z;

                    const pivot = new CANNON.Vec3(
                        hitPoint.x - balloon.body.position.x,
                        hitPoint.y - balloon.body.position.y,
                        hitPoint.z - balloon.body.position.z,
                    );

                    this.jointBody.position.set(hitPoint.x, hitPoint.y, hitPoint.z);

                    this.constraint = new CANNON.PointToPointConstraint(
                        balloon.body, pivot,
                        this.jointBody, new CANNON.Vec3(0, 0, 0),
                        10,
                    );
                    this.world.addConstraint(this.constraint);
                    break;
                }
            }
        });

        this.pointer.on('mousemove', () =>
        {
            this.raycaster.setFromCamera(this.pointer.pointerPos, this.camera);

            if (this.isDragging)
            {
                this.raycaster.ray.intersectPlane(this.dragPlane, this.intersection);
                this.jointBody.position.set(
                    this.intersection.x,
                    this.intersection.y,
                    this.jointBody.position.z,
                );
            }
            else
            {
                let hovering = false;
                for (const balloon of this.balloons)
                {
                    const intersects = this.raycaster.intersectObject(balloon.mesh, true);
                    if (intersects.length > 0)
                    {
                        hovering = true;
                        break;
                    }
                }
                this.canvas.style.cursor = hovering ? 'grab' : '';
            }
        });

        this.pointer.on('mouseup', () =>
        {
            if (this.isDragging)
            {
                this.isDragging = false;
                this.activeBalloon = null;
                this.canvas.style.cursor = '';

                if (this.constraint)
                {
                    this.world.removeConstraint(this.constraint);
                    this.constraint = null;
                }
            }
        });
    }

    update()
    {
        for (const balloon of this.balloons)
        {
            balloon.spring.applyForce();
            balloon.mesh.position.copy(balloon.body.position);
            balloon.mesh.quaternion.copy(balloon.body.quaternion);
            balloon.debug.position.copy(balloon.body.position);
            balloon.debug.quaternion.copy(balloon.body.quaternion);
        }
    }
}
