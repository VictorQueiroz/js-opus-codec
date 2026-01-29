import { RingBufferF32 } from 'ringbud';
import {
    CodecId,
    ICreateDecoder,
    ICreateEncoder,
    ICreateEncoderOptions,
    IDecodeFloat,
    IDestroyDecoder,
    IDestroyEncoder,
    IEncodeFloat,
    IOpusGetRequest,
    IOpusSetRequest,
    RequestResponse,
    RequestResponseType,
    RequestType,
    WorkerRequest
} from '../actions/actions.js';
import Encoder from '../opus/Encoder.js';
import OggOpusEncoder from '../opus/OggOpusEncoder.js';
import OggOpusComments from '../opus/OggOpusComments.js';
import Runtime from '../runtime/Runtime.js';
import Decoder from '../opus/Decoder.js';
import { getFromEncoder, setToEncoder } from './opus.js';

function compareCreateEncoderOptions(
    a: ICreateEncoderOptions,
    b: ICreateEncoderOptions
) {
    return (
        a.application === b.application &&
        a.channels === b.channels &&
        a.outBufferLength === b.outBufferLength &&
        a.pcmBufferLength === b.pcmBufferLength &&
        a.sampleRate === b.sampleRate
    );
}

interface IEncoderInstance {
    id: CodecId;
    encoder: Encoder;
    ringBuffer: RingBufferF32;
    options: ICreateEncoderOptions;
}

interface IDecoderInstance {
    sampleRate: number;
    channels: number;
    frameSize: number;
    decoder: Decoder;
}

