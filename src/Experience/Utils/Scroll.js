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
        this.currentSection = 0
        this.currentSectionProgress = 0
        this.scroll = new LocomotiveScroll({
            el: document.querySelector('[data-scroll-container]'),
            smooth: true,
            lerp: 0.5,
            scrollFromAnywhere: true
        })

        this.objects = {
            hello: this.experience.objects.hello,
            litho: this.experience.objects.litho
        }

        function triggerAnimation(object, x, y, z)
        {
            gsap.to(object.position, {
                duration: 1,
                x: x,
                y: y,
                z: z,
                ease: "power3.out"
            })
        }

        this.scroll.on('scroll', (args) => {
            // Get all current elements
            
            if(typeof args.currentElements['about'])
            {
                this.currentSectionProgress = args.currentElements['about'].progress
                console.log(this.currentSectionProgress)

                if(this.currentSection == 0 && this.currentSectionProgress > 0.1)
                {
                    triggerAnimation(this.objects.hello, 0, 0, -4)
                    triggerAnimation(this.objects.litho, -0.5, 0, 0)
                    this.currentSection = 1

                    console.log('eureka')
                }
                if(this.currentSection == 1 && this.currentSectionProgress < 0.05)
                {
                    triggerAnimation(this.objects.hello, 0, 0, 0)
                    triggerAnimation(this.objects.litho, 0, -1, 0)
                    this.currentSection = 0
                }
            }
            if(typeof args.currentElements['work'])
            {
                // let progress = args.currentElements['work'].progress
                // console.log(progress)
            }
            if(typeof args.currentElements['contact'])
            {
                
            }
        })
    }
}