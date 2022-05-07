import EventEmitter from './EventEmitter.js'

export default class Sizes extends EventEmitter
{
    constructor()
    {
        super()

        // If using a mobile device
        if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
        {
            this.width = window.screen.availWidth
            this.height = window.screen.availHeight
            this.pixelRatio = Math.min(window.devicePixelRatio, 2)
            this.isLandscape = false

            // Resize event
            window.addEventListener('resize', () =>
            {
                // Resize if orientation changed
                if(this.isLandscape)
                {
                    if(window.screen.availWidth < window.screen.availHeight)
                    {
                        this.width = window.screen.availWidth
                        this.height = window.screen.availHeight
                        this.pixelRatio = Math.min(window.devicePixelRatio, 2)
                        this.isLandscape = false
                        this.trigger('resize')
                    }
                }
                else if(window.screen.availWidth > window.screen.availHeight)
                {
                    this.width = window.screen.availWidth
                    this.height = window.screen.availHeight
                    this.pixelRatio = Math.min(window.devicePixelRatio, 2)
                    this.isLandscape = true
                    this.trigger('resize')
                }
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