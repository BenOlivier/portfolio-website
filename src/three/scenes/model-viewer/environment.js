import * as THREE from 'three'

export default class Environment
{
    constructor()
    {
        this.experience = window.experience
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug
        
        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('environment')
        }

        this.setSunLight()
        this.setEnvironmentMap()
        this.setFloor()
    }

    setSunLight()
    {
        this.sunLight = new THREE.DirectionalLight('#ffffff', 2)
        this.sunLight.castShadow = true
        this.sunLight.shadow.camera.far = 15
        this.sunLight.shadow.mapSize.set(1024, 1024)
        this.sunLight.shadow.normalBias = 0.05
        this.sunLight.position.set(1, 2, 1)
        this.scene.add(this.sunLight)
    }

    setEnvironmentMap()
    {
        this.environmentMap = {}
        this.environmentMap.intensity = 20 //TODO: Doesn't work
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
                .max(20)
                .step(0.1)
                .onChange(this.environmentMap.updateMaterials)
        }
    }

    setFloor()
    {
        this.floorGeometry = new THREE.PlaneGeometry(3, 3)
        this.floorTexture = this.resources.items.floorTexture
        this.floorMaterial = new THREE.MeshStandardMaterial({
            map: this.floorTexture,
            transparent: true,
            // depthTest: false,
            opacity: 0.1
        })

        this.floor = new THREE.Mesh(this.floorGeometry, this.floorMaterial)
        this.floor.position.y = -0.8
        this.floor.rotation.x = - Math.PI * 0.5
        this.floor.receiveShadow = true
        this.scene.add(this.floor)
    }
}