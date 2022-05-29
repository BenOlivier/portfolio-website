import * as THREE from 'three'
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js'
import Experience from './Experience.js'

export default class Renderer
{
    constructor()
    {
        this.experience = new Experience()
        this.canvas = this.experience.canvas
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.camera = this.experience.camera
        this.debug = this.experience.debug

        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('renderer')
        }

        this.setRenderers()
    }

    setRenderers()
    {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        })
        this.renderer.physicallyCorrectLights = true
        this.renderer.outputEncoding = THREE.sRGBEncoding
        this.renderer.toneMapping = THREE.CineonToneMapping
        this.renderer.toneMappingExposure = 1
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
        this.renderer.setSize(this.sizes.width, this.sizes.height)
        this.renderer.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))

        this.cssRenderer = new CSS3DRenderer()
        this.cssRenderer.setSize(this.sizes.width, this.sizes.height)
        this.cssRenderer.domElement.style.position = 'fixed'
        this.cssRenderer.domElement.style.top = 0
        // document.querySelector('#css').appendChild( this.cssRenderer.domElement )

        if(this.debug.active)
        {
            this.debugFolder.add(this.renderer, 'toneMapping', {
                No: THREE.NoToneMapping,
                Linear: THREE.ReinhardToneMapping,
                Cineon: THREE.CineonToneMapping,
                ACESFilmic: THREE.ACESFilmicToneMapping
            })
            
            this.debugFolder.add(this.renderer, 'toneMappingExposure').min(0).max(5).step(0.001)
        }
    }

    resize()
    {
        this.renderer.setSize(this.sizes.width, this.sizes.height)
        this.renderer.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
    }

    update()
    {
        this.renderer.render(this.scene, this.camera.camera)
        this.cssRenderer.render(this.scene, this.camera.camera)
    }
}