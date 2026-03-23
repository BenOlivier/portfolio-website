import gsap from 'gsap';

// --- Animation constants (desktop) ---
const MODAL_ENTER_DURATION = 0.5;
const MODAL_ENTER_Y = 60;
const MODAL_ENTER_EASE = 'back.out(1.2)';
const MODAL_SCRIM_DURATION = 0.3;
const MODAL_EXIT_DURATION = 0.3;
const MODAL_EXIT_Y = 40;
const MODAL_EXIT_EASE = 'power2.in';

// --- Animation constants (mobile) ---
const MOBILE_ENTER_DURATION = 0.6;
const MOBILE_ENTER_EASE = 'back.out(0.6)';
const MOBILE_EXIT_DURATION = 0.3;
const MOBILE_EXIT_EASE = 'power2.in';
const MOBILE_SNAP_BACK_DURATION = 0.5;
const MOBILE_SNAP_BACK_EASE = 'back.out(0.6)';

// --- Drag-to-dismiss constants ---
const DRAG_DISMISS_THRESHOLD = 100;

// --- Mobile breakpoint ---
const MOBILE_BREAKPOINT = 768;

// --- Content cache ---
const contentCache = {};

// --- DOM references ---
let overlay;
let scrim;
let modal;
let content;
let closeBtn;
let handle;
let onCloseCallback;

// --- Drag state ---
let dragStartY = 0;
let dragCurrentY = 0;
let isDragging = false;

// --- Helpers ---

function isMobile()
{
    return window.innerWidth < MOBILE_BREAKPOINT;
}

// --- Fetch + parse project content ---

async function fetchProjectContent(slug)
{
    if (contentCache[slug]) return contentCache[slug];

    const response = await fetch(`/${slug}.html`);
    if (!response.ok) throw new Error(`Project not found: ${slug}`);

    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const container = doc.querySelector('.container');

    // Remove suggestions section (not needed in modal)
    const suggestions = container?.querySelector('.suggestions');
    if (suggestions) suggestions.remove();

    contentCache[slug] = container?.innerHTML || '';
    return contentCache[slug];
}

// --- Video pause/resume ---

function pauseWorkVideos()
{
    document.querySelectorAll('.work-card-media video').forEach((v) => v.pause());
}

function resumeWorkVideos()
{
    document.querySelectorAll('.work-card-media video').forEach((v) =>
    {
        v.play().catch(() => {});
    });
}

// --- Drag-to-dismiss (mobile) ---

function onDragStart(e)
{
    // Only allow drag when scrolled to top
    if (modal.scrollTop > 0) return;

    isDragging = true;
    dragStartY = e.touches ? e.touches[0].clientY : e.clientY;
    dragCurrentY = 0;
}

function onDragMove(e)
{
    if (!isDragging) return;

    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    dragCurrentY = Math.max(0, clientY - dragStartY);

    // Apply transform directly for responsive feel
    gsap.set(modal, { y: dragCurrentY });

    // Fade scrim proportionally
    const progress = Math.min(dragCurrentY / DRAG_DISMISS_THRESHOLD, 1);
    gsap.set(scrim, { opacity: 1 - progress * 0.5 });
}

function onDragEnd()
{
    if (!isDragging) return;
    isDragging = false;

    if (dragCurrentY >= DRAG_DISMISS_THRESHOLD)
    {
        // Dismiss — animate down off screen
        if (onCloseCallback) onCloseCallback({ fromDrag: true });
    }
    else
    {
        // Snap back with bounce
        gsap.to(modal, {
            y: 0,
            duration: MOBILE_SNAP_BACK_DURATION,
            ease: MOBILE_SNAP_BACK_EASE,
        });
        gsap.to(scrim, {
            opacity: 1,
            duration: MOBILE_SNAP_BACK_DURATION,
            ease: 'power2.out',
        });
    }
}

// --- Open modal ---

