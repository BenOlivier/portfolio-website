import * as THREE from 'three'
import Sources from './utils/sources.js'
import Resources from './utils/resources.js'
import Debug from './utils/debug.js'
import Sizes from './utils/sizes.js'
import Loading from './utils/loading.js'
import Time from './utils/time.js'
import Camera from './world/camera.js'
import Pointer from './utils/pointer.js'
import Renderer from './renderer.js'
import Environment from './world/environment.js'
import Objects from './world/objects.js'
// import Stats from 'stats.js'

let instance = null

export default class Experience
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

        // Stats
        // this.stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
        // document.body.appendChild(this.stats.dom)

        // Resize event
        this.sizes.on('resize', () =>
        {
            this.camera.resize()
            this.renderer.resize()
        })

        // Time tick event
        this.time.on('tick', () =>
        {
            // this.stats.begin()
            this.update()
            // this.stats.end()
        })
    }

    update()
    {
        if(this.objects) this.objects.update()
        this.renderer.update()
        this.camera.update()
        if(this.UI) this.UI.update()
    }

    destroy()
    {
        this.sizes.off('resize')
        this.time.off('tick')

        // Traverse the whole scene
        this.scene.traverse((child) =>
        {
            // Test if it's a mesh
            if(child instanceof THREE.Mesh)
            {
                child.geometry.dispose()
                // Loop through the material properties
                for(const key in child.material)
                {
                    const value = child.material[key]
                    // Test if there is a dispose function
                    if(value && typeof value.dispose === 'function')
                    {
                        value.dispose()
                    }
                }
            }
        })

        this.renderer.instance.dispose()
        if(this.debug.active)
            this.debug.ui.destroy()
    }
}