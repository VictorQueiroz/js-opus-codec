import fs from 'fs';
import child_process from 'child_process';
import path from 'path';
import CodeStream from 'codestreamjs';

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
        1104,
    ] /**<12 kHz bandpass @hideinitializer*/,
    ['OPUS_BANDWIDTH_FULLBAND', 1105] /**<20 kHz bandpass @hideinitializer*/,

    [
        'OPUS_FRAMESIZE_ARG',
        5000,
    ] /**< Select frame size from the argument (default) */,
    ['OPUS_FRAMESIZE_2_5_MS', 5001] /**< Use 2.5 ms frames */,
    ['OPUS_FRAMESIZE_5_MS', 5002] /**< Use 5 ms frames */,
    ['OPUS_FRAMESIZE_10_MS', 5003] /**< Use 10 ms frames */,
    ['OPUS_FRAMESIZE_20_MS', 5004] /**< Use 20 ms frames */,
    ['OPUS_FRAMESIZE_40_MS', 5005] /**< Use 40 ms frames */,
    ['OPUS_FRAMESIZE_60_MS', 5006] /**< Use 60 ms frames */,
    ['OPUS_FRAMESIZE_80_MS', 5007] /**< Use 80 ms frames */,
    ['OPUS_FRAMESIZE_100_MS', 5008] /**< Use 100 ms frames */,
    ['OPUS_FRAMESIZE_120_MS', 5009] /**< Use 120 ms frames */,
]);

const opusGettersAndSetters = new Map([
    ['OPUS_SET_COMPLEXITY', { arguments: ['x'] }],
    ['OPUS_GET_COMPLEXITY', { arguments: ['x'] }],
    ['OPUS_SET_BITRATE', { arguments: ['x'] }],
    ['OPUS_GET_BITRATE', { arguments: ['x'] }],
    ['OPUS_SET_VBR', { arguments: ['x'] }],
    ['OPUS_GET_VBR', { arguments: ['x'] }],
    ['OPUS_SET_VBR_CONSTRAINT', { arguments: ['x'] }],
    ['OPUS_GET_VBR_CONSTRAINT', { arguments: ['x'] }],
    ['OPUS_SET_FORCE_CHANNELS', { arguments: ['x'] }],
    ['OPUS_GET_FORCE_CHANNELS', { arguments: ['x'] }],
    ['OPUS_SET_MAX_BANDWIDTH', { arguments: ['x'] }],
    ['OPUS_GET_MAX_BANDWIDTH', { arguments: ['x'] }],
    ['OPUS_SET_BANDWIDTH', { arguments: ['x'] }],
    ['OPUS_SET_SIGNAL', { arguments: ['x'] }],
    ['OPUS_GET_SIGNAL', { arguments: ['x'] }],
    ['OPUS_SET_APPLICATION', { arguments: ['x'] }],
    ['OPUS_GET_APPLICATION', { arguments: ['x'] }],
    ['OPUS_GET_LOOKAHEAD', { arguments: ['x'] }],
    ['OPUS_SET_INBAND_FEC', { arguments: ['x'] }],
    ['OPUS_GET_INBAND_FEC', { arguments: ['x'] }],
    ['OPUS_SET_PACKET_LOSS_PERC', { arguments: ['x'] }],
    ['OPUS_GET_PACKET_LOSS_PERC', { arguments: ['x'] }],
    ['OPUS_SET_DTX', { arguments: ['x'] }],
    ['OPUS_GET_DTX', { arguments: ['x'] }],
    ['OPUS_SET_LSB_DEPTH', { arguments: ['x'] }],
    ['OPUS_GET_LSB_DEPTH', { arguments: ['x'] }],
    ['OPUS_SET_EXPERT_FRAME_DURATION', { arguments: ['x'] }],
    ['OPUS_GET_EXPERT_FRAME_DURATION', { arguments: ['x'] }],
    ['OPUS_SET_PREDICTION_DISABLED', { arguments: ['x'] }],
    ['OPUS_GET_PREDICTION_DISABLED', { arguments: ['x'] }],
    // ['OPUS_RESET_STATE', { arguments: ['x'] }],
    ['OPUS_GET_BANDWIDTH', { arguments: ['x'] }],
    ['OPUS_GET_SAMPLE_RATE', { arguments: ['x'] }],
    ['OPUS_SET_PHASE_INVERSION_DISABLED', { arguments: ['x'] }],
    ['OPUS_GET_PHASE_INVERSION_DISABLED', { arguments: ['x'] }],
    ['OPUS_GET_IN_DTX', { arguments: ['x'] }],
    ['OPUS_SET_GAIN', { arguments: ['x'] }],
    ['OPUS_GET_GAIN', { arguments: ['x'] }],
    ['OPUS_GET_LAST_PACKET_DURATION', { arguments: ['x'] }],
    ['OPUS_GET_PITCH', { arguments: ['x'] }],
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
                    console.log(
                        x,
                        opusGettersAndSettersArgumentTypes.get(c[0])
                    );
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
        path.resolve(__dirname, '../native/opus_js_getters_and_setters.c'),
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
        path.resolve(__dirname, '../opus/constants.ts'),
        cs.value()
    );
}

