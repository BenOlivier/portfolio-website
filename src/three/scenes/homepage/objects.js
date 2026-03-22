import * as THREE from 'three';
import * as CANNON from 'cannon-es';

// --- Controls ---
const DEBUG_COLLIDERS = false;
const ENTRY_DELAY = 0; // seconds — delay before first balloon appears
const ENTRY_STAGGER = 0.05; // seconds — delay between each balloon
const BUOYANCY_MIN = 0.2; // minimum upward force
const BUOYANCY_MAX = 0.35; // maximum upward force
const WIND_STRENGTH = 0.02; // lateral wind force
const SPAWN_MARGIN = 0.6; // extra distance below/above viewport edge for spawn/despawn
const INITIAL_VELOCITY = 7; // upward velocity on first spawn
const Z_RESTORE = 1; // force pulling balloons back to the drag plane (z=0)
const Z_RANGE = 0.8; // allowed Z distance from grab plane before restore kicks in
const X_BOUNDS_FORCE = 1; // force pushing balloons back within horizontal bounds
const X_RANGE = 0.7; // fraction of available right-side space to use (0–1)
const BALLOON_SCALE = 1; // scales mesh and colliders (1 = default)
const RESPAWN_MIN_DIST = 0.6; // min distance from other balloons to allow respawn
const GRAB_ATTRACT = 2; // attraction strength toward grabbed balloon
const REPEL_STRENGTH = 1; // gentle repel force between nearby balloons
const REPEL_RADIUS = 1; // distance within which repulsion applies

const BALLOON_COUNT = 6;

