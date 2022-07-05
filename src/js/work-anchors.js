// const isTouchDevice = () => {  
//     return window.matchMedia("(pointer: coarse)").matches  
// }

if(window.innerWidth < 750)
{
    const anchors = {
        lithoAnchor: document.getElementById('litho-anchor'),
        dioramaAnchor: document.getElementById('diorama-anchor'),
        threeDAnchor: document.getElementById('3d-anchor'),
        otherAnchor: document.getElementById('other-anchor')
    }

    window.onload = function() {
        Object.values(anchors).forEach(val => {
            val.classList.remove('clickable')
        })
    }
    
    Object.values(anchors).forEach(val => {
        SetEventListeners(val)
    })
    
    function SetEventListeners(element)
    {
        element.onclick = function()
        {
            if(!element.classList.contains('clickable'))
            {
                Object.values(anchors).forEach(val => {
                    val.classList.remove('clickable')
                })
                element.classList.add('clickable')
                return false
            }
        }
    }
    
    document.addEventListener('click', (e) =>
    {
        if (!e.target.classList.contains('image-container')) {
            Object.values(anchors).forEach(val => {
                val.classList.remove('clickable')
            })
        }
    })
}