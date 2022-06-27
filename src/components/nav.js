class Nav extends HTMLElement
{
    constructor()
    {
      super()
    }

    connectedCallback()
    {
        this.innerHTML = `
            <nav class="nav">
                <img id="home-button" src="/images/icons/homedark.png" alt="Home" onclick="location.reload()">
                <img id="dark-mode-button" src="/images/icons/darkmode.png" alt="Dark Mode">
            </nav>
        `
    }
}

customElements.define('nav-component', Nav)