const PALETTES = [
    // Forest
    [0xEDFFFF, 0xCDF1D6, 0x8BCF9C, 0x39884D, 0x115823, 0x004511],

    // Blue
    [0xFFFFFF, 0xA9D6E5, 0x61A5C2, 0x1E78AD, 0x005A9B, 0xE1562B],

    // Turquoise
    [0xA9E5E0, 0x61C2BA, 0x01867B, 0x005E56, 0xF5E6A9, 0xF7DC6F],

    // Peach
    [0xFAAD8A, 0xFA7053, 0xE6472B, 0xBE2111, 0x7C0B00, 0xB22A41],

    // Yellow
    [0xFFEAB0, 0xFFDA73, 0xFE9B544, 0xAC6700, 0xCE6C20, 0xEFA25F],
];

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
        this.palette = PALETTES[Math.floor(Math.random() * PALETTES.length)];

        // Pre-allocated vectors for update loop (avoids GC pressure)
        this._force = new CANNON.Vec3();
        this._forcePoint = new CANNON.Vec3();
        this._repelForce = new CANNON.Vec3();

        this.releasing = false;
        this._releaseResolve = null;

        this.setModels();
        this.setPhysics();
        this.setInteraction();
    }

    randomColour()
    {
        return this.palette[Math.floor(Math.random() * this.palette.length)];
    }

    setModels()
    {
        const source = this.resources.items.balloon;

        // Extract normal map from the GLB's original material
        let originalNormalMap = null;
        source.scene.traverse((o) =>
        {
            if (o.isMesh && o.material && o.material.normalMap)
            {
                originalNormalMap = o.material.normalMap;
            }
        });

        // Shuffle palette for unique initial colours
        const shuffled = [...this.palette].sort(() => Math.random() - 0.5);

        this.meshes = [];
        for (let i = 0; i < BALLOON_COUNT; i++)
        {
            const mat = new THREE.MeshStandardMaterial({
                color: shuffled[i % shuffled.length],
                metalness: 1.0,
                roughness: 0.2,
                normalMap: originalNormalMap,
            });

            const mesh = i === 0 ? source.scene : source.scene.clone(true);
            mesh.scale.setScalar(BALLOON_SCALE);
            mesh.traverse((o) => { if (o.isMesh) o.material = mat; });
            this.scene.add(mesh);

            this.meshes.push({ mesh, mat });
        }
    }

    getViewBounds()
    {
        const cam = this.camera;
        const halfH = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)) * cam.position.z;
        const halfW = halfH * cam.aspect;
        return { halfW, halfH };
    }

    getSpawnXRange()
    {
        const { halfW } = this.getViewBounds();
        const rightEdge = halfW;

        // Content right edge in world-space X
        const home = document.querySelector('.home-content');
        if (home)
        {
            const rect = home.getBoundingClientRect();
            const ndcX = (rect.right / window.innerWidth) * 2 - 1;
            const contentRight = ndcX * halfW;
            const margin = SPAWN_MARGIN;
            const min = contentRight + margin;
            const max = min + (rightEdge - margin - min) * X_RANGE;
            return { min, max };
        }

        return { min: SPAWN_MARGIN, max: rightEdge - SPAWN_MARGIN };
    }

    randomSpawnX()
    {
        const { min, max } = this.getSpawnXRange();
        return min + Math.random() * (max - min);
    }

    createBBody(posX, posY)
    {
        const radius = 0.2 * BALLOON_SCALE;
        const offset = 0.1 * BALLOON_SCALE;

        const body = new CANNON.Body({
            mass: 1,
            position: new CANNON.Vec3(posX, posY || 0, (Math.random() - 0.5) * 2 * Z_RANGE),
            linearDamping: 0.98,
            angularDamping: 0.98,
        });
        body.addShape(new CANNON.Sphere(radius), new CANNON.Vec3(0, offset, 0));
        body.addShape(new CANNON.Sphere(radius), new CANNON.Vec3(0, -offset, 0));

        body.quaternion.setFromEuler(
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
        );

        return { body, radius, offset };
    }

    respawn(balloon)
    {
        const { halfH } = this.getViewBounds();
        const spawnY = -halfH - SPAWN_MARGIN;
        const spawnX = this.randomSpawnX();

        const spawnZ = (Math.random() - 0.5) * 2 * Z_RANGE;
        balloon.body.position.set(spawnX, spawnY, spawnZ);
        balloon.body.velocity.set(0, 0, 0);
        balloon.body.angularVelocity.set(0, 0, 0);
        balloon.body.quaternion.setFromEuler(
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
        );
        balloon.mat.color.setHex(this.randomColour());
        balloon.buoyancy = BUOYANCY_MIN + Math.random() * (BUOYANCY_MAX - BUOYANCY_MIN);
    }

    canSpawnAt(x, y, excludeBody)
    {
        const minDist2 = RESPAWN_MIN_DIST * RESPAWN_MIN_DIST;
        for (const b of this.balloons)
        {
            if (b.body === excludeBody || !b.active) continue;
            const dx = b.body.position.x - x;
            const dy = b.body.position.y - y;
            if (dx * dx + dy * dy < minDist2) return false;
        }
        return true;
    }

    setPhysics()
    {
        const { halfH } = this.getViewBounds();

        for (let i = 0; i < BALLOON_COUNT; i++)
        {
            const { mesh, mat } = this.meshes[i];
            const spawnX = this.randomSpawnX();
            const spawnY = -halfH - SPAWN_MARGIN - i * 0.5;
            const { body, radius, offset } = this.createBBody(spawnX, spawnY);
            this.world.addBody(body);

            let debugMesh = null;
            if (DEBUG_COLLIDERS)
            {
                const geo = new THREE.SphereGeometry(radius, 16, 12);
                const debugMat = new THREE.MeshBasicMaterial({
                    color: 0x00ff00,
                    wireframe: true,
                });
                debugMesh = new THREE.Group();
                const top = new THREE.Mesh(geo, debugMat);
                top.position.y = offset;
                const bottom = new THREE.Mesh(geo, debugMat);
                bottom.position.y = -offset;
                debugMesh.add(top, bottom);
                this.scene.add(debugMesh);
            }

            const entry = {
                mesh,
                mat,
                body,
                buoyancy: BUOYANCY_MIN + Math.random() * (BUOYANCY_MAX - BUOYANCY_MIN),
                active: false,
                debugMesh,
            };
            this.balloons.push(entry);

            mesh.visible = false;
        }

        // Joint body used as the drag target
        this.jointBody = new CANNON.Body({ mass: 0 });
        this.jointBody.collisionResponse = false;
        this.world.addBody(this.jointBody);

        // Stagger balloon entry
        this.balloons.forEach((balloon, i) =>
        {
            setTimeout(() =>
            {
                balloon.active = true;
                balloon.mesh.visible = true;
                balloon.body.velocity.set(0, INITIAL_VELOCITY, 0);
            }, (ENTRY_DELAY + i * ENTRY_STAGGER) * 1000);
        });
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
                    this.pointer.isDragging = true;
                    this.activeBalloon = balloon;
                    document.body.style.cursor = 'grabbing';
                    document.body.style.userSelect = 'none';

                    this.dragPlane.constant = 0;

                    // Intersect mouse ray with z=0 plane for initial position
                    this.raycaster.ray.intersectPlane(this.dragPlane, this.intersection);
                    this.jointBody.position.set(
                        this.intersection.x, this.intersection.y, 0,
                    );

                    // Zero pivot — body center tracks mouse directly on z=0
                    this.constraint = new CANNON.PointToPointConstraint(
                        balloon.body, new CANNON.Vec3(0, 0, 0),
                        this.jointBody, new CANNON.Vec3(0, 0, 0),
                        50,
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
                    0,
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
                this.pointer.isDragging = false;
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

    reset()
    {
        this.releasing = false;
        this._releaseResolve = null;
        this.canvas.style.opacity = '1';

        const { halfH } = this.getViewBounds();

        this.balloons.forEach((balloon, i) =>
        {
            const spawnX = this.randomSpawnX();
            const spawnY = -halfH - SPAWN_MARGIN - i * 0.5;
            const spawnZ = (Math.random() - 0.5) * 2 * Z_RANGE;
            balloon.body.position.set(spawnX, spawnY, spawnZ);
            balloon.body.velocity.set(0, 0, 0);
            balloon.body.angularVelocity.set(0, 0, 0);
            balloon.buoyancy = BUOYANCY_MIN + Math.random() * (BUOYANCY_MAX - BUOYANCY_MIN);
            balloon.mat.color.setHex(this.randomColour());
            balloon.active = false;
            balloon.mesh.visible = false;

            setTimeout(() =>
            {
                balloon.active = true;
                balloon.mesh.visible = true;
                balloon.body.velocity.set(0, INITIAL_VELOCITY, 0);
            }, (ENTRY_DELAY + i * ENTRY_STAGGER) * 1000);
        });
    }

    release()
    {
        this.releasing = true;

        // Drop any active drag
        if (this.isDragging)
        {
            this.isDragging = false;
            this.pointer.isDragging = false;
            this.activeBalloon = null;
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
            if (this.constraint)
            {
                this.world.removeConstraint(this.constraint);
                this.constraint = null;
            }
        }

        return new Promise((resolve) =>
        {
            this._releaseResolve = resolve;
            this.canvas.style.transition = 'opacity 0.3s ease';
            this.canvas.style.opacity = '0';

            const onEnd = () =>
            {
                this.canvas.removeEventListener('transitionend', onEnd);
                this.canvas.style.transition = '';

                for (const balloon of this.balloons)
                {
                    balloon.active = false;
                    balloon.mesh.visible = false;
                }

                if (this._releaseResolve)
                {
                    this._releaseResolve();
                    this._releaseResolve = null;
                }
            };

            this.canvas.addEventListener('transitionend', onEnd);
        });
    }

    update()
    {
        const t = this.time.current * 0.001;
        const f = this._force;
        const fp = this._forcePoint;

        // Cache bounds once per frame
        const { halfH } = this.getViewBounds();
        const despawnY = halfH + SPAWN_MARGIN;
        const spawnY = -halfH - SPAWN_MARGIN;
        const { min: spawnMinX, max: spawnMaxX } = this.getSpawnXRange();

        for (let i = 0; i < this.balloons.length; i++)
        {
            const balloon = this.balloons[i];
            if (!balloon.active) continue;
            const windOffset = i * 1.7;
            const pos = balloon.body.position;

            // Buoyancy or attraction
            if (!this.releasing && this.isDragging && this.activeBalloon !== balloon)
            {
                const target = this.activeBalloon.body.position;
                f.set(
                    (target.x - pos.x) * GRAB_ATTRACT,
                    (target.y - pos.y) * GRAB_ATTRACT,
                    (target.z - pos.z) * GRAB_ATTRACT,
                );
            }
            else
            {
                f.set(0, balloon.buoyancy, 0);
            }
            balloon.body.applyForce(f);

            // Gentle wind (skip when releasing)
            if (!this.releasing)
            {
                const fx = Math.sin(t * 0.15 + windOffset) * WIND_STRENGTH;
                const fz = Math.sin(t * 0.2 + windOffset + 5.0) * WIND_STRENGTH * 0.5;
                f.set(fx, 0, fz);
                fp.set(
                    pos.x + Math.sin(t * 0.1 + windOffset + 2.0) * 0.15,
                    pos.y + Math.sin(t * 0.08 + windOffset + 4.0) * 0.15,
                    pos.z + Math.sin(t * 0.09 + windOffset + 6.0) * 0.1,
                );
                balloon.body.applyForce(f, fp);
            }

            // Z restore — only pull back if outside allowed range
            if (pos.z > Z_RANGE)
            {
                f.set(0, 0, -(pos.z - Z_RANGE) * Z_RESTORE);
                balloon.body.applyForce(f);
            }
            else if (pos.z < -Z_RANGE)
            {
                f.set(0, 0, -(pos.z + Z_RANGE) * Z_RESTORE);
                balloon.body.applyForce(f);
            }

            // X bounds — push back if outside spawn range (disabled while dragging)
            if (!this.isDragging)
            {
                if (pos.x < spawnMinX)
                {
                    f.set((spawnMinX - pos.x) * X_BOUNDS_FORCE, 0, 0);
                    balloon.body.applyForce(f);
                }
                else if (pos.x > spawnMaxX)
                {
                    f.set((spawnMaxX - pos.x) * X_BOUNDS_FORCE, 0, 0);
                    balloon.body.applyForce(f);
                }
            }

            // Respawn when above viewport (skip when releasing — scale animation handles exit)
            if (!this.releasing && pos.y > despawnY)
            {
                const sx = this.randomSpawnX();
                if (this.canSpawnAt(sx, spawnY, balloon.body))
                {
                    this.respawn(balloon);
                }
            }

            balloon.mesh.position.copy(balloon.body.position);
            balloon.mesh.quaternion.copy(balloon.body.quaternion);

            if (balloon.debugMesh)
            {
                balloon.debugMesh.position.copy(balloon.body.position);
                balloon.debugMesh.quaternion.copy(balloon.body.quaternion);
            }
        }

        // Repel force when not dragging and not releasing
        if (!this.isDragging && !this.releasing)
        {
            const repelRadius2 = REPEL_RADIUS * REPEL_RADIUS;
            const rf = this._repelForce;

            for (let i = 0; i < this.balloons.length; i++)
            {
                if (!this.balloons[i].active) continue;
                const posA = this.balloons[i].body.position;

                for (let j = i + 1; j < this.balloons.length; j++)
                {
                    if (!this.balloons[j].active) continue;
                    const posB = this.balloons[j].body.position;

                    const dx = posA.x - posB.x;
                    const dy = posA.y - posB.y;
                    const dz = posA.z - posB.z;
                    const dist2 = dx * dx + dy * dy + dz * dz;

                    if (dist2 < repelRadius2 && dist2 > 0.000001)
                    {
                        const dist = Math.sqrt(dist2);
                        const strength = REPEL_STRENGTH * (1 - dist / REPEL_RADIUS);
                        const invDist = strength / dist;
                        rf.set(dx * invDist, dy * invDist, dz * invDist);
                        this.balloons[i].body.applyForce(rf);
                        rf.set(-rf.x, -rf.y, -rf.z);
                        this.balloons[j].body.applyForce(rf);
                    }
                }
            }
        }

        // Check if all balloons have exited during release
        if (this.releasing && this._releaseResolve)
        {
            const allGone = this.balloons.every((b) => !b.active);
            if (allGone)
            {
                this._releaseResolve();
                this._releaseResolve = null;
            }
        }
    }
}
