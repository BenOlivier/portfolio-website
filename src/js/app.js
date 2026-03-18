import '../css/style.css';
import '../css/header.css';
import '../css/footer.css';
import '../css/index.css';
import '../css/about.css';
import '../css/suggestions.css';
import '../css/work.css';
import '../css/litho.css';
import '../css/contact.css';

if (document.body.classList.contains('index'))
{
    import('../three/scenes/index/experience.js').then(({default: Index}) =>
    {
        new Index(document.querySelector('canvas.webgl'));
    });

    import('./home-time.js').then(({default: initHomeTime}) =>
    {
        initHomeTime();
    });
}

if (document.body.classList.contains('hello'))
{
    import('../three/scenes/hello/experience.js').then(({default: Hello}) =>
    {
        new Hello(document.querySelector('canvas.webgl'));
    });
}

if (document.body.classList.contains('litho'))
{
    import('../three/scenes/litho/experience.js').then(({default: Litho}) =>
    {
        new Litho(document.querySelector('canvas.webgl'));
    });
}
