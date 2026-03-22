import * as THREE from 'three';
import Sources from './sources.js';
import Resources from '../../utils/resources.js';
import Sizes from '../../utils/sizes.js';
import Time from '../../utils/time.js';
import Camera from './camera.js';
import Pointer from '../../utils/pointer.js';
import Renderer from './renderer.js';
import Objects from './objects.js';
import Environment from './environment.js';
import Physics from './physics.js';

let instance = null;

export default class Homepage
{
    constructor(_canvas)
    {
        // Singleton
        if (instance)
        {
            return instance;
        }
        instance = this;

        // Global access
        window.experience = this;

        // Options
        this.canvas = _canvas;

        // Setup
        this.sizes = new Sizes();
        this.time = new Time();
        this.scene = new THREE.Scene();
        this.resources = new Resources(Sources);
        this.pointer = new Pointer();
        this.camera = new Camera();
        this.renderer = new Renderer();

        // Wait for resources
        this.resources.on('ready', () =>
        {
            // Setup
            this.environment = new Environment();
            this.physics = new Physics();
            this.objects = new Objects();
        });

        // Resize event
        this.sizes.on('resize', () =>
        {
            this.camera.resize();
            this.renderer.resize();
        });

        // Time tick event
        this.time.on('tick', () =>
        {
            this.update();
        });
    }

    update()
    {
        if (this.physics) this.physics.update();
        if (this.objects) this.objects.update();
        this.renderer.update();
        this.camera.update();
    }

    dispose()
    {
        // Stop the animation loop
        this.time.stop();

        // Dispose all Three.js objects
        this.scene.traverse((child) =>
        {
            if (child.isMesh)
            {
                if (child.geometry) child.geometry.dispose();
                if (child.material)
                {
                    if (child.material.map) child.material.map.dispose();
                    if (child.material.normalMap) child.material.normalMap.dispose();
                    child.material.dispose();
                }
            }
        });

        // Dispose renderer
        this.renderer.renderer.dispose();

        // Clear global reference and singleton
        window.experience = null;
        instance = null;
    }
}
