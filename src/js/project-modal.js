import gsap from 'gsap';

// --- Animation constants ---
const MODAL_ENTER_DURATION = 0.5;
const MODAL_ENTER_Y = 60;
const MODAL_ENTER_EASE = 'power2.out';
const MODAL_SCRIM_DURATION = 0.3;
const MODAL_EXIT_DURATION = 0.3;
const MODAL_EXIT_Y = 40;
const MODAL_EXIT_EASE = 'power2.in';

// --- Drag-to-dismiss constants ---
const DRAG_DISMISS_THRESHOLD = 120;
const DRAG_SNAP_BACK_DURATION = 0.3;

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
    modal.style.transition = 'none';
}

function onDragMove(e)
{
    if (!isDragging) return;

    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    dragCurrentY = Math.max(0, clientY - dragStartY);

    // Apply transform directly for responsive feel
    modal.style.transform = `translateY(${dragCurrentY}px)`;

    // Fade scrim proportionally
    const progress = Math.min(dragCurrentY / DRAG_DISMISS_THRESHOLD, 1);
    scrim.style.opacity = 1 - progress * 0.5;
}

function onDragEnd()
{
    if (!isDragging) return;
    isDragging = false;
    modal.style.transition = '';

    if (dragCurrentY >= DRAG_DISMISS_THRESHOLD)
    {
        // Dismiss
        if (onCloseCallback) onCloseCallback();
    }
    else
    {
        // Snap back
        gsap.to(modal, {
            y: 0,
            duration: DRAG_SNAP_BACK_DURATION,
            ease: 'power2.out',
        });
        gsap.to(scrim, {
            opacity: 1,
            duration: DRAG_SNAP_BACK_DURATION,
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

    // Animate modal
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

export async function closeProjectModal()
{
    gsap.to(scrim, {
        opacity: 0,
        duration: MODAL_EXIT_DURATION,
        ease: MODAL_EXIT_EASE,
    });

    return new Promise((resolve) =>
    {
        gsap.to(modal, {
            opacity: 0,
            y: MODAL_EXIT_Y,
            duration: MODAL_EXIT_DURATION,
            ease: MODAL_EXIT_EASE,
            onComplete()
            {
                overlay.classList.remove('active');
                overlay.setAttribute('aria-hidden', 'true');
                content.innerHTML = '';
                modal.style.transform = '';
                scrim.style.opacity = '';
                resumeWorkVideos();
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
