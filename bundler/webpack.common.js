const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = {
    entry: path.resolve(__dirname, '../src/js/app.js'),
    output:
    {
        hashFunction: 'xxhash64',
        filename: 'bundle.[contenthash].js',
        path: path.resolve(__dirname, '../dist'),
        assetModuleFilename: 'assets/[name][ext]',
    },
    devtool: 'source-map',
    plugins:
    [
        new CopyWebpackPlugin({
            patterns: [
                { from: path.resolve(__dirname, '../static') },
            ],
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../src/html/index.html'),
            filename: 'index.html',
            minify: true,
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../src/html/about.html'),
            filename: 'about.html',
            minify: true,
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../src/html/work.html'),
            filename: 'work.html',
            minify: true,
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../src/html/meta.html'),
            filename: 'meta.html',
            minify: true,
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../src/html/customuse.html'),
            filename: 'customuse.html',
            minify: true,
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../src/html/litho.html'),
            filename: 'litho.html',
            minify: true,
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../src/html/contact.html'),
            filename: 'contact.html',
            minify: true,
        }),
        new MiniCSSExtractPlugin(),
    ],
    module:
    {
        rules:
        [
            // HTML
            {
                test: /\.(html)$/,
                use:
                [
                    'html-loader',
                ],
            },

            // JS
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use:
                [
                    'babel-loader',
                ],
            },

            // CSS
            {
                test: /\.css$/,
                use:
                [
                    MiniCSSExtractPlugin.loader,
                    'css-loader',
                ],
            },

            // Images
            {
                test: /\.(jpg|png|gif|svg)$/,
                type: 'asset/resource',
                generator:
                {
                    filename: 'assets/images/[hash][ext]',
                },
            },

            // Fonts
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                type: 'asset/resource',
                generator:
                {
                    filename: 'assets/fonts/[hash][ext]',
                },
            },

            // Shaders
            {
                test: /\.(glsl|vs|fs|vert|frag)$/,
                type: 'asset/source',
                generator:
                {
                    filename: 'assets/images/[hash][ext]',
                },
            },

            // PDF
            {
                test: /\.(pdf|txt)$/,
                type: 'asset/resource',
                generator:
                {
                    filename: 'assets/[name][ext]',
                },
            },
        ],
    },
};
