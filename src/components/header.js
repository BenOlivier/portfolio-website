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
                    <a id="about-nav" href="/about.html">ABOUT</a>
                    <a id="work-nav" href="">WORK</a>
                    <a id="contact-nav" href="/contact.html">CONTACT</a>
                </nav>
                <button onclick="this.classList.toggle('collapsed');document.getElementById('nav').classList.toggle('expanded')">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </header>
        `

        // this.aboutNav = document.getElementById('about-nav')
        // this.workNav = document.getElementById('work-nav')
        // this.contactNav = document.getElementById('contact-nav')

        // this.aboutNav.addEventListener('click', function()
        // {
        //     this.aboutNav.classList.add('current')
        // })
    }
}

customElements.define('header-component', Header)