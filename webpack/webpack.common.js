const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const srcDir = path.join(__dirname, "..", "src");

module.exports = {
    entry: {
        // popup: path.join(srcDir, 'popup.js'),
        admin: path.join(srcDir, "admin.js"),
        guide: path.join(srcDir, "guide.js"),
        options: path.join(srcDir, 'options.js'),
        background: path.join(srcDir, 'background.js'),
        content_script: path.join(srcDir, 'content_script.js'),
        web_accessible_resources: path.join(srcDir, 'web_accessible_resources.js'),
    },
    output: {
        path: path.join(__dirname, "../dist/js"),
        filename: "[name].js",
    },
    optimization: {
        splitChunks: {
            name: "vendor",
            chunks(chunk) {
                return chunk.name !== 'background';
            }
        },
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                ],
            },
        ],
    },
    resolve: {
        extensions: [".js", ".css"],
    },
    plugins: [
        new CopyPlugin({
            patterns: [{ from: ".", to: "../", context: "public" }],
            options: {},
        }),
        new MiniCssExtractPlugin({
            filename: "../css/[name].css",
            chunkFilename: "../css/[id].css",
        }),
    ],
};
