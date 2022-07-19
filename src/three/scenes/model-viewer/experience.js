import * as THREE from 'three';
import Sources from './sources.js';
import Resources from '../../utils/resources.js';
import Debug from '../../utils/debug.js';
import Sizes from '../../utils/sizes.js';
import Loading from './loading.js';
import Time from '../../utils/time.js';
import Camera from './camera.js';
import Pointer from '../../utils/pointer.js';
import Renderer from './renderer.js';
import Environment from './environment';
import Objects from './objects.js';

let instance = null;

export default class ModelViewer
{
    constructor(canvas, model)
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
        this.canvas = canvas;

        // Setup
        this.debug = new Debug();
        this.sizes = new Sizes();
        this.time = new Time();
        this.scene = new THREE.Scene();
        this.loading = new Loading();
        this.resources = new Resources(Sources);
        this.pointer = new Pointer();
        this.camera = new Camera();
        this.renderer = new Renderer();

        // Wait for resources
        this.resources.on('ready', () =>
        {
            // Setup
            this.environment = new Environment();
            this.objects = new Objects(model);
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
        if (this.objects) this.objects.update();
        this.camera.update();
        this.renderer.update();
    }
}
