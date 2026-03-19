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
            roughness: 0.2,
        });
        this.blueBalloon = source.scene;
        this.blueBalloon.traverse((o) => { if (o.isMesh) o.material = this.blueMat; });
        this.scene.add(this.blueBalloon);

        // Red balloon — right of centre (clone the model)
        this.redMat = new THREE.MeshStandardMaterial({
            color: 0xcc2222,
            metalness: 1.0,
            roughness: 0.2,
        });
        this.redBalloon = source.scene.clone(true);
        this.redBalloon.traverse((o) => { if (o.isMesh) o.material = this.redMat; });
        this.scene.add(this.redBalloon);
    }

    createBBody(posX)
    {
        // Compound shape sizes — tune these manually
        const boxHalf = new CANNON.Vec3(0.14, 0.32, 0.1);
        const sphereR = 0.16;

        // Compound shape offsets
        const boxOffset = new CANNON.Vec3(-0.1, 0, 0.07);
        const topSphereOffset = new CANNON.Vec3(0.15, 0.16, 0.07);
        const bottomSphereOffset = new CANNON.Vec3(0.15, -0.16, 0.07);

        const body = new CANNON.Body({
            mass: 1,
            position: new CANNON.Vec3(posX, 0, 0),
            linearDamping: 0.8,
            angularDamping: 0.8,
        });
        body.addShape(new CANNON.Box(boxHalf), boxOffset);
        body.addShape(new CANNON.Sphere(sphereR), topSphereOffset);
        body.addShape(new CANNON.Sphere(sphereR), bottomSphereOffset);

        return { body };
    }

    setPhysics()
    {
        // Blue body — right of centre
        const blue = this.createBBody(0.4);
        this.blueBody = blue.body;
        this.world.addBody(this.blueBody);

        const blueAnchor = new CANNON.Body({
            mass: 0, position: new CANNON.Vec3(0.5, 0, 0),
        });
        this.world.addBody(blueAnchor);
        this.blueSpring = new CANNON.Spring(this.blueBody, blueAnchor, {
            restLength: 0, stiffness: 5, damping: 1,
        });

        // Red body — far right
        const red = this.createBBody(1.0);
        this.redBody = red.body;
        this.world.addBody(this.redBody);

        const redAnchor = new CANNON.Body({
            mass: 0, position: new CANNON.Vec3(0.9, 0, 0),
        });
        this.world.addBody(redAnchor);
        this.redSpring = new CANNON.Spring(this.redBody, redAnchor, {
            restLength: 0, stiffness: 5, damping: 1,
        });

        // Track balloon pairs for raycasting and syncing
        this.balloons = [
            {
                mesh: this.blueBalloon, body: this.blueBody,
                spring: this.blueSpring,
            },
            {
                mesh: this.redBalloon, body: this.redBody,
                spring: this.redSpring,
            },
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
                    document.body.style.cursor = 'grabbing';
                    document.body.style.userSelect = 'none';

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
                document.body.style.cursor = hovering ? 'grab' : '';
            }
        });

        this.pointer.on('mouseup', () =>
        {
            if (this.isDragging)
            {
                this.isDragging = false;
                this.activeBalloon = null;
                document.body.style.cursor = '';
                document.body.style.userSelect = '';

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
        const t = this.time.current * 0.001;
        const windStrength = 0.05;

        for (let i = 0; i < this.balloons.length; i++)
        {
            const balloon = this.balloons[i];
            const offset = i * 1.7;

            // Smooth wind force using offset sine waves
            const fx = Math.sin(t * 0.7 + offset) * windStrength;
            const fy = Math.sin(t * 1.1 + offset + 3.0) * windStrength;
            const fz = Math.sin(t * 0.9 + offset + 5.0) * windStrength * 0.5;

            // Apply at a varying offset from centre to create torque
            const px = Math.sin(t * 0.5 + offset + 2.0) * 0.15;
            const py = Math.sin(t * 0.3 + offset + 4.0) * 0.15;
            const pz = Math.sin(t * 0.4 + offset + 6.0) * 0.1;
            const pos = balloon.body.position;
            balloon.body.applyForce(
                new CANNON.Vec3(fx, fy, fz),
                new CANNON.Vec3(pos.x + px, pos.y + py, pos.z + pz),
            );

            // Restoring torque — nudge orientation back toward camera
            const q = balloon.body.quaternion;
            const restoreStrength = 0.1;
            balloon.body.torque.x += -q.x * restoreStrength;
            balloon.body.torque.y += -q.y * restoreStrength;
            balloon.body.torque.z += -q.z * restoreStrength;

            balloon.spring.applyForce();
            balloon.mesh.position.copy(balloon.body.position);
            balloon.mesh.quaternion.copy(balloon.body.quaternion);
        }
    }
}
