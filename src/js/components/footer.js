class Footer extends HTMLElement
{
    constructor()
    {
        super();
    }

    connectedCallback()
    {
        this.innerHTML = `
            <footer class="footer">
                <h3>&copy;&nbsp;<span id="year"></span>&nbsp;BEN OLIVIER</h3>
                <div>
                    <a href="mailto:dbeolivier@gmail.com">
                    <img src="/images/icons/footer/mail.svg"></a>

                    <a href="https://linkedin.com/in/ben-olivier-38b901145/" target="_blank">
                    <img src="/images/icons/footer/linkedin.svg"></a>

                    <a href="https://github.com/BenOlivier" target="_blank">
                    <img src="/images/icons/footer/github.svg"></a>

                    <a href="https://x.com/benolivierxyz" target="_blank">
                    <img src="/images/icons/footer/x.svg"></a>
                </div>
            </footer>
        `;
        document.getElementById('year').textContent = new Date().getFullYear();
    }
}

customElements.define('footer-component', Footer);
