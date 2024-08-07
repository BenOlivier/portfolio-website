if (screen.width < 750)
{
    const anchors = {
        metaAnchor: document.getElementById('meta-anchor'),
        lithoAnchor: document.getElementById('litho-anchor'),
        endfieldAnchor: document.getElementById('endfield-anchor'),
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
        if (!e.target.classList.contains('work-image-container'))
        {
            Object.values(anchors).forEach((val) =>
            {
                val.classList.remove('clickable');
            });
        }
    });
}
