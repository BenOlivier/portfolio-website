import gsap from 'gsap';

// --- Reveal controls ---
const INITIAL_BLUR = 6; // px — starting blur amount
const TRANSLATE_Y = 32; // px — starting vertical offset (moves up)
const DURATION = 0.5; // seconds — animation duration per element
const STAGGER = 0.05; // seconds — delay between each row
const START_DELAY = 0.5; // seconds — delay before first element animates
const OPACITY_EASE = 'power2.out';
const BLUR_EASE = 'power2.out';
const TRANSLATE_EASE = 'easeOutBack';

function getRevealElements()
{
    const elements = [];
    const sections = document.querySelectorAll('.home > *');

    sections.forEach((section) =>
    {
        // Header: animate as one unit
        if (section.classList.contains('home-header'))
        {
            elements.push(section);
            return;
        }

        // Expand section children into individual rows
        Array.from(section.children).forEach((child) =>
        {
            if (child.classList.contains('experience-list'))
            {
                // Each experience entry is its own row
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

export default function initContentReveal()
{
    return new Promise((resolve) =>
    {
        const home = document.querySelector('.home');
        const elements = getRevealElements();
        if (!elements.length)
        {
            resolve();
            return;
        }

        // Make container visible — individual elements stay hidden via gsap.set below
        home.style.visibility = 'visible';

        gsap.set(elements, {
            opacity: 0,
            y: TRANSLATE_Y,
            filter: `blur(${INITIAL_BLUR}px)`,
        });

        elements.forEach((el, i) =>
        {
            const delay = START_DELAY + i * STAGGER;
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
