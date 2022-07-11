let scrollingUp = true;
let lastScrollPos = 0;

window.onscroll = () =>
{
    // If scrolling up
    if (lastScrollPos > window.scrollY && !scrollingUp)
    {
        // Set light background
        document.documentElement.style.background =
            getComputedStyle(document.documentElement)
            .getPropertyValue('--bg-white');
        scrollingUp = true;
    }
    // Otherwise, if scrolling down
    else if (lastScrollPos < window.scrollY && scrollingUp)
    {
        // Set dark background
        document.documentElement.style.background = '#333333';
        scrollingUp = false;
    }

    lastScrollPos = window.scrollY;
};
