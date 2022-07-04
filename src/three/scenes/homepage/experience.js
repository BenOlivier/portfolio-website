import * as THREE from 'three'
import Sources from './sources.js'
import Resources from '../../utils/resources.js'
import Debug from '../../utils/debug.js'
import Sizes from '../../utils/sizes.js'
import Loading from './loading.js'
import Time from '../../utils/time.js'
import Camera from './camera.js'
import Pointer from '../../utils/pointer.js'
import Renderer from './renderer.js'
import Environment from './environment.js'
import Objects from './objects.js'

let instance = null

export default class Homepage
{
    constructor(_canvas)
    {
        // Singleton
        if(instance)
        {
            return instance
        }
        instance = this
        
        // Global access
        window.experience = this

        // Options
        this.canvas = _canvas

        // Setup
        this.debug = new Debug()
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.loading = new Loading()
        this.resources = new Resources(Sources)
        this.pointer = new Pointer()
        this.camera = new Camera()
        this.renderer = new Renderer()
        // this.stats = new Stats()
        
        // Wait for resources
        this.resources.on('ready', () =>
        {
            // Setup
            this.environment = new Environment()
            this.objects = new Objects()
        })

        // Resize event
        this.sizes.on('resize', () =>
        {
            this.camera.resize()
            this.renderer.resize()
        })

        // Time tick event
        this.time.on('tick', () =>
        {
            this.update()
        })
    }

    update()
    {
        // if(this.objects) this.objects.update()
        this.renderer.update()
        this.camera.update()
    }

    destroy()
    {
        this.sizes.off('resize')
        this.time.off('tick')

        this.scene.traverse((child) =>
        {
            if(child instanceof THREE.Mesh)
            {
                child.geometry.dispose()
                for(const key in child.material)
                {
                    const value = child.material[key]
                    if(value && typeof value.dispose === 'function')
                    {
                        value.dispose()
                    }
                }
            }
        })

        this.renderer.instance.dispose()
        if(this.debug.active) this.debug.ui.destroy()
    }
}