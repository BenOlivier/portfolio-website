import gsap from 'gsap';

// --- Animation constants (desktop) ---
const MODAL_ENTER_DURATION = 0.6;
const MODAL_ENTER_Y = 64;
const MODAL_ENTER_EASE = 'back.out(1)';
const MODAL_SCRIM_DURATION = 0.3;
const MODAL_EXIT_DURATION = 0.3;
const MODAL_EXIT_Y = 48;
const MODAL_EXIT_EASE = 'power1.in';

// --- Animation constants (mobile) ---
const MOBILE_ENTER_DURATION = 0.45;
const MOBILE_ENTER_EASE = 'back.out(0.6)';
const MOBILE_EXIT_DURATION = 0.2;
const MOBILE_EXIT_EASE = 'none';
const MOBILE_SNAP_BACK_DURATION = 0.4;
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
            if (el.closest('.project-hero') || el.closest('.construction-overlay')) return;
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
    wrapper.className = 'media-wrapper';
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
        const isHero = el.closest('.project-hero');
        if (!isHero) wrapMediaElement(el);
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
    isDragging = true;
    dragStartY = e.touches ? e.touches[0].clientY : e.clientY;
    dragCurrentY = 0;
}

function onContentDragStart(e)
{
    // Only initiate dismiss drag when content is scrolled to the very top
    if (content.scrollTop > 0) return;
    onDragStart(e);
}

function onDragMove(e)
{
    if (!isDragging) return;

    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    dragCurrentY = Math.max(0, clientY - dragStartY);

    // Dismiss immediately once threshold is crossed — don't wait for release
    if (dragCurrentY >= DRAG_DISMISS_THRESHOLD)
    {
        isDragging = false;
        if (onCloseCallback) onCloseCallback({ fromDrag: true });
        return;
    }

    // Prevent content scroll while dragging down
    if (dragCurrentY > 0) e.preventDefault();

    // Apply transform directly for responsive feel
    gsap.set(modal, { y: dragCurrentY });

    // Fade scrim proportionally
    const progress = dragCurrentY / DRAG_DISMISS_THRESHOLD;
    gsap.set(scrim, { opacity: 1 - progress * 0.5 });
}

function onDragEnd()
{
    if (!isDragging) return;
    isDragging = false;

    // Snap back with bounce (threshold was not reached)
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

        // Initialise Three.js scene for projects that need it
        if (slug === 'litho')
        {
            const canvas = content.querySelector('canvas.webgl');
            if (canvas)
            {
                import('../three/scenes/litho/experience.js').then(({ default: Litho }) =>
                {
                    new Litho(canvas);
                }).catch((err) => console.error('[litho] scene init failed:', err));
            }
        }

        resolve();
    }

    // Animate modal — different behavior on mobile vs desktop
    if (isMobile())
    {
        // Set modal height from live viewport — dvh/vh are unreliable on Chrome Android
        // when the browser chrome has hidden and the visual viewport has grown.
        // window.innerHeight is always accurate at the moment of opening.
        gsap.set(modal, { height: window.innerHeight - 20 });

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
        // Dispose any active Three.js scene before clearing content
        if (window.experience?.dispose)
        {
            window.experience.dispose();
        }

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

    // Drag-to-dismiss (handle always, content only when scrolled to top)
    handle.addEventListener('touchstart', onDragStart, { passive: true });
    content.addEventListener('touchstart', onContentDragStart, { passive: true });
    window.addEventListener('touchmove', onDragMove, { passive: false });
    window.addEventListener('touchend', onDragEnd);
}
