import './style.css'
import './css/header.css'
import './css/footer.css'
import './css/about.css'
import './css/work.css'
import './css/modelviewer.css'
import './css/3d.css'
import './css/contact.css'

import Homepage from './three/scenes/homepage/experience.js'
import ModelViewer from './three/scenes/model-viewer/experience.js'

if(document.body.classList.contains('index'))
{
    const experience = new Homepage(document.querySelector('canvas.webgl'))
}

if(document.body.classList.contains('model-viewer'))
{
    const model = localStorage.getItem('model-viewer-model')
    const experience = new ModelViewer(document.querySelector('canvas.webgl'), model)
}