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
        this._onMouseMove = (event) =>
        {
            updatePos(event.clientX, event.clientY);
            this.trigger('mousemove');
        };

        this._onMouseDown = (event) =>
        {
            updatePos(event.clientX, event.clientY);
            this.trigger('mousedown');
        };

        this._onMouseUp = () =>
        {
            this.trigger('mouseup');
        };

        // Touch events
        this._onTouchStart = (event) =>
        {
            const touch = event.touches[0];
            updatePos(touch.clientX, touch.clientY);
            this.trigger('mousedown');
        };

        this._onTouchMove = (event) =>
        {
            if (this.isDragging) event.preventDefault();
            const touch = event.touches[0];
            updatePos(touch.clientX, touch.clientY);
            this.trigger('mousemove');
        };

        this._onTouchEnd = () =>
        {
            this.trigger('mouseup');
        };

        window.addEventListener('mousemove', this._onMouseMove);
        window.addEventListener('mousedown', this._onMouseDown);
        window.addEventListener('mouseup', this._onMouseUp);
        window.addEventListener('touchstart', this._onTouchStart, { passive: true });
        window.addEventListener('touchmove', this._onTouchMove, { passive: false });
        window.addEventListener('touchend', this._onTouchEnd);
        window.addEventListener('touchcancel', this._onTouchEnd);
    }

    dispose()
    {
        window.removeEventListener('mousemove', this._onMouseMove);
        window.removeEventListener('mousedown', this._onMouseDown);
        window.removeEventListener('mouseup', this._onMouseUp);
        window.removeEventListener('touchstart', this._onTouchStart);
        window.removeEventListener('touchmove', this._onTouchMove);
        window.removeEventListener('touchend', this._onTouchEnd);
        window.removeEventListener('touchcancel', this._onTouchEnd);
    }
}
