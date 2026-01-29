import path from 'node:path';
import { type Configuration } from 'webpack';
import webpack from 'webpack';
import { merge } from 'webpack-merge';

const plugins = [new webpack.DefinePlugin({})];

const defaultConfiguration: Configuration = {
    module: {
        rules: [
            {
                test: /\.wasm$/,
                type: 'asset/inline'
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: 'ts-loader'
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    output: {
        chunkFormat: false
    }
};

const configuration: Configuration[] = [
    merge(defaultConfiguration, {
        target: 'webworker',
        entry: {
            worker: path.resolve(import.meta.dirname, '../worker')
        },
        output: {
            path: path.resolve(import.meta.dirname, '../out')
        },
        plugins,
        resolve: {
            fallback: {
                path: false,
                fs: false
            }
        },
        mode: 'production'
    }),
    merge(defaultConfiguration, {
        mode: 'production',
        target: 'webworker',
        entry: {
            worklet: path.resolve(import.meta.dirname, '../worklet')
        },
        plugins,
        output: {
            path: path.resolve(import.meta.dirname, '../out/worklet')
        }
    })
];

export default configuration;
