import path from 'node:path';
import { type Configuration } from 'webpack';

const configuration: Configuration[] = [
    {
        target: 'webworker',
        entry: {
            worker: path.resolve(import.meta.dirname, '../worker'),
        },
        output: {
            path: path.resolve(import.meta.dirname, '../out'),
        },
        resolve: {
            fallback: {
                path: false,
                fs: false,
            },
        },
        module: {
            rules: [
                {
                    test: /\.wasm$/,
                    type: 'asset/resource',
                },
            ],
        },
        mode: 'production',
    },
    {
        mode: 'production',
        target: 'webworker',
        entry: {
            worklet: path.resolve(import.meta.dirname, '../worklet'),
        },
        module: {
            rules: [
                {
                    test: /\.wasm$/,
                    type: 'asset/resource',
                },
            ],
        },
        output: {
            path: path.resolve(import.meta.dirname, '../out/worklet'),
        },
    },
];

export default configuration;
