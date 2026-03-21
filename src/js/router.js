import { exitHome, revealWork, exitWork, revealHome, showWorkImmediate, killAllTweens } from './content-reveal.js';

let transitioning = false;
let transitionId = 0;
let sceneRef = null;
let sceneMethods = null; // { enableScene, disableScene, getExperience }

export function setSceneCallbacks(methods)
{
    sceneMethods = methods;
}

export function isWorkRoute()
{
    return location.pathname === '/work';
}

// --- Navigate to work ---

async function navigateToWork({ pushState = true } = {})
{
    if (transitioning)
    {
        killAllTweens();
    }

    const myId = ++transitionId;
    transitioning = true;

    if (pushState) history.pushState({}, '', '/work');

    // Release balloons + exit home content simultaneously
    const releasePromise = sceneMethods?.getExperience()?.objects?.release();
    const exitPromise = exitHome();
    const revealPromise = revealWork();

    await exitPromise;
    if (transitionId !== myId) return;

    await revealPromise;
    if (transitionId !== myId) return;

    // Wait for balloons to leave, then dispose scene
    if (releasePromise)
    {
        await releasePromise;
        if (transitionId !== myId) return;
    }
    if (sceneMethods)
    {
        const experience = sceneMethods.getExperience();
        if (experience) experience.dispose();
        sceneMethods.disableScene();
        sceneRef = null;
    }

    transitioning = false;
}

// --- Navigate to home ---

async function navigateToHome({ pushState = true } = {})
{
    if (transitioning)
    {
        killAllTweens();
    }

    const myId = ++transitionId;
    transitioning = true;

    if (pushState) history.pushState({}, '', '/');

    // Exit work + reveal home simultaneously
    const exitPromise = exitWork();
    const revealPromise = revealHome({ delay: 0.1 });

    await exitPromise;
    if (transitionId !== myId) return;

    await revealPromise;
    if (transitionId !== myId) return;

    // Re-enable 3D scene (balloons kept floating, new ones will spawn)
    if (sceneMethods)
    {
        await sceneMethods.enableScene();
        if (transitionId !== myId) return;
    }

    transitioning = false;
}

// --- Init ---

export function initRouter()
{
    // Intercept "See my work" pill button
    const workButton = document.querySelector('.home-pill-button[href="/work"]');
    if (workButton)
    {
        workButton.addEventListener('click', (e) =>
        {
            e.preventDefault();
            navigateToWork();
        });
    }

    // Intercept home header link (back to home)
    const homeLink = document.querySelector('.home-header a[href="/"]');
    if (homeLink)
    {
        homeLink.addEventListener('click', (e) =>
        {
            // Only intercept if we're on the work route or transitioning to it
            if (isWorkRoute() || transitioning)
            {
                e.preventDefault();
                navigateToHome();
            }
        });
    }

    // Handle browser back/forward
    window.addEventListener('popstate', () =>
    {
        if (isWorkRoute())
        {
            navigateToWork({ pushState: false });
        }
        else
        {
            navigateToHome({ pushState: false });
        }
    });

    // Direct URL access to /work
    if (isWorkRoute())
    {
        showWorkImmediate();
    }
}
