let scrollingUp = true;
let lastScrollPos = 0;

// window.addEventListener('scroll', (e) =>
// {
//     if (lastScrollPos > window.scrollY && !isCeiling)
//     {
//         document.documentElement.style.background =
//             getComputedStyle(document.documentElement).getPropertyValue('--bg-white')
//         isCeiling = true
//     }
//     else if (lastScrollPos < window.scrollY && isCeiling)
//     {
//         document.documentElement.style.background = '#333333'
//         isCeiling = false
//     }

//     lastScrollPos = window.scrollY
// })

window.onscroll = () =>
{
    if (lastScrollPos > window.scrollY && !scrollingUp)
    {
        document.documentElement.style.background =
            getComputedStyle(document.documentElement).getPropertyValue('--bg-white')
            scrollingUp = true
    }
    else if (lastScrollPos < window.scrollY && scrollingUp)
    {
        document.documentElement.style.background = '#333333'
        scrollingUp = false
    }

    lastScrollPos = window.scrollY
}