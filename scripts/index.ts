import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';
import { TextStream as CodeStream } from '@textstream/core';
import runCommand from './runCommand.js';
import { getArgument } from 'cli-argument-helper';
import { getString } from 'cli-argument-helper/string/index.js';
import getArgumentAssignment from 'cli-argument-helper/getArgumentAssignment.js';
import { generateWorkerActions } from './generateWorkerActions.js';
import { opusGettersAndSetters } from './opusGettersAndSetters.js';
import { opusGettersAndSettersArgumentTypes } from './opusGettersAndSettersArgumentTypes.js';
import { generateOpusGettersAndSettersClass } from './generateOpusGettersAndSettersClass.js';
import { otherOpusConstants } from './opusConstants.js';

const currentDir = import.meta.dirname;
const outFolder = path.resolve(currentDir, '../out');

async function generateOpusGettersAndSetters() {
    const cs = new CodeStream();
    cs.write(`#include <opus.h>\n`);
    for (const c of opusGettersAndSetters) {
        cs.write(
            `int ${c[0].toLowerCase()}(OpusEncoder* enc,${c[1].arguments
                .map((x) => {
                    const argumentType = opusGettersAndSettersArgumentTypes
                        .get(c[0])
                        ?.arguments.find((a) => a.name === x);
                    if (typeof argumentType === 'undefined')
                        throw new Error(`failed to get argument type: ${c[0]}`);
                    return `${
                        argumentType.type === 'int_ptr'
                            ? 'opus_int32*'
                            : 'opus_int32'
                    } ${x}`;
                })
                .join(', ')}) {\n`,
            () => {
                cs.write(
                    `return opus_encoder_ctl(enc,${c[0]}(${c[1].arguments.join(
                        ', '
                    )}));\n`
                );
            },
            '}\n'
        );
    }
    await fs.promises.writeFile(
        path.resolve(currentDir, '../native/opus_js_getters_and_setters.c'),
        cs.value()
    );
}

async function generateOpusConstantsTsFile() {
    const cs = new CodeStream();
    cs.write(
        'const constants = {\n',
        () => {
            for (const c of otherOpusConstants) {
                cs.write(`'${c[0]}': ${c[1]},\n`);
            }
        },
        '};\n'
    );
    cs.write('export default constants;\n');
    await fs.promises.writeFile(
        path.resolve(currentDir, '../opus/constants.ts'),
        cs.value()
    );
}

