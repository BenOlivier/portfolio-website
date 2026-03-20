import * as CANNON from 'cannon-es';

export default class Physics
{
    constructor()
    {
        this.experience = window.experience;
        this.time = this.experience.time;

        this.setWorld();
    }

    setWorld()
    {
        this.world = new CANNON.World();
        this.world.gravity.set(0, 0, 0);
    }

    update()
    {
        this.world.step(1 / 60, this.time.delta / 1000, 1);
    }
}
