import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';
import { TextStream as CodeStream } from '@textstream/core';
import runCommand from './runCommand.js';

const currentDir = import.meta.dirname;
const outFolder = path.resolve(currentDir, '../out');

// const opusRequestConstants = new Map<string, number>([
//     ['OPUS_SET_APPLICATION_REQUEST', 4000],
//     ['OPUS_GET_APPLICATION_REQUEST', 4001],
//     ['OPUS_SET_BITRATE_REQUEST', 4002],
//     ['OPUS_GET_BITRATE_REQUEST', 4003],
//     ['OPUS_SET_MAX_BANDWIDTH_REQUEST', 4004],
//     ['OPUS_GET_MAX_BANDWIDTH_REQUEST', 4005],
//     ['OPUS_SET_VBR_REQUEST', 4006],
//     ['OPUS_GET_VBR_REQUEST', 4007],
//     ['OPUS_SET_BANDWIDTH_REQUEST', 4008],
//     ['OPUS_GET_BANDWIDTH_REQUEST', 4009],
//     ['OPUS_SET_COMPLEXITY_REQUEST', 4010],
//     ['OPUS_GET_COMPLEXITY_REQUEST', 4011],
//     ['OPUS_SET_INBAND_FEC_REQUEST', 4012],
//     ['OPUS_GET_INBAND_FEC_REQUEST', 4013],
//     ['OPUS_SET_PACKET_LOSS_PERC_REQUEST', 4014],
//     ['OPUS_GET_PACKET_LOSS_PERC_REQUEST', 4015],
//     ['OPUS_SET_DTX_REQUEST', 4016],
//     ['OPUS_GET_DTX_REQUEST', 4017],
//     ['OPUS_SET_VBR_CONSTRAINT_REQUEST', 4020],
//     ['OPUS_GET_VBR_CONSTRAINT_REQUEST', 4021],
//     ['OPUS_SET_FORCE_CHANNELS_REQUEST', 4022],
//     ['OPUS_GET_FORCE_CHANNELS_REQUEST', 4023],
//     ['OPUS_SET_SIGNAL_REQUEST', 4024],
//     ['OPUS_GET_SIGNAL_REQUEST', 4025],
//     ['OPUS_GET_LOOKAHEAD_REQUEST', 4027],
//     ['OPUS_GET_SAMPLE_RATE_REQUEST', 4029],
//     ['OPUS_GET_FINAL_RANGE_REQUEST', 4031],
//     ['OPUS_GET_PITCH_REQUEST', 4033],
//     ['OPUS_SET_GAIN_REQUEST', 4034],
//     ['OPUS_GET_GAIN_REQUEST', 4045 /* Should have been 4035 */],
//     ['OPUS_SET_LSB_DEPTH_REQUEST', 4036],
//     ['OPUS_GET_LSB_DEPTH_REQUEST', 4037],
//     ['OPUS_GET_LAST_PACKET_DURATION_REQUEST', 4039],
//     ['OPUS_SET_EXPERT_FRAME_DURATION_REQUEST', 4040],
//     ['OPUS_GET_EXPERT_FRAME_DURATION_REQUEST', 4041],
//     ['OPUS_SET_PREDICTION_DISABLED_REQUEST', 4042],
//     ['OPUS_GET_PREDICTION_DISABLED_REQUEST', 4043],
//     /* Don't use 4045, it's already taken by OPUS_GET_GAIN_REQUEST */
//     ['OPUS_SET_PHASE_INVERSION_DISABLED_REQUEST', 4046],
//     ['OPUS_GET_PHASE_INVERSION_DISABLED_REQUEST', 4047],
//     ['OPUS_GET_IN_DTX_REQUEST', 4049],
// ]);

