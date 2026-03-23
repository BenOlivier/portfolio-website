import gsap from 'gsap';
import SplitType from 'split-type';

// --- Home content enter ---
const HOME_ENTER_BLUR = 6;
const HOME_ENTER_TRANSLATE_X = 0;
const HOME_ENTER_TRANSLATE_Y = 24;
const HOME_ENTER_DURATION = 0.6;
const HOME_ENTER_STAGGER = 0.04;
const HOME_ENTER_LINE_STAGGER = 0.02;
const HOME_ENTER_DELAY = 0.5;

// --- Home content exit ---
const HOME_EXIT_BLUR = 6;
const HOME_EXIT_TRANSLATE_X = 0;
const HOME_EXIT_TRANSLATE_Y = -24;
const HOME_EXIT_DURATION = 0.2;
const HOME_EXIT_DELAY = 0;

// --- Work cards enter ---
const WORK_ENTER_BLUR = 6;
const WORK_ENTER_TRANSLATE_X = 0;
const WORK_ENTER_TRANSLATE_Y = 24;
const WORK_ENTER_DURATION = 0.6;
const WORK_ENTER_STAGGER = 0.15;
const WORK_ENTER_DELAY = 0.2;
const WORK_VIDEO_DELAY = 0.2;
const WORK_VIDEO_DURATION = 0.8;
const WORK_VIDEO_EASE = 'power1.inOut';

// --- Work cards exit ---
const WORK_EXIT_BLUR = 6;
const WORK_EXIT_TRANSLATE_X = 0;
const WORK_EXIT_TRANSLATE_Y = -24;
const WORK_EXIT_DURATION = 0.2;
const WORK_EXIT_DELAY = 0;

// --- Shared easing ---
const ENTER_EASE = 'power2.out';
const EXIT_EASE = 'power2.in';

// --- SplitType state ---
let activeSplits = [];
let resizeHandler = null;
let revealComplete = false;
let pendingResolves = [];

function removePendingResolve(fn)
{
    const idx = pendingResolves.indexOf(fn);
    if (idx !== -1) pendingResolves.splice(idx, 1);
}

function revertSplits()
{
    activeSplits.forEach((s) => s.revert());
    activeSplits = [];
}

function teardownResize()
{
    if (resizeHandler)
    {
        window.removeEventListener('resize', resizeHandler);
        resizeHandler = null;
    }
}

function setupResize()
{
    teardownResize();
    let timer;
    resizeHandler = () =>
    {
        clearTimeout(timer);
        timer = setTimeout(() =>
        {
            if (!revealComplete || activeSplits.length === 0) return;

            // Remember which paragraphs were split
            const paragraphs = activeSplits.map((s) => s.elements).flat();

            // Revert and re-split
            revertSplits();
            for (const p of paragraphs)
            {
                const split = new SplitType(p, { types: 'lines' });
                activeSplits.push(split);
                gsap.set(split.lines, { opacity: 1, x: 0, y: 0, filter: 'blur(0px)' });
            }
        }, 200);
    };
    window.addEventListener('resize', resizeHandler);
}

// --- Element helpers ---

function getExitUnits()
{
    const units = [];

    const sections = document.querySelectorAll('.home-content > *');
    sections.forEach((section) =>
    {
        Array.from(section.children).forEach((child) =>
        {
            if (child.matches('.home-section > p'))
            {
                // Reuse active split if available
                const split = activeSplits.find((s) => s.elements.includes(child));
                if (split && split.lines.length)
                {
                    units.push({ type: 'lines', els: split.lines });
                }
                else
                {
                    units.push({ type: 'element', el: child });
                }
            }
            else
            {
                units.push({ type: 'element', el: child });
            }
        });
    });

    return units;
}

function getHomeRevealUnits()
{
    const units = [];

    const sections = document.querySelectorAll('.home-content > *');
    sections.forEach((section) =>
    {
        Array.from(section.children).forEach((child) =>
        {
            if (child.matches('.home-section > p'))
            {
                // Clear stale inline styles before splitting (prevents invisible text after interruption)
                gsap.set(child, { clearProps: 'all' });
                const split = new SplitType(child, { types: 'lines' });
                activeSplits.push(split);
                units.push({ type: 'lines', els: split.lines, split });
            }
            else
            {
                units.push({ type: 'element', el: child });
            }
        });
    });

    return units;
}

// --- Reveal homepage (staggered entrance) ---

