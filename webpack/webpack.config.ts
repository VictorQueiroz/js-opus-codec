import path from 'node:path';
import { type Configuration } from 'webpack';
import webpack from 'webpack';

const plugins = [new webpack.DefinePlugin({})];

const configuration: Configuration[] = [
    {
        target: 'webworker',
        entry: {
            worker: path.resolve(import.meta.dirname, '../worker')
        },
        output: {
            chunkFormat: false,
            path: path.resolve(import.meta.dirname, '../out')
        },
        plugins,
        resolve: {
            fallback: {
                path: false,
                fs: false
            }
        },
        module: {
            rules: [
                {
                    test: /\.wasm$/,
                    type: 'asset/inline'
                }
            ]
        },
        mode: 'production'
    },
    {
        mode: 'production',
        target: 'webworker',
        entry: {
            worklet: path.resolve(import.meta.dirname, '../worklet')
        },
        module: {
            rules: [
                {
                    test: /\.wasm$/,
                    type: 'asset/inline'
                }
            ]
        },
        plugins,
        output: {
            chunkFormat: false,
            path: path.resolve(import.meta.dirname, '../out/worklet')
        }
    }
];

export default configuration;
