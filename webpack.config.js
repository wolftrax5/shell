const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const ModuleFederationPlugin = require("webpack").container.ModuleFederationPlugin;
const deps = require("./package.json").dependencies;

module.exports = {
    entry: "./src/index",
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        port: 3001,
    },
    output: {
        publicPath: "auto",
    },
    module: {
        rules: [
        {
            test: /\.jsx?$/,
            loader: "babel-loader",
            exclude: /node_modules/,
            options: {
            presets: ["@babel/preset-react"],
            },
        },
        ],
    },
    plugins: [
        new ModuleFederationPlugin({
            name: "shell",
            filename: "remoteApp.js",
            library: { type: "var", name: "shell" },
            remotes: {
                app1: "app1@http://localhost:3010/remoteApp.js",
            },
            exposes: {
                "./routes": "./src/routes",
            },
            shared: {
                ...deps,
                react: {
                    eager: true,
                    singleton: true,
                    requiredVersion: deps.react,
                },
                "react-dom": {
                    eager: true,
                    singleton: true,
                    requiredVersion: deps["react-dom"],
                },
            },

        }),
        new HtmlWebpackPlugin({
        template: "./public/index.html",
        }),
    ],
};