async function compile() {
    const wasiSdkPath = process.env['WASI_SDK_PATH'] ?? null;
    assert.strict.ok(wasiSdkPath !== null);

    const buildFolder = path.resolve(currentDir, '../native/build');
    await runCommand(
        'cmake',
        [
            '-B',
            buildFolder,
            '-DOPUS_STACK_PROTECTOR=0',
            '-DOPUS_DISABLE_INTRINSICS=0',
            '-DOPUS_FIXED_POINT=0',
            '-DOPUS_HARDENING=1',
            '-DOPUS_FUZZING=0',
            '-DOPUS_CHECK_ASM=1',
            '-DOPUS_INSTALL_PKG_CONFIG_MODULE=0',
            '-DOPUS_INSTALL_CMAKE_CONFIG_MODULE=0',
            '-DOPUS_BUILD_SHARED_LIBRARY=0',
            '-DOPUS_BUILD_TESTING=0',
            '-DOPUS_ENABLE_FLOAT_API=1',
            '-DOPUS_ASSERTIONS=0',
            '-DOPUS_FORTIFY_SOURCE=1',
            '-DOPUS_BUILD_PROGRAMS=0',
            '-DCMAKE_BUILD_TYPE=Release',
            '--toolchain',
            path.resolve(wasiSdkPath, 'share', 'cmake', 'wasi-sdk.cmake')
        ],
        {
            cwd: path.resolve(currentDir, '../native')
        }
    );
    await runCommand('make', [], {
        cwd: buildFolder
    });
    const cs = new CodeStream();
    cs.write(
        `export type GeneratedOpusGettersAndSetters = {\n`,
        () => {
            for (const getterAndSetter of opusGettersAndSetters) {
                cs.write(
                    `${getterAndSetter[0].toLowerCase()}(enc: number,value: number): number;\n`
                );
            }
        },
        '};\n'
    );
    await fs.promises.writeFile(
        path.resolve(currentDir, '../native/opus-ts-getters-and-setters.d.ts'),
        cs.value()
    );
    const exportFunctions = [
        'size_of_int',
        'size_of_void_ptr',
        '__heap_base',
        '__heap_end',
        '__data_end',
        'malloc',
        'free',
        'opus_decoder_create',
        'opus_decoder_destroy',
        'opus_decode_float',
        'opus_encoder_create',
        'opus_encoder_destroy',
        'opus_encoder_ctl',
        'opus_encode_float',
        ...Array.from(opusGettersAndSetters.keys()).map(
            (f) => `${f.toLowerCase()}`
        )
    ];
    const clang = path.resolve(wasiSdkPath, 'bin/clang');
    const initialMemory = 32 * 1024 * 1024; // 32MB
    const stackSize = 2 * 1024 * 1024; // 2MB
    await runCommand(clang, [
        '-v',
        '--target=wasm32-wasi',
        '-o',
        path.resolve(currentDir, '../native/index.wasm'),
        '-O3',
        ...exportFunctions.map((f) => ['-Wl', `--export=${f}`].join(',')),
        '-Wl,--strip-all',
        `-Wl,--initial-memory=${initialMemory}`, // 16MB initial memory
        '-Wl,--max-memory=2147483648', // 2GB max memory
        `-Wl,-z,stack-size=${stackSize}`, // 1MB stack size
        '-g3',
        path.resolve(buildFolder, 'opus/libopus.a'),
        path.resolve(buildFolder, 'libRecTimeWebWorker.a')
    ]);
    await runCommand('npx', [
        'tsc',
        '-b',
        path.resolve(currentDir, '../worker'),
        path.resolve(currentDir, '../worklet'),
        path.resolve(currentDir, '../webpack'),
        path.resolve(currentDir, '../actions'),
        '--force'
    ]);
    await runCommand('npx', [
        'webpack',
        '--config',
        path.resolve(currentDir, '../webpack/webpack.config.js'),
        '--stats-error-details'
    ]);
    await runCommand('npx', [
        'tsc',
        '--project',
        path.resolve(currentDir, '../actions'),
        '--outDir',
        outFolder
    ]);
    const { version, repository } = (await import('../package.json')).default;
    await fs.promises.writeFile(
        path.resolve(outFolder, 'package.json'),
        JSON.stringify(
            {
                name: 'opus-codec-worker',
                license: 'MIT',
                version,
                repository,
                files: ['**/*.{js,d.ts,map}']
            },
            null,
            4
        )
    );
}

(async () => {
    const args = process.argv.slice(2);
    const generate =
        (getArgument(args, '-g') ?? getArgument(args, '--generate')) !== null;
    const runCompile = getArgument(args, '--compile') !== null;
    const publishPackage = getArgument(args, '--publish') !== null;
    const oneTimePassword = getArgumentAssignment.default(
        args,
        '--otp',
        getString
    );
    if (generate) {
        await generateWorkerActions();
        await generateOpusGettersAndSettersClass();
        await generateOpusConstantsTsFile();
        await generateOpusGettersAndSetters();
    }
    if (runCompile) {
        await compile();
    }
    if (publishPackage) {
        const publishArgs = ['publish'];
        if (oneTimePassword !== null) {
            publishArgs.push('--otp', oneTimePassword);
        }
        await runCommand('npm', publishArgs, {
            cwd: outFolder
        });
    }
})().catch((reason) => {
    process.exitCode = 1;
    console.error(reason);
});
