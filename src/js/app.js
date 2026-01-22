import '../css/style.css';
import '../css/header.css';
import '../css/footer.css';
import '../css/about.css';
import '../css/suggestions.css';
import '../css/work.css';
import '../css/litho.css';
import '../css/contact.css';

import Homepage from '../three/scenes/homepage/experience.js';
import Litho from '../three/scenes/litho/experience.js';

if (document.body.classList.contains('index'))
{
    new Homepage(document.querySelector('canvas.webgl'));
}

if (document.body.classList.contains('litho'))
{
    new Litho(document.querySelector('canvas.webgl'));
}
