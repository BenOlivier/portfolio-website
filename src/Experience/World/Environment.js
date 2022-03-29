import * as THREE from 'three'
import { Vector3 } from 'three'
import Experience from '../Experience.js'

export default class Environment
{
    constructor()
    {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug
        this.mouse = this.experience.mouse
        this.camera = this.experience.camera
        
        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('environment')
        }

        this.setPointLight()
        this.setEnvironmentMap()

        // Mouse move event
        this.mouse.on('mousemove', () =>
        {
            this.updatePointLight()
        })
    }

    setPointLight()
    {
        this.pointLight = new THREE.PointLight('#ffffff', 4)
        this.pointLight.castShadow = true
        this.pointLight.shadow.camera.far = 15
        this.pointLight.shadow.mapSize.set(1024, 1024)
        this.pointLight.shadow.normalBias = 0.05
        this.pointLight.position.set(0, 2, 2)
        this.mouseVec = new THREE.Vector3()
        this.lightPos = new THREE.Vector3()
        this.pointLightHelper = new THREE.PointLightHelper(this.pointLight, 1)
        this.scene.add(this.pointLight, this.pointLightHelper)

        // Debug
        if(this.debug.active)
        {
            this.debugFolder
                .add(this.pointLight, 'intensity')
                .name('pointLightIntensity')
                .min(0)
                .max(10)
                .step(0.001)
            
            this.debugFolder
                .add(this.pointLight.position, 'z')
                .name('pointLightDistance')
                .min(0)
                .max(10)
                .step(0.001)
        }
    }

    updatePointLight()
    {
        this.mouseVec.set(this.mouse.mousePos.x, this.mouse.mousePos.y, 0)
            .unproject(this.camera.instance)
        this.mouseVec.sub(this.camera.instance.position).normalize()
        var distance = (this.pointLight.position.z - this.camera.instance.position.z ) / this.mouseVec.z
        this.lightPos.copy(this.camera.instance.position).add(this.mouseVec.multiplyScalar(distance))

        this.pointLight.position.set(this.lightPos.x, this.lightPos.y, this.lightPos.z)
    }

    setEnvironmentMap()
    {
        this.environmentMap = {}
        this.environmentMap.intensity = 0
        this.environmentMap.texture = this.resources.items.environmentMapTexture
        this.environmentMap.texture.encoding = THREE.sRGBEncoding
        
        this.scene.environment = this.environmentMap.texture

        this.environmentMap.updateMaterials = () =>
        {
            this.scene.traverse((child) =>
            {
                if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
                {
                    child.material.envMap = this.environmentMap.texture
                    child.material.envMapIntensity = this.environmentMap.intensity
                    child.material.needsUpdate = true
                }
            })
        }
        this.environmentMap.updateMaterials()

        // Debug
        if(this.debug.active)
        {
            this.debugFolder
                .add(this.environmentMap, 'intensity')
                .name('envMapIntensity')
                .min(0)
                .max(4)
                .step(0.001)
                .onChange(this.environmentMap.updateMaterials)
        }
    }
}