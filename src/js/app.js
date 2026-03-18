import '../css/style.css';
import '../css/header.css';
import '../css/footer.css';
import '../css/about.css';
import '../css/suggestions.css';
import '../css/work.css';
import '../css/litho.css';
import '../css/contact.css';

if (document.body.classList.contains('index'))
{
    import('../three/scenes/homepage/experience.js').then(({default: Homepage}) =>
    {
        new Homepage(document.querySelector('canvas.webgl'));
    });
}

if (document.body.classList.contains('litho'))
{
    import('../three/scenes/litho/experience.js').then(({default: Litho}) =>
    {
        new Litho(document.querySelector('canvas.webgl'));
    });
}
