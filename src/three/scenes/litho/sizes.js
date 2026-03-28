import EventEmitter from '../../utils/event-emitter.js';

const MOBILE_BREAKPOINT = 768;

function computeSize()
{
    const container = document.querySelector('.project-content');
    if (!container) return null;
    const width = container.offsetWidth;
    const height = window.innerWidth >= MOBILE_BREAKPOINT
        ? Math.round(width / 1.5)
        : width;
    return { width, height };
}

export default class Sizes extends EventEmitter
{
    constructor()
    {
        super();

        const { width, height } = computeSize();
        this.width = width;
        this.height = height;
        this.pixelRatio = Math.min(window.devicePixelRatio, 2);

        // Resize event
        this._onResize = () =>
        {
            const size = computeSize();
            if (!size) return;
            this.width = size.width;
            this.height = size.height;
            this.pixelRatio = Math.min(window.devicePixelRatio, 2);

            this.trigger('resize');
        };
        window.addEventListener('resize', this._onResize);
    }

    dispose()
    {
        window.removeEventListener('resize', this._onResize);
    }
}