export function revealHome(options = {})
{
    const startDelay = options.delay ?? HOME_ENTER_DELAY;

    return new Promise((resolve) =>
    {
        pendingResolves.push(resolve);
        const homeContent = document.querySelector('.home-content');

        // Clean up previous splits (re-navigation)
        revertSplits();
        teardownResize();
        revealComplete = false;

        const units = getHomeRevealUnits();

        if (!units.length)
        {
            removePendingResolve(resolve);
            resolve();
            return;
        }

        homeContent.style.display = '';
        homeContent.style.visibility = 'visible';
        homeContent.style.pointerEvents = 'auto';

        // Reset section containers (exitHome fades these to opacity 0 + blur)
        gsap.set(homeContent.children, {
            opacity: 1,
            x: 0,
            y: 0,
            filter: 'blur(0px)',
        });

        // Collect all animatable targets and set initial state
        const allTargets = [];
        for (const unit of units)
        {
            if (unit.type === 'lines')
            {
                allTargets.push(...unit.els);
            }
            else
            {
                allTargets.push(unit.el);
            }
        }

        gsap.set(allTargets, {
            opacity: 0,
            x: HOME_ENTER_TRANSLATE_X,
            y: HOME_ENTER_TRANSLATE_Y,
            filter: `blur(${HOME_ENTER_BLUR}px)`,
        });

        // Animate with clock-based delay
        let clock = startDelay;
        const lastTarget = allTargets[allTargets.length - 1];

        function animateTarget(el, delay)
        {
            gsap.to(el, {
                opacity: 1,
                duration: HOME_ENTER_DURATION,
                delay,
                ease: ENTER_EASE,
                onComplete: el === lastTarget ? onRevealComplete : undefined,
            });

            gsap.to(el, {
                filter: 'blur(0px)',
                duration: HOME_ENTER_DURATION,
                delay,
                ease: ENTER_EASE,
            });

            gsap.to(el, {
                x: 0,
                y: 0,
                duration: HOME_ENTER_DURATION,
                delay,
                ease: ENTER_EASE,
            });
        }

        function onRevealComplete()
        {
            removePendingResolve(resolve);
            revealComplete = true;
            setupResize();
            resolve();
        }

        for (const unit of units)
        {
            if (unit.type === 'lines')
            {
                for (const line of unit.els)
                {
                    animateTarget(line, clock);
                    clock += HOME_ENTER_LINE_STAGGER;
                }
                clock += HOME_ENTER_STAGGER - HOME_ENTER_LINE_STAGGER;
            }
            else
            {
                animateTarget(unit.el, clock);
                clock += HOME_ENTER_STAGGER;
            }
        }
    });
}

// --- Exit homepage (simultaneous fade out) ---

export function exitHome()
{
    return new Promise((resolve) =>
    {
        pendingResolves.push(resolve);
        const homeContent = document.querySelector('.home-content');

        // Build exit targets from the same unit structure as reveal
        // If splits are active, animate lines individually; otherwise fall back to sections
        const units = getExitUnits();

        if (!units.length)
        {
            removePendingResolve(resolve);
            resolve();
            return;
        }

        // Collect all targets into a flat list
        const allTargets = [];
        for (const unit of units)
        {
            if (unit.type === 'lines')
            {
                allTargets.push(...unit.els);
            }
            else
            {
                allTargets.push(unit.el);
            }
        }

        gsap.to(allTargets, {
            opacity: 0,
            x: HOME_EXIT_TRANSLATE_X,
            y: HOME_EXIT_TRANSLATE_Y,
            filter: `blur(${HOME_EXIT_BLUR}px)`,
            duration: HOME_EXIT_DURATION,
            delay: HOME_EXIT_DELAY,
            ease: EXIT_EASE,
            onComplete: onExitComplete,
        });

        function onExitComplete()
        {
            removePendingResolve(resolve);
            homeContent.style.visibility = 'hidden';
            homeContent.style.display = 'none';
            homeContent.style.pointerEvents = 'none';
            revertSplits();
            teardownResize();
            revealComplete = false;
            resolve();
        }
    });
}

// --- Reveal work (staggered card entrance) ---

