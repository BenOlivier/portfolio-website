import Experience from '../Experience.js'

export default class Object
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('object')
        }

        // Resource
        this.resource = this.resources.items.objectModel

        this.setModel()
    }

    setModel()
    {
        this.model = this.resource.scene
        this.model.scale.set(4, 4, 4)
        this.scene.add(this.model)
    }
}