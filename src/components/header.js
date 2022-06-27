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
                <h1 onclick="location.reload()">Ben Olivier</h1>
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