export function revealWork()
{
    return new Promise((resolve) =>
    {
        pendingResolves.push(resolve);
        const workContent = document.querySelector('.work-content');
        const cards = document.querySelectorAll('.work-card-wrapper');

        if (!cards.length)
        {
            removePendingResolve(resolve);
            resolve();
            return;
        }

        workContent.style.display = 'block';
        workContent.style.visibility = 'visible';
        workContent.style.pointerEvents = 'auto';

        // Set initial state for cards
        gsap.set(cards, {
            opacity: 0,
            x: WORK_ENTER_TRANSLATE_X,
            y: WORK_ENTER_TRANSLATE_Y,
            filter: `blur(${WORK_ENTER_BLUR}px)`,
        });

        // Hide videos initially
        const videos = workContent.querySelectorAll('.work-card-media video');
        gsap.set(videos, { opacity: 0 });

        // Fade in the container
        gsap.set(workContent, { opacity: 1 });

        // Determine column count from computed grid style for per-row stagger
        const grid = workContent.querySelector('.work-grid');
        const cols = grid ?
            getComputedStyle(grid).gridTemplateColumns.split(' ').length :
            1;

        cards.forEach((card, i) =>
        {
            const row = Math.floor(i / cols);
            const delay = WORK_ENTER_DELAY + row * WORK_ENTER_STAGGER;
            const isLast = i === cards.length - 1;

            gsap.to(card, {
                opacity: 1,
                duration: WORK_ENTER_DURATION,
                delay,
                ease: ENTER_EASE,
                onComplete: isLast ? () => { removePendingResolve(resolve); resolve(); } : undefined,
            });

            gsap.to(card, {
                filter: 'blur(0px)',
                duration: WORK_ENTER_DURATION,
                delay,
                ease: ENTER_EASE,
            });

            gsap.to(card, {
                x: 0,
                y: 0,
                duration: WORK_ENTER_DURATION,
                delay,
                ease: ENTER_EASE,
            });

            // Fade in video after card appears
            const video = card.querySelector('.work-card-media video');
            if (video)
            {
                gsap.to(video, {
                    opacity: 1,
                    duration: WORK_VIDEO_DURATION,
                    delay: delay + WORK_VIDEO_DELAY,
                    ease: WORK_VIDEO_EASE,
                });
            }
        });
    });
}

// --- Exit work (simultaneous fade out) ---

export function exitWork()
{
    return new Promise((resolve) =>
    {
        pendingResolves.push(resolve);
        const workContent = document.querySelector('.work-content');
        const cards = document.querySelectorAll('.work-card-wrapper');

        if (!cards.length)
        {
            removePendingResolve(resolve);
            resolve();
            return;
        }

        gsap.to(cards, {
            opacity: 0,
            x: WORK_EXIT_TRANSLATE_X,
            y: WORK_EXIT_TRANSLATE_Y,
            filter: `blur(${WORK_EXIT_BLUR}px)`,
            duration: WORK_EXIT_DURATION,
            delay: WORK_EXIT_DELAY,
            ease: EXIT_EASE,
            onComplete()
            {
                removePendingResolve(resolve);
                workContent.style.visibility = 'hidden';
                workContent.style.display = 'none';
                workContent.style.pointerEvents = 'none';
                gsap.set(workContent, { opacity: 0 });
                resolve();
            },
        });
    });
}

// --- Kill all active tweens (for transition interruption) ---

export function killAllTweens()
{
    const homeContent = document.querySelector('.home-content');
    const workContent = document.querySelector('.work-content');

    if (homeContent)
    {
        gsap.killTweensOf(homeContent.querySelectorAll('*'));
        gsap.killTweensOf(Array.from(homeContent.children));
    }
    if (workContent)
    {
        gsap.killTweensOf(workContent.querySelectorAll('*'));
    }

    // Flush pending animation promises so interrupted async flows can complete
    const toResolve = pendingResolves;
    pendingResolves = [];
    toResolve.forEach((r) => r());

    // Clean up split state
    revertSplits();
    teardownResize();
    revealComplete = false;
}

// --- Reset both views to hidden (clean slate after abort) ---

export function resetViews()
{
    const homeContent = document.querySelector('.home-content');
    const workContent = document.querySelector('.work-content');

    if (homeContent)
    {
        homeContent.style.visibility = 'hidden';
        homeContent.style.display = 'none';
        homeContent.style.pointerEvents = 'none';
        gsap.set(Array.from(homeContent.children), { clearProps: 'all' });
    }
    if (workContent)
    {
        workContent.style.visibility = 'hidden';
        workContent.style.display = 'none';
        workContent.style.pointerEvents = 'none';
        gsap.set(workContent, { opacity: 0 });
        const workEls = '.work-card-wrapper, .work-card, .work-card-pill';
        gsap.set(workContent.querySelectorAll(workEls), { clearProps: 'all' });
    }
}

// --- Show work immediately (direct URL access, no animation) ---

export function showWorkImmediate()
{
    const homeContent = document.querySelector('.home-content');
    homeContent.style.visibility = 'hidden';
    homeContent.style.display = 'none';
    homeContent.style.pointerEvents = 'none';

    revealWork();
}
