import { afterEach, beforeEach, describe, it } from 'vitest';
import Client, { IClientOptions } from '../actions/Client.js';
import {
    createDecoder,
    createEncoder,
    decodeFloat,
    destroyDecoder,
    destroyEncoder,
    encodeFloat,
    getFromEncoder,
    initializeWorker,
    setToEncoder
} from '../actions/actions.js';
import constants from '../opus/constants.js';
import { successOrFail } from '../actions/index.js';
import {
    OPUS_GET_APPLICATION,
    OPUS_GET_BANDWIDTH,
    OPUS_GET_BITRATE,
    OPUS_GET_LOOKAHEAD,
    OPUS_GET_MAX_BANDWIDTH,
    OPUS_GET_SAMPLE_RATE,
    OPUS_SET_APPLICATION,
    OPUS_SET_BITRATE,
    OPUS_SET_COMPLEXITY,
    OPUS_SET_MAX_BANDWIDTH,
    OPUS_SET_PHASE_INVERSION_DISABLED
} from '../actions/opus.js';

enum OpusDuration {
    DURATION_2_5_MS = 2.5,
    DURATION_5_MS = 5,
    DURATION_10_MS = 10,
    DURATION_20_MS = 20,
    DURATION_40_MS = 40,
    DURATION_60_MS = 60,
    DURATION_80_MS = 80,
    DURATION_100_MS = 100,
    DURATION_120_MS = 120
}

function createClient(options: Partial<IClientOptions> = {}) {
    const worker = new Worker(new URL('../out/worker.js', import.meta.url));
    return new Client(worker, options);
}

describe('Uninitialized', () => {
    let client: Client;

    beforeEach(() => {
        client = createClient();
    });

    afterEach(() => {
        client.close();
    });

    it('should initialize the worker', async ({ expect }) => {
        const result = await client.sendMessage(
            initializeWorker({
                wasmFileHref: new URL('../native/index.wasm', import.meta.url)
                    .href
            })
        );
        expect(result).to.be.deep.equal({
            requestId: result.requestId,
            value: null
        });
    });
});

it('should expire the request after timeout', async ({ expect }) => {
    const client = createClient({
        timeout: 100
    });
    const action = createEncoder({
        sampleRate: 48000,
        channels: 2,
        application: constants.OPUS_APPLICATION_VOIP,
        outBufferLength: 4000,
        pcmBufferLength: 9600
    });
    expect(await client.sendMessage(action)).to.be.deep.equal({
        requestId: action.requestId,
        failures: [
            'Timeout expired. It took more than 100 ms to resolve this request.'
        ]
    });
});

