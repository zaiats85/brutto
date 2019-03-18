const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: "./src/index.js",
    mode: "development",
    output: {
        filename: "main.js"
    },
    watch: true,
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    },
    plugins: [new HtmlWebpackPlugin({
        inject: false,
        template: "./src/index.html",
        filename: "index.html"
    })]
};