export async function openProjectModal(slug)
{
    pauseWorkVideos();

    // Fetch and inject content
    const html = await fetchProjectContent(slug);
    content.innerHTML = html;

    // Reset scroll position
    modal.scrollTop = 0;

    // Show overlay
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');

    // Animate scrim
    gsap.fromTo(scrim,
        { opacity: 0 },
        { opacity: 1, duration: MODAL_SCRIM_DURATION, ease: 'power1.out' },
    );

    // Animate modal — different behavior on mobile vs desktop
    if (isMobile())
    {
        return new Promise((resolve) =>
        {
            gsap.fromTo(modal,
                { y: window.innerHeight },
                {
                    y: 0,
                    duration: MOBILE_ENTER_DURATION,
                    ease: MOBILE_ENTER_EASE,
                    onComplete: resolve,
                },
            );
        });
    }

    return new Promise((resolve) =>
    {
        gsap.fromTo(modal,
            { opacity: 0, y: MODAL_ENTER_Y },
            {
                opacity: 1,
                y: 0,
                duration: MODAL_ENTER_DURATION,
                ease: MODAL_ENTER_EASE,
                onComplete: resolve,
            },
        );
    });
}

// --- Close modal ---

export async function closeProjectModal({ fromDrag = false } = {})
{
    gsap.to(scrim, {
        opacity: 0,
        duration: fromDrag ? MOBILE_EXIT_DURATION : MODAL_EXIT_DURATION,
        ease: fromDrag ? MOBILE_EXIT_EASE : MODAL_EXIT_EASE,
    });

    function onComplete()
    {
        overlay.classList.remove('active');
        overlay.setAttribute('aria-hidden', 'true');
        content.innerHTML = '';
        gsap.set(modal, { clearProps: 'all' });
        gsap.set(scrim, { clearProps: 'all' });
        resumeWorkVideos();
    }

    // Mobile drag dismiss — slide straight down
    if (fromDrag || isMobile())
    {
        return new Promise((resolve) =>
        {
            gsap.to(modal, {
                y: window.innerHeight,
                duration: MOBILE_EXIT_DURATION,
                ease: MOBILE_EXIT_EASE,
                onComplete()
                {
                    onComplete();
                    resolve();
                },
            });
        });
    }

    // Desktop — fade + translate
    return new Promise((resolve) =>
    {
        gsap.to(modal, {
            opacity: 0,
            y: MODAL_EXIT_Y,
            duration: MODAL_EXIT_DURATION,
            ease: MODAL_EXIT_EASE,
            onComplete()
            {
                onComplete();
                resolve();
            },
        });
    });
}

// --- Kill modal tweens (for transition interruption) ---

export function killModalTweens()
{
    if (modal) gsap.killTweensOf(modal);
    if (scrim) gsap.killTweensOf(scrim);
}

// --- Init ---

export function initProjectModal(onClose)
{
    overlay = document.querySelector('.modal-overlay');
    scrim = document.querySelector('.modal-scrim');
    modal = document.querySelector('.modal');
    content = document.querySelector('.modal-content');
    closeBtn = document.querySelector('.modal-close-button');
    handle = document.querySelector('.modal-handle');
    onCloseCallback = onClose;

    // Close button
    closeBtn.addEventListener('click', () =>
    {
        if (onCloseCallback) onCloseCallback();
    });

    // Scrim click
    scrim.addEventListener('click', () =>
    {
        if (onCloseCallback) onCloseCallback();
    });

    // Escape key
    document.addEventListener('keydown', (e) =>
    {
        if (e.key === 'Escape' && document.body.classList.contains('project-open'))
        {
            if (onCloseCallback) onCloseCallback();
        }
    });

    // Drag-to-dismiss (touch on handle area)
    handle.addEventListener('touchstart', onDragStart, { passive: true });
    window.addEventListener('touchmove', onDragMove, { passive: false });
    window.addEventListener('touchend', onDragEnd);
}
