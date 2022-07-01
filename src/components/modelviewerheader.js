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
                <button onclick="window.history.back()";>Back</button>
            </header>
        `
    }
}

customElements.define('model-viewer-header-component', ModelViewerHeader)