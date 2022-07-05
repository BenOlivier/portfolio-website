import EventEmitter from './event-emitter.js'

export default class Sizes extends EventEmitter
{
    constructor()
    {
        super()

        // // If using a mobile device
        // if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
        // {
        //     this.width = window.screen.availWidth
        //     this.height = window.screen.availHeight
        //     this.pixelRatio = Math.min(window.devicePixelRatio, 2)
        //     this.mobile = true
        // }

        // if(this.width < 800) this.mobile = true
        // else this.mobile = false

        // if(this.mobile)
        // {
        //     if(this.width > 800)
        //     {
        //         this.mobile = false
        //         this.trigger('desktop')
        //     }
        // }
        // else
        // {
        //     if(this.width < 800)
        //     {
        //         this.mobile = true
        //         this.trigger('mobile')
        //     }
        // }
        
        this.width = window.innerWidth
        this.height = window.innerHeight
        this.pixelRatio = Math.min(window.devicePixelRatio, 2)

        // Resize event
        window.addEventListener('resize', () =>
        {
            this.width = window.innerWidth
            this.height = window.innerHeight
            this.pixelRatio = Math.min(window.devicePixelRatio, 2)

            this.trigger('resize')
        })
    }
}