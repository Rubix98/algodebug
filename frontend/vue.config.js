const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

module.exports = {
    publicPath: "/",
    devServer: {
        allowedHosts: ["srv16.mikr.us"],
    },
    configureWebpack: {
        plugins: [new MonacoWebpackPlugin()],
    },
};
