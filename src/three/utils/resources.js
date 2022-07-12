import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader';
import EventEmitter from './event-emitter';

export default class Resources extends EventEmitter
{
    constructor(sources)
    {
        super();

        this.sources = sources;
        this.experience = window.experience;

        this.items = {};
        this.toLoad = this.sources.length;
        this.loaded = 0;

        this.setLoaders();
        this.startLoading();
    }

    setLoaders()
    {
        this.loaders = {};
        const loadingManager = new THREE.LoadingManager(
            // Loaded
            () =>
            {
                this.experience.loading.initiateLoadedSequence();
            },
        );
        this.loaders.gltfLoader = new GLTFLoader(loadingManager);
        this.loaders.textureLoader = new THREE.TextureLoader(loadingManager);
        this.loaders.RGBELoader = new RGBELoader(loadingManager);
    }

    startLoading()
    {
        // Load each source
        for (const source of this.sources)
        {
            if (source.type === 'gltfModel')
            {
                this.loaders.gltfLoader.load(
                    source.path,
                    (file) =>
                    {
                        this.sourceLoaded(source, file);
                    },
                );
            }
            else if (source.type === 'texture')
            {
                this.loaders.textureLoader.load(
                    source.path,
                    (file) =>
                    {
                        this.sourceLoaded(source, file);
                    },
                );
            }
            else if (source.type === 'hdrTexture')
            {
                this.loaders.RGBELoader.load(
                    source.path,
                    (file) =>
                    {
                        this.sourceLoaded(source, file);
                    },
                );
            }
        }
    }

    sourceLoaded(source, file)
    {
        this.items[source.name] = file;
        this.loaded++;

        if (this.loaded === this.toLoad)
        {
            this.trigger('ready');
        }
    }
}