async function compile() {
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
    const cs = new CodeStream();
    cs.write(
        `export type GeneratedOpusGettersAndSetters = {\n`,
        () => {
            for (const getterAndSetter of opusGettersAndSetters) {
                cs.write(
                    `_${getterAndSetter[0].toLowerCase()}(enc: number,value: number): number;\n`
                );
            }
        },
        '};\n'
    );
    await fs.promises.writeFile(
        path.resolve(__dirname, '../native/opus-ts-getters-and-setters.d.ts'),
        cs.value()
    );
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
        '_opus_encoder_ctl',
        '_opus_encode_float',
        ...Array.from(opusGettersAndSetters.keys()).map(
            (f) => `_${f.toLowerCase()}`
        ),
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
        path.resolve(__dirname, '../worklet'),
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
}

const opusGettersAndSettersArgumentTypes = new Map<
    string,
    {
        arguments: {
            name: string;
            type: 'int' | 'int_ptr';
        }[];
    }
>([
    ['OPUS_SET_COMPLEXITY', { arguments: [{ name: 'x', type: 'int' }] }],
    ['OPUS_GET_COMPLEXITY', { arguments: [{ name: 'x', type: 'int_ptr' }] }],
    ['OPUS_SET_BITRATE', { arguments: [{ name: 'x', type: 'int' }] }],
    ['OPUS_GET_BITRATE', { arguments: [{ name: 'x', type: 'int_ptr' }] }],
    ['OPUS_SET_VBR', { arguments: [{ name: 'x', type: 'int' }] }],
    ['OPUS_GET_VBR', { arguments: [{ name: 'x', type: 'int_ptr' }] }],
    ['OPUS_SET_VBR_CONSTRAINT', { arguments: [{ name: 'x', type: 'int' }] }],
    [
        'OPUS_GET_VBR_CONSTRAINT',
        { arguments: [{ name: 'x', type: 'int_ptr' }] },
    ],
    ['OPUS_SET_FORCE_CHANNELS', { arguments: [{ name: 'x', type: 'int' }] }],
    [
        'OPUS_GET_FORCE_CHANNELS',
        { arguments: [{ name: 'x', type: 'int_ptr' }] },
    ],
    ['OPUS_SET_MAX_BANDWIDTH', { arguments: [{ name: 'x', type: 'int' }] }],
    ['OPUS_GET_MAX_BANDWIDTH', { arguments: [{ name: 'x', type: 'int_ptr' }] }],
    ['OPUS_SET_BANDWIDTH', { arguments: [{ name: 'x', type: 'int' }] }],
    ['OPUS_SET_SIGNAL', { arguments: [{ name: 'x', type: 'int' }] }],
    ['OPUS_GET_SIGNAL', { arguments: [{ name: 'x', type: 'int_ptr' }] }],
    ['OPUS_SET_APPLICATION', { arguments: [{ name: 'x', type: 'int' }] }],
    ['OPUS_GET_APPLICATION', { arguments: [{ name: 'x', type: 'int_ptr' }] }],
    ['OPUS_GET_LOOKAHEAD', { arguments: [{ name: 'x', type: 'int_ptr' }] }],
    ['OPUS_SET_INBAND_FEC', { arguments: [{ name: 'x', type: 'int' }] }],
    ['OPUS_GET_INBAND_FEC', { arguments: [{ name: 'x', type: 'int_ptr' }] }],
    ['OPUS_SET_PACKET_LOSS_PERC', { arguments: [{ name: 'x', type: 'int' }] }],
    [
        'OPUS_GET_PACKET_LOSS_PERC',
        { arguments: [{ name: 'x', type: 'int_ptr' }] },
    ],
    ['OPUS_SET_DTX', { arguments: [{ name: 'x', type: 'int' }] }],
    ['OPUS_GET_DTX', { arguments: [{ name: 'x', type: 'int_ptr' }] }],
    ['OPUS_SET_LSB_DEPTH', { arguments: [{ name: 'x', type: 'int' }] }],
    ['OPUS_GET_LSB_DEPTH', { arguments: [{ name: 'x', type: 'int_ptr' }] }],
    [
        'OPUS_SET_EXPERT_FRAME_DURATION',
        { arguments: [{ name: 'x', type: 'int' }] },
    ],
    [
        'OPUS_GET_EXPERT_FRAME_DURATION',
        { arguments: [{ name: 'x', type: 'int_ptr' }] },
    ],
    [
        'OPUS_SET_PREDICTION_DISABLED',
        { arguments: [{ name: 'x', type: 'int' }] },
    ],
    [
        'OPUS_GET_PREDICTION_DISABLED',
        { arguments: [{ name: 'x', type: 'int_ptr' }] },
    ],
    ['OPUS_GET_BANDWIDTH', { arguments: [{ name: 'x', type: 'int_ptr' }] }],
    ['OPUS_GET_SAMPLE_RATE', { arguments: [{ name: 'x', type: 'int_ptr' }] }],
    [
        'OPUS_SET_PHASE_INVERSION_DISABLED',
        { arguments: [{ name: 'x', type: 'int' }] },
    ],
    [
        'OPUS_GET_PHASE_INVERSION_DISABLED',
        { arguments: [{ name: 'x', type: 'int_ptr' }] },
    ],
    ['OPUS_GET_IN_DTX', { arguments: [{ name: 'x', type: 'int_ptr' }] }],
    ['OPUS_SET_GAIN', { arguments: [{ name: 'x', type: 'int' }] }],
    ['OPUS_GET_GAIN', { arguments: [{ name: 'x', type: 'int_ptr' }] }],
    [
        'OPUS_GET_LAST_PACKET_DURATION',
        { arguments: [{ name: 'x', type: 'int_ptr' }] },
    ],
    ['OPUS_GET_PITCH', { arguments: [{ name: 'x', type: 'int_ptr' }] }],
]);
async function generateOpusGettersAndSettersClass() {
    const cs = new CodeStream();
    cs.write(`import {Runtime/*,Pointer*/,Integer} from '../runtime';\n`);
    cs.write(`import constants from './constants';\n`);
    cs.write(
        'export class OpusGettersAndSetters {\n',
        () => {
            cs.write(`readonly #opusEncoderOffset;\n`);
            cs.write(`readonly #runtime;\n`);
            // cs.write(`readonly #pointer;\n`);
            cs.write(`readonly #value;\n`);
            cs.write(
                'public constructor(runtime: Runtime, opusEncoderOffset: number) {\n',
                () => {
                    cs.write(`this.#runtime = runtime;\n`);
                    cs.write(`this.#value = new Integer(runtime);\n`);
                    // cs.write(
                    //     `this.#pointer = new Pointer(runtime,this.#value);\n`
                    // );
                    cs.write(`this.#opusEncoderOffset = opusEncoderOffset;\n`);
                },
                '}\n'
            );
            for (const v of opusGettersAndSetters) {
                function lowerFirst(v: string) {
                    return `${v[0]?.toLowerCase()}${v.substring(1)}`;
                }
                function upperFirst(v: string) {
                    return `${v[0]?.toUpperCase()}${v.substring(1)}`;
                }
                let name = v[0]
                    .replace(/^OPUS_/, '')
                    .replace(
                        /([a-zA-Z]+)_([a-zA-Z]+)/g,
                        (_, a: string, b: string) => {
                            return `${lowerFirst(a.toLowerCase())}${upperFirst(
                                b.toLowerCase()
                            )}`;
                        }
                    )
                    .replace(/_([a-zA-Z]+)/g, (_, a: string) =>
                        upperFirst(a.toLowerCase())
                    );
                const args = `${v[1].arguments
                    .map((c) => `${c}: number`)
                    .join(', ')}`;
                const isGetter = v[0].startsWith('OPUS_GET_');
                cs.write(
                    `public ${name}(${isGetter ? '' : args}): ${
                        isGetter ? 'number' : 'boolean'
                    } {\n`,
                    () => {
                        let varName: string;
                        if (isGetter) {
                            varName = `this.#value.offset()`;
                        } else {
                            varName = 'x';
                        }
                        cs.write(
                            `const result = this.#runtime.originalRuntime()._${v[0].toLowerCase()}(this.#opusEncoderOffset,${varName});\n`
                        );
                        if (isGetter) {
                        }
                        if (isGetter) {
                            cs.write(
                                `if(result != constants.OPUS_OK) throw new Error('Failed to set ${v[0]}');\n`
                            );
                            cs.write('return this.#value.value();\n');
                        } else {
                            cs.write(`return result === constants.OPUS_OK;\n`);
                        }
                    },
                    '}\n'
                );
            }
        },
        '}\n'
    );
    await fs.promises.writeFile(
        path.resolve(__dirname, '../opus/OpusGettersAndSetters.ts'),
        cs.value()
    );
}

(async () => {
    for (const arg of process.argv) {
        switch (arg) {
            case '-g':
                await generateOpusGettersAndSettersClass();
                await generateOpusConstantsTsFile();
                await generateOpusGettersAndSetters();
                break;
            case '--compile':
                await compile();
        }
    }
})().catch((reason) => {
    process.exitCode = 1;
    console.error(reason);
});
