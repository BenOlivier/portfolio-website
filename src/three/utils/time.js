import EventEmitter from './event-emitter.js';

export default class Time extends EventEmitter
{
    constructor()
    {
        super();

        this.start = performance.now();
        this.current = this.start;
        this.elapsed = 0;
        this.delta = 16;

        window.requestAnimationFrame(() =>
        {
            this.tick();
        });
    }

    tick = () =>
    {
        const currentTime = performance.now();
        this.delta = currentTime - this.current;
        this.current = currentTime;
        this.elapsed = this.current - this.start;

        this.trigger('tick');

        this.rafId = window.requestAnimationFrame(() =>
        {
            this.tick();
        });
    };

    stop()
    {
        if (this.rafId)
        {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }
}
