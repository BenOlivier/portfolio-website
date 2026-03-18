import * as THREE from 'three';

export default class Objects
{
    constructor()
    {
        this.experience = window.experience;
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.sizes = this.experience.sizes;
    }

    update()
    {
    }
}
