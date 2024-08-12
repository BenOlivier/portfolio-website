import EventEmitter from '../../utils/event-emitter.js';

export default class Sizes extends EventEmitter
{
    constructor()
    {
        super();

        const container = document.getElementById('project-content');
        this.width = container.offsetWidth;
        this.height = this.width;
        this.pixelRatio = Math.min(window.devicePixelRatio, 2);

        // Resize event
        window.addEventListener('resize', () =>
        {
            this.width = container.offsetWidth;
            this.height = this.width;
            this.pixelRatio = Math.min(window.devicePixelRatio, 2);

            this.trigger('resize');
        });
    }
}
