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
    import('./home-time.js').then(({default: initHomeTime}) =>
    {
        initHomeTime();
    });

    import('./content-reveal.js').then(async ({default: initContentReveal}) =>
    {
        await initContentReveal();

        // Scene lifecycle — load above 1200px, hide below
        const {default: Sizes} = await import('../three/utils/sizes.js');
        const sizes = new Sizes();
        const canvas = document.querySelector('canvas.webgl');
        let sceneLoaded = false;

        async function enableScene()
        {
            if (!sceneLoaded)
            {
                const {default: Index} = await import(
                    '../three/scenes/index/experience.js'
                );
                new Index(canvas);
                sceneLoaded = true;
            }
            canvas.style.display = '';
        }

        function disableScene()
        {
            canvas.style.display = 'none';
        }

        function checkScene()
        {
            if (sizes.width >= 1200) enableScene();
            else disableScene();
        }

        checkScene();
        sizes.on('resize', checkScene);
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
