import * as THREE from 'three'
import gsap from 'gsap'
import Experience from '../Experience.js'
import LocomotiveScroll from 'locomotive-scroll'

export default class Scroll
{
    constructor()
    {
        // Setup
        this.experience = new Experience()
        this.objects = this.experience.objects
        this.currentSection = 0
        this.currentSectionProgress = 0
        this.scroll = new LocomotiveScroll({
            el: document.querySelector('[data-scroll-container]'),
            smooth: true,
            lerp: 0.5,
            scrollFromAnywhere: true
        })

        this.params = {
            inDuration: 1,
            outDuration: 0.5,
            delay: 0.2
        }

        function triggerAnimation(object, x, y, z, durarion, delay, ease)
        {
            gsap.to(object.position, {
                x: x,
                y: y,
                z: z,
                duration: durarion,
                delay: delay,
                ease: ease
            })
        }

        this.scroll.on('scroll', (args) => {
            // Get all current elements
            
            if(typeof args.currentElements['about'])
            {
                this.currentSectionProgress = args.currentElements['about'].progress
                // console.log(this.currentSectionProgress)

                if(this.currentSection == 0 && this.currentSectionProgress > 0.15)
                {
                    triggerAnimation(this.objects.hello, 0, 0, -6,
                        this.params.outDuration, 0, "power3.in")
                    triggerAnimation(this.objects.scan, -0.5, 0, 0,
                        this.params.inDuration, this.params.delay, "power3.out")
                    this.currentSection = 1
                    this.objects.currentObject = 1
                }
                if(this.currentSection == 1 && this.currentSectionProgress < 0.1)
                {
                    triggerAnimation(this.objects.hello, 0, 0, 0,
                        this.params.inDuration, this.params.delay, "power3.out")
                    triggerAnimation(this.objects.scan, 0, -1, 0,
                        this.params.outDuration, 0, "power3.in")
                    this.currentSection = 0
                    this.objects.currentObject = 0
                }
            }
            if(typeof args.currentElements['work'])
            {
                
            }
            if(typeof args.currentElements['contact'])
            {
                
            }
        })
    }
}