class Header extends HTMLElement
{
    constructor()
    {
      super()
    }

    connectedCallback()
    {
        this.innerHTML = `
            <header>
                <h1><a href="/index.html">Ben Olivier</a></h1>
                <nav id="nav">
                    <a href="/about.html">ABOUT</a>
                    <a href="">WORK</a>
                    <a href="/contact.html">CONTACT</a>
                </nav>
                <button onclick="this.classList.toggle('collapsed');document.getElementById('nav').classList.toggle('expanded')">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </header>
        `
    }
}

customElements.define('header-component', Header)