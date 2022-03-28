import Experience from '../Experience.js'
import Environment from './Environment.js'
import Sculpture from './Sculpture.js'

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
            this.sculpture = new Sculpture()
            this.environment = new Environment()
        })
    }

    update()
    {
        
    }
}