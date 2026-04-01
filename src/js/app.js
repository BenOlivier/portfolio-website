import '../css/global.css';
import '../css/homepage.css';
import '../css/project.css';
import * as transitions from './content-reveal.js';

if (document.body.classList.contains('index'))
{
    import('./home-time.js').then(({default: initHomeTime}) =>
    {
        initHomeTime();
    });

    (async () =>
    {
        // Inline route check — no need to wait for router.js to read location.pathname
        const isWork = location.pathname === '/work' || location.pathname.startsWith('/work/');

        // Start animation immediately — don't wait for router/sizes to load
        const revealPromise = isWork ? null : transitions.revealHome();
        if (isWork) transitions.showWorkImmediate();

        // Load router + sizes in parallel while animation is already running
        const [{ initRouter, setSceneCallbacks }, { default: Sizes }] = await Promise.all([
            import('./router.js'),
            import('../three/utils/sizes.js'),
        ]);

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
            if (location.pathname === '/work' || location.pathname.startsWith('/work/')) return;
            if (sizes.width >= 1080) await enableScene();
            else disableScene();
        }
        sizes.on('resize', checkScene);

        // Wire scene callbacks into router
        setSceneCallbacks({ enableScene, disableScene, checkScene, getExperience });

        // Wait for reveal to finish before loading Three.js scene
        if (revealPromise) await revealPromise;
        if (!isWork) checkScene();

        initRouter();
    })();
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
