import gsap from 'gsap';
import SplitType from 'split-type';

// --- Home content animation parameters ---
const HOME_BLUR = 6;
const HOME_TRANSLATE_X = -24;
const HOME_DURATION = 0.6;
const HOME_STAGGER = 0.04;
const HOME_LINE_STAGGER = 0.02;
const HOME_START_DELAY = 0.5;
const HOME_EXIT_DURATION = 0.3;

// --- Work cards animation parameters ---
const WORK_BLUR = 6;
const WORK_TRANSLATE_X = 24;
const WORK_DURATION = 1.2;
const WORK_STAGGER = 0.04;
const WORK_START_DELAY = 0.5;
const WORK_EXIT_DURATION = 0.3;

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
                gsap.set(split.lines, { opacity: 1, x: 0, filter: 'blur(0px)' });
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
            if (child.classList.contains('experience-list'))
            {
                child.querySelectorAll('.experience-entry').forEach((entry) =>
                {
                    units.push({ type: 'element', el: entry });
                });
            }
            else if (child.matches('.home-section > p'))
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
            if (child.classList.contains('experience-list'))
            {
                child.querySelectorAll('.experience-entry').forEach((entry) =>
                {
                    units.push({ type: 'element', el: entry });
                });
            }
            else if (child.matches('.home-section > p'))
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
    const startDelay = options.delay ?? HOME_START_DELAY;

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

        homeContent.style.visibility = 'visible';
        homeContent.style.pointerEvents = 'auto';

        // Reset section containers (exitHome fades these to opacity 0 + blur)
        gsap.set(homeContent.children, {
            opacity: 1,
            x: 0,
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
            x: HOME_TRANSLATE_X,
            filter: `blur(${HOME_BLUR}px)`,
        });

        // Animate with clock-based delay
        let clock = startDelay;
        const lastTarget = allTargets[allTargets.length - 1];

        function animateTarget(el, delay)
        {
            gsap.to(el, {
                opacity: 1,
                duration: HOME_DURATION,
                delay,
                ease: ENTER_EASE,
                onComplete: el === lastTarget ? onRevealComplete : undefined,
            });

            gsap.to(el, {
                filter: 'blur(0px)',
                duration: HOME_DURATION,
                delay,
                ease: ENTER_EASE,
            });

            gsap.to(el, {
                x: 0,
                duration: HOME_DURATION,
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
                    clock += HOME_LINE_STAGGER;
                }
                clock += HOME_STAGGER - HOME_LINE_STAGGER;
            }
            else
            {
                animateTarget(unit.el, clock);
                clock += HOME_STAGGER;
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

        // Build flat targets list with clock-based stagger
        let clock = 0;
        const tweens = [];

        for (const unit of units)
        {
            if (unit.type === 'lines')
            {
                for (const line of unit.els)
                {
                    tweens.push({ el: line, delay: clock });
                    clock += HOME_LINE_STAGGER;
                }
                clock += HOME_STAGGER - HOME_LINE_STAGGER;
            }
            else
            {
                tweens.push({ el: unit.el, delay: clock });
                clock += HOME_STAGGER;
            }
        }

        const lastTween = tweens[tweens.length - 1];

        for (const { el, delay } of tweens)
        {
            const isLast = el === lastTween.el;

            gsap.to(el, {
                opacity: 0,
                x: HOME_TRANSLATE_X,
                filter: `blur(${HOME_BLUR}px)`,
                duration: HOME_EXIT_DURATION,
                delay,
                ease: EXIT_EASE,
                onComplete: isLast ? onExitComplete : undefined,
            });
        }

        function onExitComplete()
        {
            removePendingResolve(resolve);
            homeContent.style.visibility = 'hidden';
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
        const cards = document.querySelectorAll('.work-card');

        if (!cards.length)
        {
            removePendingResolve(resolve);
            resolve();
            return;
        }

        workContent.style.visibility = 'visible';
        workContent.style.pointerEvents = 'auto';

        // Set initial state for cards
        gsap.set(cards, {
            opacity: 0,
            x: WORK_TRANSLATE_X,
            filter: `blur(${WORK_BLUR}px)`,
        });

        // Fade in the container
        gsap.set(workContent, { opacity: 1 });

        cards.forEach((card, i) =>
        {
            const delay = WORK_START_DELAY + i * WORK_STAGGER;
            const isLast = i === cards.length - 1;

            gsap.to(card, {
                opacity: 1,
                duration: WORK_DURATION,
                delay,
                ease: ENTER_EASE,
                onComplete: isLast ? () => { removePendingResolve(resolve); resolve(); } : undefined,
            });

            gsap.to(card, {
                filter: 'blur(0px)',
                duration: WORK_DURATION,
                delay,
                ease: ENTER_EASE,
            });

            gsap.to(card, {
                x: 0,
                duration: WORK_DURATION,
                delay,
                ease: ENTER_EASE,
            });
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
        const cards = document.querySelectorAll('.work-card');

        if (!cards.length)
        {
            removePendingResolve(resolve);
            resolve();
            return;
        }

        gsap.to(cards, {
            opacity: 0,
            x: WORK_TRANSLATE_X,
            filter: `blur(${WORK_BLUR}px)`,
            duration: WORK_EXIT_DURATION,
            stagger: WORK_STAGGER,
            ease: EXIT_EASE,
            onComplete()
            {
                removePendingResolve(resolve);
                workContent.style.visibility = 'hidden';
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
        homeContent.style.pointerEvents = 'none';
        gsap.set(Array.from(homeContent.children), { clearProps: 'all' });
    }
    if (workContent)
    {
        workContent.style.visibility = 'hidden';
        workContent.style.pointerEvents = 'none';
        gsap.set(workContent, { opacity: 0 });
        gsap.set(workContent.querySelectorAll('.work-card, .work-card-pill'), { clearProps: 'all' });
    }
}

// --- Show work immediately (direct URL access, no animation) ---

export function showWorkImmediate()
{
    const homeContent = document.querySelector('.home-content');
    const workContent = document.querySelector('.work-content');
    const cards = document.querySelectorAll('.work-card');

    homeContent.style.visibility = 'hidden';
    homeContent.style.pointerEvents = 'none';

    workContent.style.visibility = 'visible';
    workContent.style.pointerEvents = 'auto';
    gsap.set(workContent, { opacity: 1 });
    gsap.set(cards, { opacity: 1, x: 0, filter: 'blur(0px)' });
}
