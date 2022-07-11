// const isTouchDevice = () => {
//     return window.matchMedia("(pointer: coarse)").matches;
// };

if (screen.width < 750)
{
    const anchors = {
        lithoAnchor: document.getElementById('litho-anchor'),
        dioramaAnchor: document.getElementById('diorama-anchor'),
        threeDAnchor: document.getElementById('3d-anchor'),
        otherAnchor: document.getElementById('other-anchor'),
    };

    setEventListener = (element) =>
    {
        element.onclick = () =>
        {
            // If clicked on project has not already been clicked on
            if (!element.classList.contains('clickable'))
            {
                // Set all projects to not clickable
                Object.values(anchors).forEach((val) =>
                {
                    val.classList.remove('clickable');
                });
                // Set clicked on project to clickable
                element.classList.add('clickable');
                return false;
            }
        };
    };

    // Reset all projects to not clickable on page load
    window.onload = () =>
    {
        Object.values(anchors).forEach((val) =>
        {
            val.classList.remove('clickable');
        });
    };

    Object.values(anchors).forEach((val) =>
    {
        setEventListener(val);
    });

    // Set all projects to not clickable when clicking on background
    document.addEventListener('click', (e) =>
    {
        if (!e.target.classList.contains('image-container'))
        {
            Object.values(anchors).forEach((val) =>
            {
                val.classList.remove('clickable');
            });
        }
    });
}
