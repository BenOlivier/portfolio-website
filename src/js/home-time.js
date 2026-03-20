// SF Symbols PUA characters (render via Apple system font)
const SUN_SYMBOL = '\u{2600}'; // sun.max
const MOON_SYMBOL = '\u{263E}'; // moon

export default function initHomeTime()
{
    const el = document.getElementById('local-time');
    const iconEl = document.querySelector('.clock-icon');
    if (!el) return;

    const formatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/London',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });

    const hourFormatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/London',
        hour: 'numeric',
        hour12: false,
    });

    function update()
    {
        const time = formatter.format(new Date()).replace(' ', '');
        el.textContent = time + ' London';

        if (iconEl)
        {
            const hour = parseInt(hourFormatter.format(new Date()), 10);
            iconEl.textContent = (hour >= 7 && hour < 21) ? SUN_SYMBOL : MOON_SYMBOL;
        }
    }

    update();
    setInterval(update, 60000);
}
