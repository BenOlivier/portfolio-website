import * as THREE from 'three'
import Debug from './Utils/Debug.js'
import Sizes from './Utils/Sizes.js'
import Loading from './Utils/Loading.js'
import Time from './Utils/Time.js'
import Camera from './World/Camera.js'
import Pointer from './Utils/Pointer.js'
// import Raycaster from './Utils/Raycaster.js'
import Renderer from './Renderer.js'
import Environment from './World/Environment.js'
import Object from './World/Object.js'
import Resources from './Utils/Resources.js'
import Sources from './Utils/Sources.js'
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
        this.camera = new Camera()
        this.pointer = new Pointer()
        // this.raycaster = new Raycaster()
        this.renderer = new Renderer()
        // this.stats = new Stats()
        
        // Wait for resources
        this.resources.on('ready', () =>
        {
            // Setup
            this.environment = new Environment()
            this.object = new Object()
        })

        // Stats
        // this.stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
        // document.body.appendChild(this.stats.dom)

        // Resize event
        this.sizes.on('resize', () =>
        {
            this.resize()
        })

        // Time tick event
        this.time.on('tick', () =>
        {
            // this.stats.begin()
            this.update()
            // this.stats.end()
        })
    }

    resize()
    {
        this.object.resize()
        this.camera.resize()
        this.renderer.resize()
    }

    update()
    {
        if(this.object) this.object.update()
        this.renderer.update()
        this.camera.update()
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