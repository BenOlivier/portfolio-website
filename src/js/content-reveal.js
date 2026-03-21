import gsap from 'gsap';

// --- Shared animation parameters ---
const BLUR = 6;
const TRANSLATE_Y = 32;
const DURATION = 0.5;
const STAGGER = 0.05;
const START_DELAY = 0.5;
const EXIT_DURATION = 0.3;
const OPACITY_EASE = 'power2.out';
const BLUR_EASE = 'power2.out';
const TRANSLATE_EASE = 'easeOutBack';
const PILL_DELAY = 0.15; // extra delay for pill after its card starts

// --- Element helpers ---

function getHomeRevealElements()
{
    const elements = [];

    const header = document.querySelector('.home-header');
    if (header) elements.push(header);

    const sections = document.querySelectorAll('.home-content > *');
    sections.forEach((section) =>
    {
        Array.from(section.children).forEach((child) =>
        {
            if (child.classList.contains('experience-list'))
            {
                child.querySelectorAll('.experience-entry').forEach((entry) =>
                {
                    elements.push(entry);
                });
            }
            else
            {
                elements.push(child);
            }
        });
    });

    return elements;
}

// --- Reveal homepage (staggered entrance) ---

export function revealHome(options = {})
{
    const startDelay = options.delay ?? START_DELAY;

    return new Promise((resolve) =>
    {
        const home = document.querySelector('.home');
        const homeContent = document.querySelector('.home-content');
        const elements = getHomeRevealElements();

        if (!elements.length)
        {
            resolve();
            return;
        }

        home.style.visibility = 'visible';
        homeContent.style.visibility = 'visible';
        homeContent.style.pointerEvents = 'auto';

        gsap.set(elements, {
            opacity: 0,
            y: TRANSLATE_Y,
            filter: `blur(${BLUR}px)`,
        });

        elements.forEach((el, i) =>
        {
            const delay = startDelay + i * STAGGER;
            const isLast = i === elements.length - 1;

            gsap.to(el, {
                opacity: 1,
                duration: DURATION,
                delay,
                ease: OPACITY_EASE,
                onComplete: isLast ? resolve : undefined,
            });

            gsap.to(el, {
                filter: 'blur(0px)',
                duration: DURATION,
                delay,
                ease: BLUR_EASE,
            });

            gsap.to(el, {
                y: 0,
                duration: DURATION,
                delay,
                ease: TRANSLATE_EASE,
            });
        });
    });
}

// --- Exit homepage (simultaneous fade out) ---

export function exitHome()
{
    return new Promise((resolve) =>
    {
        const homeContent = document.querySelector('.home-content');
        const elements = Array.from(homeContent.children);

        if (!elements.length)
        {
            resolve();
            return;
        }

        gsap.to(elements, {
            opacity: 0,
            filter: `blur(${BLUR}px)`,
            duration: EXIT_DURATION,
            ease: OPACITY_EASE,
            onComplete()
            {
                homeContent.style.visibility = 'hidden';
                homeContent.style.pointerEvents = 'none';
                resolve();
            },
        });
    });
}

// --- Reveal work (staggered card entrance) ---

export function revealWork()
{
    return new Promise((resolve) =>
    {
        const workContent = document.querySelector('.work-content');
        const cards = document.querySelectorAll('.work-card');
        const pills = document.querySelectorAll('.work-card-pill');

        if (!cards.length)
        {
            resolve();
            return;
        }

        workContent.style.visibility = 'visible';
        workContent.style.pointerEvents = 'auto';

        // Set initial state for cards
        gsap.set(cards, {
            opacity: 0,
            y: TRANSLATE_Y,
            filter: `blur(${BLUR}px)`,
        });

        // Set initial state for pills
        gsap.set(pills, {
            y: '100%',
        });

        // Fade in the container
        gsap.set(workContent, { opacity: 1 });

        cards.forEach((card, i) =>
        {
            const delay = START_DELAY + i * STAGGER;
            const isLast = i === cards.length - 1;

            gsap.to(card, {
                opacity: 1,
                duration: DURATION,
                delay,
                ease: OPACITY_EASE,
                onComplete: isLast ? resolve : undefined,
            });

            gsap.to(card, {
                filter: 'blur(0px)',
                duration: DURATION,
                delay,
                ease: BLUR_EASE,
            });

            gsap.to(card, {
                y: 0,
                duration: DURATION,
                delay,
                ease: TRANSLATE_EASE,
            });

            // Pill animates up from below the card
            const pill = card.querySelector('.work-card-pill');
            if (pill)
            {
                gsap.to(pill, {
                    y: '0%',
                    duration: DURATION,
                    delay: delay + PILL_DELAY,
                    ease: TRANSLATE_EASE,
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
        const workContent = document.querySelector('.work-content');
        const cards = document.querySelectorAll('.work-card');

        if (!cards.length)
        {
            resolve();
            return;
        }

        gsap.to(cards, {
            opacity: 0,
            filter: `blur(${BLUR}px)`,
            duration: EXIT_DURATION,
            ease: OPACITY_EASE,
            onComplete()
            {
                workContent.style.visibility = 'hidden';
                workContent.style.pointerEvents = 'none';
                gsap.set(workContent, { opacity: 0 });
                resolve();
            },
        });
    });
}

// --- Show work immediately (direct URL access, no animation) ---

export function showWorkImmediate()
{
    const home = document.querySelector('.home');
    const homeContent = document.querySelector('.home-content');
    const workContent = document.querySelector('.work-content');
    const cards = document.querySelectorAll('.work-card');
    const pills = document.querySelectorAll('.work-card-pill');

    home.style.visibility = 'visible';

    homeContent.style.visibility = 'hidden';
    homeContent.style.pointerEvents = 'none';

    workContent.style.visibility = 'visible';
    workContent.style.pointerEvents = 'auto';
    gsap.set(workContent, { opacity: 1 });
    gsap.set(cards, { opacity: 1, y: 0, filter: 'blur(0px)' });
    gsap.set(pills, { y: '0%' });
}
