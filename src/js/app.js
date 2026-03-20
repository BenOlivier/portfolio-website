import '../css/global.css';
import '../css/header.css';
import '../css/footer.css';

if (document.body.classList.contains('index'))
{
    import('../css/homepage.css');

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
                const {default: Homepage} = await import(
                    '../three/scenes/homepage/experience.js'
                );
                new Homepage(canvas);
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

if (document.body.classList.contains('about'))
{
    import('../css/about.css');
}

if (document.body.classList.contains('work-page'))
{
    import('../css/work.css');
}

if (document.body.classList.contains('litho'))
{
    import('../css/litho.css');
    import('../css/related-projects.css');

    import('../three/scenes/litho/experience.js').then(({default: Litho}) =>
    {
        new Litho(document.querySelector('canvas.webgl'));
    });
}

if (document.body.classList.contains('customuse'))
{
    import('../css/related-projects.css');
}

if (document.body.classList.contains('meta'))
{
    import('../css/related-projects.css');
}

if (document.body.classList.contains('contact'))
{
    import('../css/contact.css');
}
