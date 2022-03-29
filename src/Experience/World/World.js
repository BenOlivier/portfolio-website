import Experience from '../Experience.js'
import Environment from './Environment.js'
import Object from './Object.js'

export default class World
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        // Wait for resources
        this.resources.on('ready', () =>
        {
            // Setup
            this.object = new Object()
            this.environment = new Environment()
        })
    }

    update()
    {
        
    }
}