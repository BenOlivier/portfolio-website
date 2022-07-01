import './style.css'
import './css/header.css'
import './css/footer.css'
import './css/modelviewer.css'
import './css/about.css'
import './css/work.css'
import './css/contact.css'

// import Experience from './three/scenes/hello/experience.js'
import Maven from './three/scenes/maven/maven.js'

if(document.body.classList.contains('index'))
{
    const experience = new Experience(document.querySelector('canvas.webgl'))
}

if(document.body.classList.contains('litho'))
{
    const experience = new Experience(document.querySelector('canvas.webgl'))
}

if(document.body.classList.contains('maven'))
{
    const experience = new Maven(document.querySelector('canvas.webgl'))
}