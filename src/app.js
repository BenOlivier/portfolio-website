import './style.css'
import './css/about.css'
import './css/work.css'
import './css/contact.css'

import Experience from './three/experience.js'

if(document.body.classList.contains('index'))
{
    const experience = new Experience(document.querySelector('canvas.webgl'))
}