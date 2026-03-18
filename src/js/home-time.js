export default function initHomeTime()
{
    const el = document.getElementById('local-time');
    if (!el) return;

    const formatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/London',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });

    function update()
    {
        const time = formatter.format(new Date());
        el.textContent = time + ' London, UK';
    }

    update();
    setInterval(update, 60000);
}
