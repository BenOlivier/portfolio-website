class ModelViewerHeader extends HTMLElement
{
    constructor()
    {
        super()
    }

    connectedCallback()
    {
        this.innerHTML = `
            <header id="model-viewer-header">
                <img src="/images/icons/arrow.svg" onclick="window.history.back()";>Back</img>
            </header>
        `
    }
}

customElements.define('model-viewer-header-component', ModelViewerHeader)