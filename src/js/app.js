import '../css/global.css';
import '../css/homepage.css';
import '../css/project.css';

if (document.body.classList.contains('index'))
{
    import('./home-time.js').then(({default: initHomeTime}) =>
    {
        initHomeTime();
    });

    import('./content-reveal.js').then(async (transitions) =>
    {
        const { initRouter, setSceneCallbacks, isWorkRoute } = await import('./router.js');

        // Scene lifecycle — load above 1200px, hide below
        const { default: Sizes } = await import('../three/utils/sizes.js');
        const sizes = new Sizes();
        const canvas = document.querySelector('canvas.webgl');
        let sceneLoaded = false;

        async function enableScene()
        {
            if (!sceneLoaded)
            {
                const { default: Homepage } = await import(
                    '../three/scenes/homepage/experience.js'
                );
                new Homepage(canvas);
                sceneLoaded = true;
            }
            else
            {
                // Reset balloons if they were released during a previous transition
                const exp = window.experience;
                if (exp?.objects?.releasing)
                {
                    exp.objects.reset();
                }
            }
            canvas.style.opacity = '1';
            canvas.style.display = '';
        }

        function disableScene()
        {
            canvas.style.display = 'none';
            sceneLoaded = false;
        }

        function getExperience()
        {
            return window.experience || null;
        }

        // Responsive scene toggle — shared across initial load and navigate-back
        async function checkScene()
        {
            if (isWorkRoute()) return;
            if (sizes.width >= 1200) await enableScene();
            else disableScene();
        }
        sizes.on('resize', checkScene);

        // Wire scene callbacks into router
        setSceneCallbacks({ enableScene, disableScene, checkScene, getExperience });

        // Route-aware initialisation
        if (isWorkRoute())
        {
            // Direct visit to /work — show work immediately, no scene
            disableScene();
        }
        else
        {
            // Homepage — run content reveal, then enable scene
            await transitions.revealHome();
            checkScene();
        }

        initRouter();
    });
}

if (document.body.classList.contains('litho'))
{
    import('../css/project.css');

    import('../three/scenes/litho/experience.js').then(({default: Litho}) =>
    {
        new Litho(document.querySelector('canvas.webgl'));
    });
}

if (document.body.classList.contains('customuse'))
{
}

if (document.body.classList.contains('meta'))
{
}

