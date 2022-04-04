import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import EventEmitter from './EventEmitter.js'
import Experience from '../Experience.js'
import { MathUtils } from 'three'

export default class Resources extends EventEmitter
{
    constructor(sources)
    {
        super()

        this.sources = sources
        this.experience = new Experience()
        this.debug = this.experience.debug

        this.items = {}
        this.toLoad = this.sources.length
        this.loaded = 0

        // Parameters
        this.params = {
            loadingBarSmoothing: 0.5
        }

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('loading')
        }

        this.setLoaders()
        this.startLoading()
    }

    setLoaders()
    {
        this.loaders = {}
        this.loadingManager = new THREE.LoadingManager(
            // Loaded
            () =>
            {
                this.experience.loading.fadeOverlay()
            },

            // Progress
            (itemUrl, itemsLoaded, itemsTotal) =>
            {
                const progressRatio = itemsLoaded / itemsTotal
                const targetProgress = THREE.MathUtils.lerp(0.75, 1.25, progressRatio)
                this.experience.loading.loadingBarMaterial.uniforms.completion.value
                    = targetProgress
            }
        )
        this.loaders.gltfLoader = new GLTFLoader(this.loadingManager)
        this.loaders.textureLoader = new THREE.TextureLoader(this.loadingManager)
        this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader(this.loadingManager)
    }

    startLoading()
    {
        // Load each source
        for(const source of this.sources)
        {
            if(source.type === 'gltfModel')
            {
                this.loaders.gltfLoader.load(
                    source.path,
                    (file) =>
                    {
                        this.sourceLoaded(source, file)
                    }
                )
            }
            else if(source.type === 'texture')
            {
                this.loaders.textureLoader.load(
                    source.path,
                    (file) =>
                    {
                        this.sourceLoaded(source, file)
                    }
                )
            }
            else if(source.type === 'cubeTexture')
            {
                this.loaders.cubeTextureLoader.load(
                    source.path,
                    (file) =>
                    {
                        this.sourceLoaded(source, file)
                    }
                )
            }
        }
    }

    sourceLoaded(source, file)
    {
        this.items[source.name] = file

        this.loaded++

        if(this.loaded === this.toLoad)
        {
            this.trigger('ready')
        }
    }
}