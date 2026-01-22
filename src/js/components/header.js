class Header extends HTMLElement
{
    constructor()
    {
        super();
    }

    connectedCallback()
    {
        this.innerHTML = `
            <header id="header">
                <a id="home-button" href="/">BEN OLIVIER</a>
                <nav id="nav">
                    <a id="work-nav" href="/work.html">WORK</a>
                    <a id="about-nav" href="/about.html">ABOUT</a>
                    <a id="contact-nav" href="/contact.html">CONTACT</a>
                </nav>
                <button aria-label="Toggle navigation menu">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </header>
        `;

        const menuButton = this.querySelector('button');
        const nav = document.getElementById('nav');
        menuButton.addEventListener('click', () =>
        {
            menuButton.classList.toggle('collapsed');
            nav.classList.toggle('expanded');
        });

        const aboutNav = document.getElementById('about-nav');
        const workNav = document.getElementById('work-nav');
        const contactNav = document.getElementById('contact-nav');

        if (document.body.classList.contains('about')) aboutNav.classList.add('current');
        if (document.body.classList.contains('work')) workNav.classList.add('current');
        if (document.body.classList.contains('contact')) contactNav.classList.add('current');
    }
}

customElements.define('header-component', Header);
