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
                    <img src="/images/icons/twitter.svg" onclick="mailto:dbeolivier@gmail.com">
                    <img src="/images/icons/linkedin.svg" onclick="https://www.linkedin.com/in/ben-olivier-38b901145/" target="_blank">
                    <img src="/images/icons/github.svg" onclick="https://github.com/BenOlivier" target="_blank">
                    <img src="/images/icons/twitter.svg" onclick="https://twitter.com/benolivier_" target="_blank">
                </div>
            </footer>
        `
    }
}

customElements.define('footer-component', Footer)