import * as THREE from 'three';
import EventEmitter from './event-emitter.js';

export default class Pointer extends EventEmitter
{
    constructor()
    {
        super();

        this.pointerPos = new THREE.Vector2();
        this.isDragging = false;
        this.experience = window.experience;
        this.sizes = this.experience.sizes;

        const updatePos = (clientX, clientY) =>
        {
            this.pointerPos.x = clientX / this.sizes.width * 2 - 1;
            this.pointerPos.y = -(clientY / this.sizes.height) * 2 + 1;
        };

        // Mouse events
        window.addEventListener('mousemove', (event) =>
        {
            updatePos(event.clientX, event.clientY);
            this.trigger('mousemove');
        });

        window.addEventListener('mousedown', (event) =>
        {
            updatePos(event.clientX, event.clientY);
            this.trigger('mousedown');
        });

        window.addEventListener('mouseup', () =>
        {
            this.trigger('mouseup');
        });

        // Touch events
        window.addEventListener('touchstart', (event) =>
        {
            const touch = event.touches[0];
            updatePos(touch.clientX, touch.clientY);
            this.trigger('mousedown');
        }, { passive: true });

        window.addEventListener('touchmove', (event) =>
        {
            if (this.isDragging) event.preventDefault();
            const touch = event.touches[0];
            updatePos(touch.clientX, touch.clientY);
            this.trigger('mousemove');
        }, { passive: false });

        window.addEventListener('touchend', () =>
        {
            this.trigger('mouseup');
        });

        window.addEventListener('touchcancel', () =>
        {
            this.trigger('mouseup');
        });
    }
}
