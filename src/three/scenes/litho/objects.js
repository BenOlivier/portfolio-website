import Experience from './experience.js';

export default class Objects
{
    constructor()
    {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;

        this.setModel();
    }

    setModel()
    {
        this.lithoResource = this.resources.items.litho;
        this.litho = this.lithoResource.scene;
        this.scene.add(this.litho);
    }
}