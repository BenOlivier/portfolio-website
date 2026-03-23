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

// --- Media fade ---
const MEDIA_FADE_DURATION = 1.2;

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

    // Defer media loading — rewrite src to data-src
    if (container)
    {
        container.querySelectorAll('img[src], iframe[src]').forEach((el) =>
        {
            el.setAttribute('data-src', el.getAttribute('src'));
            el.removeAttribute('src');
        });
        container.querySelectorAll('source[src]').forEach((el) =>
        {
            el.setAttribute('data-src', el.getAttribute('src'));
            el.removeAttribute('src');
        });
    }

    contentCache[slug] = container?.innerHTML || '';
    return contentCache[slug];
}

// --- Lazy media loading ---

function wrapMediaElement(el)
{
    const wrapper = document.createElement('div');
    wrapper.style.background = 'var(--bg-light-2)';
    wrapper.style.borderRadius = '12px';
    wrapper.style.overflow = 'hidden';
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
    return wrapper;
}

function loadMedia()
{
    content.querySelectorAll('[data-src]').forEach((el) =>
    {
        if (el.tagName === 'SOURCE')
        {
            const video = el.closest('video');
            if (video)
            {
                wrapMediaElement(video);
                gsap.set(video, { opacity: 0 });
                el.setAttribute('src', el.getAttribute('data-src'));
                el.removeAttribute('data-src');
                video.load();
                video.addEventListener('loadeddata', () =>
                {
                    gsap.to(video, {
                        opacity: 1,
                        duration: MEDIA_FADE_DURATION,
                        ease: 'power1.out',
                    });
                }, { once: true });
            }
            return;
        }

        // IMG and IFRAME — wrap in placeholder, hide, set src, fade on load
        wrapMediaElement(el);
        gsap.set(el, { opacity: 0 });
        el.setAttribute('src', el.getAttribute('data-src'));
        el.removeAttribute('data-src');

        el.addEventListener('load', () =>
        {
            gsap.to(el, {
                opacity: 1,
                duration: MEDIA_FADE_DURATION,
                ease: 'power1.out',
            });
        }, { once: true });
    });
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

    // Fetch and inject content (media src deferred to data-src)
    const html = await fetchProjectContent(slug);
    content.innerHTML = html;

    // Reset scroll position
    modal.scrollTop = 0;

    // Show overlay
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');

    // Wait one frame for layout to settle before animating
    await new Promise((r) => requestAnimationFrame(r));

    modal.style.willChange = 'transform';

    // Animate scrim
    gsap.fromTo(scrim,
        { opacity: 0 },
        { opacity: 1, duration: MODAL_SCRIM_DURATION, ease: 'power1.out' },
    );

    function onAnimComplete(resolve)
    {
        modal.style.willChange = '';
        loadMedia();
        resolve();
    }

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
                    onComplete: () => onAnimComplete(resolve),
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
                onComplete: () => onAnimComplete(resolve),
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
