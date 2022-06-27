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
                <nav>
                    <a href="">ABOUT</a>
                    <a href="">WORK</a>
                    <a href="">CONTACT</a>
                </nav>
            </header>
        `
    }
}

customElements.define('header-component', Header)