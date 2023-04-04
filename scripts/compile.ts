import fs from 'fs';
import child_process from 'child_process';
import path from 'path';

function runCommand(
    cmd: string,
    args: string[],
    options: child_process.SpawnOptions = {}
) {
    return new Promise<void>((resolve, reject) => {
        const p = child_process.spawn(cmd, args, {
            stdio: 'inherit',
            ...options,
        });
        p.on('exit', (code) => {
            if (code !== 0) {
                reject(new Error(`process failed with error: ${code}`));
            } else {
                resolve();
            }
        });
    });
}

(async () => {
    const buildFolder = path.resolve(__dirname, '../native/build');
    await runCommand(
        'emcmake',
        ['cmake', '-B', buildFolder, '-DOPUS_STACK_PROTECTOR=0'],
        {
            cwd: path.resolve(__dirname, '../native'),
        }
    );
    await runCommand('emmake', ['make'], {
        cwd: buildFolder,
    });
    const exportFunctions = [
        '_size_of_int',
        '_size_of_void_ptr',
        '_malloc',
        '_free',
        '_opus_decoder_create',
        '_opus_decoder_destroy',
        '_opus_decode_float',
        '_opus_encoder_create',
        '_opus_encoder_destroy',
        '_opus_encode_float',
    ];
    const emscriptenArgs = [
        'MODULARIZE=1',
        'ENVIRONMENT=worker,node',
        'WASM_ASYNC_COMPILATION=1',
        `EXPORTED_FUNCTIONS=${JSON.stringify(exportFunctions)}`,
    ];
    await runCommand('emcc', [
        path.resolve(buildFolder, 'opus/libopus.a'),
        path.resolve(buildFolder, 'libRecTimeWebWorker.a'),
        ...emscriptenArgs.reduce(
            (a, b) => [...a, '-s', b],
            new Array<string>()
        ),
        '-o',
        path.resolve(__dirname, '../native/index.js'),
    ]);
    await runCommand('node', [
        '-e',
        `console.log(require('${path.resolve(__dirname, '../native')}'))`,
    ]);
    await runCommand('npx', [
        'tsc',
        '-b',
        path.resolve(__dirname, '../worker'),
        path.resolve(__dirname, '../webpack'),
        path.resolve(__dirname, '../actions'),
        '--force',
    ]);
    await runCommand('npx', [
        'webpack',
        '--config',
        path.resolve(__dirname, '../webpack/webpack.config.js'),
    ]);
    const outFolder = path.resolve(__dirname, '../out');
    await runCommand('npx', [
        'tsc',
        '--project',
        path.resolve(__dirname, '../actions'),
        '--outDir',
        outFolder,
    ]);
    await fs.promises.writeFile(
        path.resolve(outFolder, 'package.json'),
        JSON.stringify(
            {
                name: 'opus-codec-worker',
                license: 'MIT',
                version: (await import('../package.json')).version,
                files: ['**/*.{js,d.ts,map}'],
            },
            null,
            4
        )
    );
    await runCommand('npm', ['publish'], {
        cwd: outFolder,
    });
})().catch((reason) => {
    process.exitCode = 1;
    console.error(reason);
});
