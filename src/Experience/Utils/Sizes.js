import EventEmitter from './EventEmitter.js'

export default class Sizes extends EventEmitter
{
    constructor()
    {
        super()

        if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
        {
            this.width = window.screen.availWidth
            this.height = window.screen.availHeight
            this.pixelRatio = Math.min(window.devicePixelRatio, 2)

            // Orientation change event
            window.addEventListener('orientationchange', () =>
            {
                this.width = window.screen.availWidth
                this.height = window.screen.availHeight
                this.pixelRatio = Math.min(window.devicePixelRatio, 2)

                this.trigger('resize')
            })
        }
        else
        {
            this.width = window.innerWidth
            this.height = window.innerHeight
            this.pixelRatio = Math.min(window.devicePixelRatio, 2)

            // Resize event
            window.addEventListener('resize', () =>
            {
                this.width = window.screen.innerWidth
                this.height = window.screen.innerHeight
                this.pixelRatio = Math.min(window.devicePixelRatio, 2)

                this.trigger('resize')
            })
        }
    }
}