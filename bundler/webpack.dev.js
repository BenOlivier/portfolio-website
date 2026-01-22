const path = require('path');
const os = require('os');
const { merge } = require('webpack-merge');
const commonConfiguration = require('./webpack.common.js');
const portFinderSync = require('portfinder-sync');

const infoColor = (_message) =>
{
    return `\u001b[1m\u001b[34m${_message}\u001b[39m\u001b[22m`;
};

const getLocalIp = () =>
{
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces))
    {
        for (const iface of interfaces[name])
        {
            if (iface.family === 'IPv4' && !iface.internal)
            {
                return iface.address;
            }
        }
    }
    return 'localhost';
};

module.exports = merge(
    commonConfiguration,
    {
        stats: 'errors-warnings',
        mode: 'development',
        infrastructureLogging:
        {
            level: 'warn',
        },
        devServer:
        {
            host: 'local-ip',
            port: portFinderSync.getPort(8080),
            open: true,
            allowedHosts: 'all',
            hot: false,
            watchFiles: ['src/**', 'static/**'],
            static:
            {
                watch: true,
                directory: path.join(__dirname, '../static'),
            },
            client:
            {
                logging: 'none',
                overlay: true,
                progress: false,
            },
            setupMiddlewares: (middlewares, devServer) =>
            {
                const port = devServer.options.port;
                const isHttps = devServer.options.server?.type === 'https';
                const localIp = getLocalIp();
                const protocol = isHttps ? 'https' : 'http';
                const domain1 = `${protocol}://${localIp}:${port}`;
                const domain2 = `${protocol}://localhost:${port}`;

                console.log(`Project running at:\n  - ${infoColor(domain1)}\n  - ${infoColor(domain2)}`);

                return middlewares;
            },
        },
    },
);