const otherOpusConstants = new Map<string, number>([
    /** One or more invalid/out of range arguments @hideinitializer*/
    ['OPUS_OK', 0],
    /** Not enough bytes allocated in the buffer @hideinitializer*/
    ['OPUS_BAD_ARG', -1],
    /** An internal error was detected @hideinitializer*/
    ['OPUS_BUFFER_TOO_SMALL', -2],
    /** The compressed data passed is corrupted @hideinitializer*/
    ['OPUS_INTERNAL_ERROR', -3],
    /** Invalid/unsupported request number @hideinitializer*/
    ['OPUS_INVALID_PACKET', -4],
    /** An encoder or decoder structure is invalid or already freed @hideinitializer*/
    ['OPUS_UNIMPLEMENTED', -5],
    /** Memory allocation has failed @hideinitializer*/
    ['OPUS_INVALID_STATE', -6],

    ['    OPUS_ALLOC_FAIL', -7],
    /* Values for the various encoder CTLs */
    ['OPUS_AUTO', -1000] /**<Auto/default setting @hideinitializer*/,
    ['OPUS_BITRATE_MAX', -1] /**<Maximum bitrate @hideinitializer*/,

    /** Best for most VoIP/videoconference applications where listening quality and intelligibility matter most
     * @hideinitializer */
    ['OPUS_APPLICATION_VOIP', 2048],
    /** Best for broadcast/high-fidelity application where the decoded audio should be as close as possible to the input
     * @hideinitializer */
    ['OPUS_APPLICATION_AUDIO', 2049],
    /** Only use when lowest-achievable latency is what matters most. Voice-optimized modes cannot be used.
     * @hideinitializer */
    ['OPUS_APPLICATION_RESTRICTED_LOWDELAY', 2051],

    ['OPUS_SIGNAL_VOICE', 3001] /**< Signal being encoded is voice */,
    ['OPUS_SIGNAL_MUSIC', 3002] /**< Signal being encoded is music */,
    ['OPUS_BANDWIDTH_NARROWBAND', 1101] /**< 4 kHz bandpass @hideinitializer*/,
    ['OPUS_BANDWIDTH_MEDIUMBAND', 1102] /**< 6 kHz bandpass @hideinitializer*/,
    ['OPUS_BANDWIDTH_WIDEBAND', 1103] /**< 8 kHz bandpass @hideinitializer*/,
    [
        'OPUS_BANDWIDTH_SUPERWIDEBAND',
        1104
    ] /**<12 kHz bandpass @hideinitializer*/,
    ['OPUS_BANDWIDTH_FULLBAND', 1105] /**<20 kHz bandpass @hideinitializer*/,

    [
        'OPUS_FRAMESIZE_ARG',
        5000
    ] /**< Select frame size from the argument (default) */,
    ['OPUS_FRAMESIZE_2_5_MS', 5001] /**< Use 2.5 ms frames */,
    ['OPUS_FRAMESIZE_5_MS', 5002] /**< Use 5 ms frames */,
    ['OPUS_FRAMESIZE_10_MS', 5003] /**< Use 10 ms frames */,
    ['OPUS_FRAMESIZE_20_MS', 5004] /**< Use 20 ms frames */,
    ['OPUS_FRAMESIZE_40_MS', 5005] /**< Use 40 ms frames */,
    ['OPUS_FRAMESIZE_60_MS', 5006] /**< Use 60 ms frames */,
    ['OPUS_FRAMESIZE_80_MS', 5007] /**< Use 80 ms frames */,
    ['OPUS_FRAMESIZE_100_MS', 5008] /**< Use 100 ms frames */,
    ['OPUS_FRAMESIZE_120_MS', 5009] /**< Use 120 ms frames */
]);

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
    await runCommand(clang, [
        '-v',
        '--target=wasm32-wasi',
        '-o',
        path.resolve(currentDir, '../native/index.wasm'),
        '-O0',
        ...exportFunctions.map((f) => ['-Wl', `--export=${f}`].join(',')),
        // '-Wl,--no-entry',
        // '-Wl,--export-all',
        // '-Wl,--strip-all',
        // '-Wl,--import-memory',
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
    await fs.promises.writeFile(
        path.resolve(outFolder, 'package.json'),
        JSON.stringify(
            {
                name: 'opus-codec-worker',
                license: 'MIT',
                version: (await import('../package.json')).default.version,
                files: ['**/*.{js,d.ts,map}']
            },
            null,
            4
        )
    );
}

import { getArgument } from 'cli-argument-helper';
import { getString } from 'cli-argument-helper/string/index.js';
import getArgumentAssignment from 'cli-argument-helper/getArgumentAssignment.js';
import { generateWorkerActions } from './generateWorkerActions.js';
import { opusGettersAndSetters } from './opusGettersAndSetters.js';
import { opusGettersAndSettersArgumentTypes } from './opusGettersAndSettersArgumentTypes.js';
import { generateOpusGettersAndSettersClass } from './generateOpusGettersAndSettersClass.js';

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
