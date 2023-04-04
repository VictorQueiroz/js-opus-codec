import path from 'path';
import { Configuration } from 'webpack';

const configuration: Configuration = {
    target: 'webworker',
    entry: {
        worker: path.resolve(__dirname, '../worker'),
    },
    output: {
        path: path.resolve(__dirname, '../out'),
    },
    module: {
        rules: [
            {
                test: /\.wasm$/,
                type: 'asset/inline',
            },
        ],
    },
    resolve: {
        fallback: {
            path: false,
            fs: false,
        },
    },
    mode: 'production',
};

export default configuration;