export class WorkerMessageProcessor {
    readonly #runtime;
    readonly #workerState: {
        decoders: Map<CodecId, IDecoderInstance>;
        encoders: Map<CodecId, IEncoderInstance>;
    };

    public constructor(runtime: Runtime) {
        this.#runtime = runtime;
        this.#workerState = {
            decoders: new Map(),
            encoders: new Map()
        };
    }
    public sendResponse<T>(
        response: RequestResponse<RequestResponseType<T>>,
        transfer: Transferable[] = []
    ) {
        return postMessage(response, transfer);
    }

    public onRequest(req: WorkerRequest) {
        try {
            this.#handleRequest(req);
        } catch (e) {
            const failures = new Array<string>();
            if (
                typeof e === 'object' &&
                e !== null &&
                'message' in e &&
                typeof e.message === 'string'
            ) {
                failures.push(e.message);
            } else {
                failures.push(`Unknown error: ${e}`);
            }
            this.sendResponse<WorkerRequest>({
                requestId: req.requestId,
                failures
            });
        }
    }

    #getOrCreateEncoder(
        encoderId: CodecId,
        options: ICreateEncoderOptions
    ): IEncoderInstance {
        let encoderInstance = this.#workerState.encoders.get(encoderId) ?? null;
        if (encoderInstance === null) {
            const encoder = new Encoder(
                this.#runtime,
                options.sampleRate,
                options.channels,
                options.application,
                options.outBufferLength,
                options.pcmBufferLength
            );
            encoderInstance = {
                options,
                id: encoderId,
                ringBuffer: new RingBufferF32(
                    options.pcmBufferLength / Float32Array.BYTES_PER_ELEMENT
                ),
                encoder
            };
            this.#workerState.encoders.set(encoderId, encoderInstance);
        } else if (
            !compareCreateEncoderOptions(encoderInstance.options, options)
        ) {
            throw new Error(
                'Encoder with same id but different options already exists'
            );
        }
        return encoderInstance;
    }
    #handleRequest(req: WorkerRequest) {
        const runtime = this.#runtime;
        const { encoders, decoders } = this.#workerState;

        switch (req.type) {
            case RequestType.CreateEncoder:
                this.sendResponse<ICreateEncoder>({
                    requestId: req.requestId,
                    value: this.#getOrCreateEncoder(req.encoderId, req.data).id
                });
                break;
            case RequestType.CreateDecoder: {
                let decoder = decoders.get(req.decoderId) ?? null;
                if (decoder === null) {
                    decoder = {
                        sampleRate: req.data.sampleRate,
                        channels: req.data.channels,
                        frameSize: req.data.frameSize,
                        decoder: new Decoder(
                            runtime,
                            req.data.sampleRate,
                            req.data.channels,
                            req.data.frameSize
                        )
                    };
                } else if (
                    decoder.sampleRate !== req.data.sampleRate ||
                    decoder.channels !== req.data.channels ||
                    decoder.frameSize !== req.data.frameSize
                ) {
                    throw new Error(
                        'Decoder with same id but different options already exists'
                    );
                }
                decoders.set(req.decoderId, decoder);
                this.sendResponse<ICreateDecoder>({
                    requestId: req.requestId,
                    value: req.decoderId
                });
                break;
            }
            case RequestType.DestroyEncoder: {
                const encoderInstance =
                    encoders.get(req.data.encoderId) ?? null;

                if (encoderInstance !== null) {
                    encoders.delete(req.data.encoderId);
                    encoderInstance.encoder.destroy();
                }

                this.sendResponse<IDestroyEncoder>(
                    encoderInstance
                        ? {
                              requestId: req.requestId,
                              value: null
                          }
                        : {
                              requestId: req.requestId,
                              failures: [
                                  `Failed to find encoder with id: ${req.data}`
                              ]
                          }
                );
                break;
            }
            case RequestType.DestroyDecoder: {
                const decoderInstance =
                    decoders.get(req.data.decoderId) ?? null;
                if (decoderInstance !== null) {
                    /**
                     * delete decoder from decoders map
                     */
                    decoders.delete(req.data.decoderId);
                    decoderInstance.decoder.destroy();
                }
                this.sendResponse<IDestroyDecoder>(
                    decoderInstance
                        ? {
                              requestId: req.requestId,
                              value: null
                          }
                        : {
                              requestId: req.requestId,
                              failures: [
                                  `Failed to find decoder with id: ${req.data.decoderId}`
                              ]
                          }
                );
                break;
            }
            case RequestType.EncodeFloat: {
                const encoderInstance = encoders.get(req.data.encoderId);
                if (!encoderInstance) {
                    throw new Error('Failed to get encoder');
                }

                const shouldDrain = req.data.input === null;

                if (req.data.input) {
                    encoderInstance.ringBuffer.write(req.data.input.pcm);
                }

                const samples =
                    encoderInstance.ringBuffer.read() ??
                    (shouldDrain ? encoderInstance.ringBuffer.drain() : null);

                if (samples === null) {
                    this.sendResponse<IEncodeFloat>({
                        requestId: req.requestId,
                        value: {
                            encoded: null
                        }
                    });
                    break;
                }

                const encodedSampleCount = encoderInstance.encoder.encodeFloat(
                    samples,
                    samples.length,
                    req.data.maxDataBytes
                );
                const encoded = {
                    buffer: new ArrayBuffer(encodedSampleCount),
                    duration:
                        encodedSampleCount / encoderInstance.options.sampleRate
                };
                new Uint8Array(encoded.buffer).set(
                    encoderInstance.encoder
                        .encoded()
                        .subarray(0, encodedSampleCount)
                );
                this.sendResponse<IEncodeFloat>(
                    {
                        requestId: req.requestId,
                        value: {
                            encoded
                        }
                    },
                    [encoded.buffer]
                );
                break;
            }
            case RequestType.DecodeFloat: {
                const decoderInstance =
                    decoders.get(req.data.decoderId) ?? null;
                let decoded: Float32Array<ArrayBuffer> | null;

                if (decoderInstance === null) {
                    throw new Error(
                        `No decoder found for decoder id: ${req.data.decoderId}`
                    );
                }

                const { decoder } = decoderInstance;
                const decodedSamples = decoder.decodeFloat(
                    new Uint8Array(req.data.encoded),
                    req.data.decodeFec
                );
                decoded = decoder.decoded().slice(0, decodedSamples);

                this.sendResponse<IDecodeFloat>(
                    {
                        requestId: req.requestId,
                        value: {
                            decoded: decoded.buffer
                        }
                    },
                    decoded !== null ? [decoded.buffer] : []
                );
                break;
            }
            case RequestType.OpusSetRequest: {
                const encoderInstance = encoders.get(req.data.encoderId);
                this.sendResponse<IOpusSetRequest>(
                    encoderInstance?.encoder
                        ? {
                              value: setToEncoder(
                                  encoderInstance.encoder,
                                  req.data
                              ),
                              requestId: req.requestId
                          }
                        : {
                              requestId: req.requestId,
                              failures: [
                                  `No encoder found for: ${req.data.encoderId}`
                              ]
                          }
                );
                break;
            }
            case RequestType.OpusGetRequest: {
                const encoderInstance =
                    encoders.get(req.data.encoderId) ?? null;
                if (encoderInstance === null) {
                    throw new Error(
                        `No encoder found for: ${req.data.encoderId}`
                    );
                }
                this.sendResponse<IOpusGetRequest>({
                    value: getFromEncoder(encoderInstance.encoder, req.data),
                    requestId: req.requestId
                });
                break;
            }
        }
    }
}