describe('Initialized', () => {
    let client: Client;
    beforeEach(async () => {
        client = createClient();
        await client.sendMessage(
            initializeWorker({
                wasmFileHref: new URL('../native/index.wasm', import.meta.url)
                    .href
            })
        );
    });
    afterEach(() => {
        client.close();
    });

    it('should set encoder complexity', async () => {
        const result = await successOrFail(
            client.sendMessage(
                createEncoder({
                    sampleRate: 48000,
                    channels: 2,
                    application: constants.OPUS_APPLICATION_VOIP,
                    outBufferLength: 4000,
                    pcmBufferLength: 9600
                })
            )
        );

        const encoderId = result.value;
        await successOrFail(
            client.sendMessage(setToEncoder(OPUS_SET_COMPLEXITY(encoderId, 0)))
        );
    });

    describe('Encoder', () => {
        it('should get bitrate', async ({ expect }) => {
            const result = await successOrFail(
                client.sendMessage(
                    createEncoder({
                        sampleRate: 48000,
                        channels: 2,
                        application: constants.OPUS_APPLICATION_VOIP,
                        outBufferLength: 4000,
                        pcmBufferLength: 9600
                    })
                )
            );

            const encoderId = result.value;
            expect(
                (
                    await successOrFail(
                        client.sendMessage(
                            getFromEncoder(OPUS_GET_BITRATE(encoderId))
                        )
                    )
                ).value
            ).to.be.equal(120000);
        });
        it('should get bandwidth', async ({ expect }) => {
            const result = await successOrFail(
                client.sendMessage(
                    createEncoder({
                        sampleRate: 48000,
                        channels: 2,
                        application: constants.OPUS_APPLICATION_VOIP,
                        outBufferLength: 4000,
                        pcmBufferLength: 9600
                    })
                )
            );

            const encoderId = result.value;
            expect(
                (
                    await successOrFail(
                        client.sendMessage(
                            getFromEncoder(OPUS_GET_BANDWIDTH(encoderId))
                        )
                    )
                ).value
            ).to.be.equal(constants.OPUS_BANDWIDTH_FULLBAND);
        });
        it('should set maximum bandwidth', async ({ expect }) => {
            const result = await successOrFail(
                client.sendMessage(
                    createEncoder({
                        sampleRate: 48000,
                        channels: 2,
                        application: constants.OPUS_APPLICATION_AUDIO,
                        outBufferLength: 4000,
                        pcmBufferLength: 9600
                    })
                )
            );

            const encoderId = result.value;

            expect(
                (
                    await successOrFail(
                        client.sendMessage(
                            setToEncoder(
                                OPUS_SET_MAX_BANDWIDTH(
                                    encoderId,
                                    constants.OPUS_BANDWIDTH_SUPERWIDEBAND
                                )
                            )
                        )
                    )
                ).value
            ).to.be.equal(true);

            expect(
                (
                    await successOrFail(
                        client.sendMessage(
                            getFromEncoder(OPUS_GET_MAX_BANDWIDTH(encoderId))
                        )
                    )
                ).value
            ).to.be.equal(constants.OPUS_BANDWIDTH_SUPERWIDEBAND);
        });
        it('should get sample rate', async ({ expect }) => {
            const result = await successOrFail(
                client.sendMessage(
                    createEncoder({
                        sampleRate: 48000,
                        channels: 2,
                        application: constants.OPUS_APPLICATION_AUDIO,
                        outBufferLength: 4000,
                        pcmBufferLength: 9600
                    })
                )
            );

            const encoderId = result.value;

            expect(
                (
                    await successOrFail(
                        client.sendMessage(
                            getFromEncoder(OPUS_GET_SAMPLE_RATE(encoderId))
                        )
                    )
                ).value
            ).to.be.equal(48000);
        });
        it('should set application', async ({ expect }) => {
            const result = await successOrFail(
                client.sendMessage(
                    createEncoder({
                        sampleRate: 48000,
                        channels: 2,
                        application: constants.OPUS_APPLICATION_VOIP,
                        outBufferLength: 4000,
                        pcmBufferLength: 9600
                    })
                )
            );

            const encoderId = result.value;

            expect(
                (
                    await successOrFail(
                        client.sendMessage(
                            setToEncoder(
                                OPUS_SET_APPLICATION(
                                    encoderId,
                                    constants.OPUS_APPLICATION_AUDIO
                                )
                            )
                        )
                    )
                ).value
            ).to.be.equal(true);

            expect(
                (
                    await successOrFail(
                        client.sendMessage(
                            getFromEncoder(OPUS_GET_APPLICATION(encoderId))
                        )
                    )
                ).value
            ).to.be.equal(constants.OPUS_APPLICATION_AUDIO);
        });
        it('should get lookahead', async ({ expect }) => {
            const result = await successOrFail(
                client.sendMessage(
                    createEncoder({
                        sampleRate: 48000,
                        channels: 2,
                        application: constants.OPUS_APPLICATION_VOIP,
                        outBufferLength: 4000,
                        pcmBufferLength: 9600
                    })
                )
            );

            const encoderId = result.value;

            expect(
                (
                    await successOrFail(
                        client.sendMessage(
                            getFromEncoder(OPUS_GET_LOOKAHEAD(encoderId))
                        )
                    )
                ).value
            ).to.be.equal(312);
        });
        it('should set phase inversion disabled state', async ({ expect }) => {
            const result = await successOrFail(
                client.sendMessage(
                    createEncoder({
                        sampleRate: 48000,
                        channels: 2,
                        application: constants.OPUS_APPLICATION_AUDIO,
                        outBufferLength: 4000,
                        pcmBufferLength: 9600
                    })
                )
            );

            const encoderId = result.value;

            expect(
                (
                    await successOrFail(
                        client.sendMessage(
                            setToEncoder(
                                OPUS_SET_PHASE_INVERSION_DISABLED(encoderId, 0)
                            )
                        )
                    )
                ).value
            ).to.be.equal(true);
        });
        it('should fail in case an invalid encoder ID is given', async ({
            expect
        }) => {
            const request = setToEncoder(
                OPUS_SET_PHASE_INVERSION_DISABLED(crypto.randomUUID(), 0)
            );
            expect(await client.sendMessage(request)).to.be.deep.equal({
                requestId: request.requestId,
                failures: [`No encoder found for: ${request.data.encoderId}`]
            });
        });
        it('should fail if the invalid maximum bandwidth is wrong', async ({
            expect
        }) => {
            const result = await successOrFail(
                client.sendMessage(
                    createEncoder({
                        sampleRate: 48000,
                        channels: 2,
                        application: constants.OPUS_APPLICATION_AUDIO,
                        outBufferLength: 4000,
                        pcmBufferLength: 9600
                    })
                )
            );

            const encoderId = result.value;

            expect(
                (
                    await successOrFail(
                        client.sendMessage(
                            setToEncoder(
                                OPUS_SET_MAX_BANDWIDTH(encoderId, 40000)
                            )
                        )
                    )
                ).value
            ).to.be.equal(false);
        });
    });

    it('should create an encoder', async ({ expect }) => {
        const action = createEncoder({
            sampleRate: 48000,
            channels: 2,
            application: constants.OPUS_APPLICATION_VOIP,
            outBufferLength: 4000,
            pcmBufferLength: 9600
        });
        const result = await client.sendMessage(action);
        expect(result).to.be.deep.equal({
            requestId: result.requestId,
            value: action.encoderId
        });
    });
    it('should encode samples in 32-bit floating-point number', async ({
        expect
    }) => {
        const sampleCount = 2880;
        const action = createEncoder({
            sampleRate: 48000,
            channels: 1,
            application: constants.OPUS_APPLICATION_VOIP,
            outBufferLength: 4000,
            pcmBufferLength: sampleCount * Float32Array.BYTES_PER_ELEMENT
        });
        const { encoderId } = action;

        await client.sendMessage(action);

        const result = await client.sendMessage(
            encodeFloat({
                maxDataBytes: 4000,
                encoderId,
                input: { pcm: new Float32Array(sampleCount).fill(0) }
            })
        );

        if ('failures' in result) {
            expect.fail('Encode float returned an error');
            return;
        }

        expect(result.value.encoded?.duration).to.be.equal(0.0035);
    });

    it('should decode samples to 32-bit floating-point number', async () => {
        const maxDataBytes = 200;
        const sampleRate = 48000;
        const frameSize = (sampleRate / 1000) * OpusDuration.DURATION_100_MS;

        const [{ value: encoderId }, { value: decoderId }] = await Promise.all([
            successOrFail(
                client.sendMessage(
                    createEncoder({
                        sampleRate,
                        channels: 1,
                        application: constants.OPUS_APPLICATION_VOIP,
                        outBufferLength: maxDataBytes,
                        pcmBufferLength:
                            frameSize * Float32Array.BYTES_PER_ELEMENT
                    })
                )
            ),
            successOrFail(
                client.sendMessage(
                    createDecoder({
                        sampleRate,
                        channels: 1,
                        frameSize
                    })
                )
            )
        ]);

        await successOrFail(
            client.sendMessage(setToEncoder(OPUS_SET_BITRATE(encoderId, 32000)))
        );

        let i = 0;
        while (i < 10) {
            const encoded = await successOrFail(
                client.sendMessage(
                    encodeFloat({
                        maxDataBytes,
                        encoderId,
                        input: {
                            pcm: new Float32Array(frameSize).fill(
                                Math.random() * 2 - 1
                            )
                        }
                    })
                )
            );
            if (encoded.value.encoded === null) {
                continue;
            }
            await successOrFail(
                client.sendMessage(
                    decodeFloat({
                        decoderId,
                        encoded: encoded.value.encoded.buffer
                    })
                )
            );
            i++;
        }

        await Promise.all([
            successOrFail(client.sendMessage(destroyEncoder({ encoderId }))),
            successOrFail(client.sendMessage(destroyDecoder({ decoderId })))
        ]);
    });

    it('should throw if requests with the same ID are sent', async ({
        expect
    }) => {
        const action = createEncoder({
            sampleRate: 48000,
            channels: 2,
            application: constants.OPUS_APPLICATION_VOIP,
            outBufferLength: 4000,
            pcmBufferLength: 9600
        });
        const result = await client.sendMessage(action);
        expect(result).to.be.deep.equal({
            requestId: result.requestId,
            value: action.encoderId
        });

        await expect(client.sendMessage(action)).rejects.toThrow(
            /Request already exists/
        );
    });

    it('should return an error in case the encoder ID was not created', async ({
        expect
    }) => {
        const result = await client.sendMessage(
            encodeFloat({
                maxDataBytes: 4000,
                encoderId: 'non-existent-encoder-id',
                input: { pcm: new Float32Array(2880).fill(0) }
            })
        );

        expect(result).to.be.deep.equal({
            requestId: result.requestId,
            failures: ['Failed to get encoder']
        });
    });

    it('should destroy an encoder', async ({ expect }) => {
        const sampleCount = 2880;
        const action = createEncoder({
            sampleRate: 48000,
            channels: 1,
            application: constants.OPUS_APPLICATION_VOIP,
            outBufferLength: 4000,
            pcmBufferLength: sampleCount * Float32Array.BYTES_PER_ELEMENT
        });
        const { encoderId } = action;

        await client.sendMessage(action);

        const result = await client.sendMessage(
            encodeFloat({
                maxDataBytes: 4000,
                encoderId,
                input: { pcm: new Float32Array(sampleCount).fill(0) }
            })
        );

        expect('value' in result && result.value.encoded?.duration).to.be.equal(
            0.0035
        );

        await client.sendMessage(destroyEncoder({ encoderId }));

        const resultAfterDestroy = await client.sendMessage(
            encodeFloat({
                maxDataBytes: 4000,
                encoderId,
                input: { pcm: new Float32Array(sampleCount).fill(0) }
            })
        );

        expect(resultAfterDestroy).to.be.deep.equal({
            requestId: resultAfterDestroy.requestId,
            failures: ['Failed to get encoder']
        });
    });
});
