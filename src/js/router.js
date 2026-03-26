import { exitHome, revealWork, exitWork, revealHome, showWorkImmediate, killAllTweens } from './content-reveal.js';
import { openProjectModal, closeProjectModal, initProjectModal, killModalTweens } from './project-modal.js';

let transitioning = false;
let transitionId = 0;
// eslint-disable-next-line no-unused-vars
let sceneRef = null;
let sceneMethods = null; // { enableScene, disableScene, checkScene, getExperience }

export function setSceneCallbacks(methods)
{
    sceneMethods = methods;
}

export function isWorkRoute()
{
    return location.pathname === '/work' || location.pathname.startsWith('/work/');
}

function syncToggle(view)
{
    const buttons = document.querySelectorAll('.toggle-button');
    buttons.forEach((btn) =>
    {
        btn.classList.toggle('active', btn.dataset.view === view);
    });
}

export function getProjectSlug()
{
    const match = location.pathname.match(/^\/work\/([a-z0-9-]+)$/);
    return match ? match[1] : null;
}

// --- Navigate to work ---

async function navigateToWork({ pushState = true } = {})
{
    if (transitioning)
    {
        killAllTweens();
        killModalTweens();
    }

    // Close project modal if open (without pushState)
    if (document.body.classList.contains('project-open'))
    {
        document.body.classList.remove('project-open');
        await closeProjectModal();
    }

    const myId = ++transitionId;
    transitioning = true;

    if (pushState) history.pushState({}, '', '/work');
    document.body.classList.add('work');
    syncToggle('work');

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
        killModalTweens();
    }

    // Close project modal if open (without pushState)
    if (document.body.classList.contains('project-open'))
    {
        document.body.classList.remove('project-open');
        await closeProjectModal();
    }

    const myId = ++transitionId;
    transitioning = true;

    if (pushState) history.pushState({}, '', '/');
    document.body.classList.remove('work');
    syncToggle('about');

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
        await sceneMethods.checkScene();
        if (transitionId !== myId) return;
    }

    transitioning = false;
}

// --- Navigate to project ---

async function navigateToProject(slug, { pushState = true } = {})
{
    if (pushState) history.pushState({}, '', `/work/${slug}`);
    document.body.classList.add('project-open');
    await openProjectModal(slug);
}

// --- Close project ---

async function closeProject({ pushState = true, fromDrag = false } = {})
{
    document.body.classList.remove('project-open');
    if (pushState) history.pushState({}, '', '/work');
    await closeProjectModal({ fromDrag });
}

// --- Init ---

export function initRouter()
{
    // Init project modal with close callback
    initProjectModal((opts) => closeProject(opts));

    // Intercept "See my work" button
    const workButton = document.querySelector('.button[href="/work"]');
    if (workButton)
    {
        workButton.addEventListener('click', (e) =>
        {
            e.preventDefault();
            navigateToWork();
        });
    }

    // Toggle buttons
    const toggleButtons = document.querySelectorAll('.toggle-button');
    toggleButtons.forEach((btn) =>
    {
        btn.addEventListener('click', () =>
        {
            const view = btn.dataset.view;
            if (view === 'work' && !isWorkRoute())
            {
                toggleButtons.forEach((b) => b.classList.remove('active'));
                btn.classList.add('active');
                navigateToWork();
            }
            else if (view === 'about' && isWorkRoute())
            {
                toggleButtons.forEach((b) => b.classList.remove('active'));
                btn.classList.add('active');
                navigateToHome();
            }
        });
    });

    // Intercept work card clicks (event delegation)
    const workGrid = document.querySelector('.work-grid');
    if (workGrid)
    {
        workGrid.addEventListener('click', (e) =>
        {
            const card = e.target.closest('a.work-card[data-project]');
            if (!card) return;
            e.preventDefault();
            navigateToProject(card.dataset.project);
        });
    }

    // Intercept home header link (back to home)
    const homeLink = document.querySelector('.home-header a[href="/"]');
    if (homeLink)
    {
        homeLink.addEventListener('click', (e) =>
        {
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
        const slug = getProjectSlug();
        if (slug)
        {
            navigateToProject(slug, { pushState: false });
        }
        else if (location.pathname === '/work')
        {
            if (document.body.classList.contains('project-open'))
            {
                closeProject({ pushState: false });
            }
            else
            {
                navigateToWork({ pushState: false });
            }
        }
        else
        {
            navigateToHome({ pushState: false });
        }
    });

    // Direct URL access
    const slug = getProjectSlug();
    if (slug)
    {
        document.body.classList.add('work');
        syncToggle('work');
        showWorkImmediate();
        navigateToProject(slug, { pushState: false });
    }
    else if (location.pathname === '/work')
    {
        document.body.classList.add('work');
        syncToggle('work');
        showWorkImmediate();
    }
}
