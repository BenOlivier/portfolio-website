let isCeiling = true

window.addEventListener('wheel', (e) => {

    const delta = e.deltaY

    if (delta < 0 && !isCeiling)
    {
        document.documentElement.style.background =
            getComputedStyle(document.documentElement).getPropertyValue('--bg-white')
        isCeiling = true
    }
    else if (delta > 0 && isCeiling)
    {
        document.documentElement.style.background = '#333333'
        isCeiling = false
    }
})