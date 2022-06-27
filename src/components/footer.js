class Footer extends HTMLElement
{
    constructor()
    {
      super()
    }

    connectedCallback()
    {
        this.innerHTML = `
            <footer class="footer">
                <h3>&copy;&nbsp;2022&nbsp;BEN OLIVIER</h3>
                <div>
                    <a href="mailto:dbeolivier@gmail.com"><img src="/images/icons/mail.svg"></a>
                    <a href="https://linkedin.com/in/ben-olivier-38b901145/" target="_blank"><img src="/images/icons/linkedin.svg"></a>
                    <a href="https://github.com/BenOlivier" target="_blank"><img src="/images/icons/github.svg"></a>
                    <a href="https://twitter.com/benolivier_" target="_blank"><img src="/images/icons/twitter.svg"></a>
                </div>
            </footer>
        `
    }
}

customElements.define('footer-component', Footer)