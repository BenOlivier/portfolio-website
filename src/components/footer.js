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
                <p>&copy;&nbsp;<script>document.write(new Date().getFullYear())</script>&nbsp;Ben Olivier</p>
                <div>
                    <a href="mailto:dbeolivier@gmail.com">Email</a>
                    <a href="https://www.linkedin.com/in/ben-olivier-38b901145/" target="_blank">LinkedIn</a>
                    <a href="https://github.com/BenOlivier" target="_blank">GitHub</a>
                    <a href="https://twitter.com/benolivier_" target="_blank">Twitter</a>
                </div>
            </footer>
        `
    }
}

customElements.define('footer-component', Footer)