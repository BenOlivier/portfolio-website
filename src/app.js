import './style.css'
import './css/header.css'
import './css/footer.css'
import './css/modelviewer.css'
import './css/about.css'
import './css/work.css'
import './css/contact.css'

import Homepage from './three/scenes/homepage/experience.js'
import Maven from './three/scenes/maven/maven.js'
import AbstractForm from './three/scenes/abstract-form/abstract-form.js'

if(document.body.classList.contains('index'))
{
    const experience = new Homepage(document.querySelector('canvas.webgl'))
}

if(document.body.classList.contains('litho'))
{
    const experience = new Experience(document.querySelector('canvas.webgl'))
}

if(document.body.classList.contains('maven'))
{
    const experience = new Maven(document.querySelector('canvas.webgl'))
}

if(document.body.classList.contains('abstract-form'))
{
    const experience = new AbstractForm(document.querySelector('canvas.webgl'))
}