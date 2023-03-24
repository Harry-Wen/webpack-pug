const path = require('path');
const CONFIG = require('./builder.config.js');
const PugPlugin = require("pug-plugin");
const { getEntry } = require("./webpack.util.js");
const BabelConfig = require("../babel.config.js");

module.exports = {
    entry: getEntry(),
    output: {
        path: path.join(CONFIG.PATH.ROOT, CONFIG.DIR.DIST),
        publicPath: CONFIG.PATH.PUBLIC_PATH,
    },
    context: CONFIG.PATH.ROOT,
    devtool: false,
    plugins: [
        new PugPlugin({
            pretty: false, // formatting HTML, useful for development mode
            js: {
                // output filename of extracted JS file from source script
                filename: `/${CONFIG.DIR.SCRIPT}/[name].[contenthash:5].js`,
            },
            css: {
                // output filename of extracted CSS file from source style
                filename: `/${CONFIG.DIR.STYLE}/[name].[contenthash:5].css`,
            }
        }),
    ],
    resolve: {
        alias: {
            '@': path.join(CONFIG.PATH.ROOT, CONFIG.DIR.WORK),
        },
        extensions: ['.tsx', '.ts', '.js'],
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    minChunks: 1,
                    chunks: 'all',
                    priority: 100
                }
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.pug$/,
                use: [PugPlugin.loader]
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: "css-loader"
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                config: path.resolve(__dirname, '../postcss.config.js'),
                            }
                        }
                    },
                    {
                        loader: "sass-loader"
                    },
                ]
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                config: path.resolve(__dirname, '../postcss.config.js'),
                            }
                        }
                    },
                    {
                        loader: "css-loader"
                    }
                ]
            },
            {
                test: /\.(png|jpg|jpeg|ico)/,
                type: 'asset/resource',
                generator: {
                    // output filename of images
                    filename: `${CONFIG.DIR.IMAGE}/[name].[hash:8][ext]`,
                },
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf|svg)$/i,
                type: 'asset/resource',
                generator: {
                    // output filename of fonts
                    filename: `${CONFIG.DIR.FONT}/[name][ext][query]`,
                },
            },
            {
                test: /\.(ts|tsx)$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    {
                        loader: "babel-loader",
                        options: BabelConfig
                    }
                ]
            },
            {
                test: /\.(js|jsx)?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: BabelConfig
                }
            },
        ]
    },
};