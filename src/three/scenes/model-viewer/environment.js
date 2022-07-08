import * as THREE from 'three'

export default class Environment
{
    constructor()
    {
        this.experience = window.experience
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.renderer = this.experience.renderer

        this.setEnvironmentMap()
        this.setFloor()
    }

    setEnvironmentMap()
    {
        const pmremGenerator = new THREE.PMREMGenerator(this.renderer.renderer)
        pmremGenerator.compileEquirectangularShader()
        const envMap = pmremGenerator.fromEquirectangular(this.resources.items.envMapTexture).texture
        this.scene.environment = envMap
        this.resources.items.envMapTexture.dispose()
        pmremGenerator.dispose()
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