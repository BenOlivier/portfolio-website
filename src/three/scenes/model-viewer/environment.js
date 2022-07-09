import * as THREE from 'three'

export default class Environment
{
    constructor()
    {
        this.experience = window.experience
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.renderer = this.experience.renderer

        this.setEnvironmentMaps()
        this.setFloor()
    }

    setEnvironmentMaps()
    {
        this.envMaps = []
        const pmremGenerator = new THREE.PMREMGenerator(this.renderer.renderer)
        pmremGenerator.compileEquirectangularShader()
        const autoshopEnvMap = pmremGenerator.fromEquirectangular(this.resources.items.autoshopHDRI).texture
        const marketEnvMap = pmremGenerator.fromEquirectangular(this.resources.items.marketHDRI).texture
        const parkEnvMap = pmremGenerator.fromEquirectangular(this.resources.items.parkHDRI).texture
        this.envMaps.push(autoshopEnvMap, marketEnvMap, parkEnvMap)
        this.scene.environment = this.envMaps[0]
        this.resources.items.autoshopHDRI.dispose()
        this.resources.items.marketHDRI.dispose()
        this.resources.items.parkHDRI.dispose()
        pmremGenerator.dispose()
    }

    setFloor()
    {
        this.floorGeometry = new THREE.PlaneGeometry(3, 3)
        this.floorTexture = this.resources.items.floorTexture
        this.floorMaterial = new THREE.MeshStandardMaterial({
            map: this.floorTexture,
            transparent: true,
            opacity: 0.1
        })

        this.floor = new THREE.Mesh(this.floorGeometry, this.floorMaterial)
        this.floor.position.y = -0.8
        this.floor.rotation.x = - Math.PI * 0.5
        this.floor.receiveShadow = true
        this.scene.add(this.floor)
    }
}