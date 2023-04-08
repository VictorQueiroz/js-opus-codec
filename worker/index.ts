import { Decoder, Encoder, RingBuffer } from 'opus-codec/opus';
import {
    ICreateEncoder,
    IDestroyEncoder,
    IEncodeFloat,
    RequestResponse,
    RequestType,
    RequestResponseType,
    WorkerRequest,
    CodecId,
    IOpusSetRequest,
    IOpusGetRequest,
    ICreateDecoder,
    IDecodeFloat,
    IDestroyDecoder,
} from '../actions/actions';
import native from 'opus-codec/native';
import { Runtime } from 'opus-codec/runtime';
import { getFromEncoder, setToEncoder } from './opus';

const pendingRuntime = native({
    locateFile: () => '/opus/index.wasm',
});
const encoders = new Map<CodecId, IEncoderInstance>();
const decoders = new Map<CodecId, Decoder>();

interface IEncoderInstance {
    encoder: Encoder;
    ringBuffer: RingBuffer;
    sampleRate: number;
}

function generateCodecId() {
    return crypto.getRandomValues(new Uint32Array(4)).join('-');
}

onmessage = async (e: MessageEvent) => {
    const runtime = new Runtime(await pendingRuntime);
    const req = e.data as WorkerRequest;
    switch (req.type) {
        case RequestType.CreateEncoder: {
            const encoder = new Encoder(
                runtime,
                req.data.sampleRate,
                req.data.channels,
                req.data.application,
                req.data.outBufferLength,
                req.data.pcmBufferLength
            );
            const encoderId = generateCodecId();
            encoders.set(encoderId, {
                sampleRate: req.data.sampleRate,
                ringBuffer: new RingBuffer(
                    req.data.pcmBufferLength / Float32Array.BYTES_PER_ELEMENT
                ),
                encoder,
            });
            const response: RequestResponse<
                RequestResponseType<ICreateEncoder>
            > = {
                requestId: req.requestId,
                value: encoderId,
            };
            postMessage(response);
            break;
        }
        case RequestType.CreateDecoder: {
            const decoder = new Decoder(
                runtime,
                req.data.sampleRate,
                req.data.channels,
                req.data.frameSize
            );
            const encoderId = generateCodecId();
            decoders.set(encoderId, decoder);
            const response: RequestResponse<
                RequestResponseType<ICreateDecoder>
            > = {
                requestId: req.requestId,
                value: encoderId,
            };
            postMessage(response);
            break;
        }
        case RequestType.DestroyEncoder: {
            const encoderInstance = encoders.get(req.data);
            if (!encoderInstance) {
                throw new Error('Failed to get encoder');
            }

            encoders.delete(req.data);
            encoderInstance.encoder.destroy();
            const response: RequestResponse<
                RequestResponseType<IDestroyEncoder>
            > = encoderInstance
                ? {
                      requestId: req.requestId,
                      value: req.data,
                  }
                : {
                      requestId: req.requestId,
                      failures: [`failed to find encoder with id: ${req.data}`],
                  };
            postMessage(response);
            break;
        }
        case RequestType.DestroyDecoder: {
            const decoder = decoders.get(req.data.decoderId);
            /**
             * delete decoder from decoders map
             */
            decoders.delete(req.data.decoderId);
            /**
             * destroy decoder
             */
            if (decoder) {
                decoder.destroy();
            }
            const response: RequestResponse<
                RequestResponseType<IDestroyDecoder>
            > = decoder
                ? {
                      requestId: req.requestId,
                      value: true,
                  }
                : {
                      requestId: req.requestId,
                      failures: [
                          `failed to find decoder with id: ${req.data.decoderId}`,
                      ],
                  };
            postMessage(response);
            break;
        }
        case RequestType.EncodeFloat: {
            const encoderInstance = encoders.get(req.data.encoderId);
            if (!encoderInstance) {
                throw new Error('Failed to get encoder');
            }

            encoderInstance.ringBuffer.write(req.data.pcm);

            const samples = encoderInstance.ringBuffer.read();

            if (samples === null) {
                const response: RequestResponse<
                    RequestResponseType<IEncodeFloat>
                > = {
                    requestId: req.requestId,
                    value: {
                        encoded: null,
                    },
                };
                postMessage(response);
                return;
            }

            const encodedSampleCount = encoderInstance.encoder.encodeFloat(
                samples,
                req.data.frameSize,
                req.data.maxDataBytes
            );
            const encoded = {
                buffer: new ArrayBuffer(encodedSampleCount),
                duration: encodedSampleCount / encoderInstance.sampleRate,
            };
            const response: RequestResponse<RequestResponseType<IEncodeFloat>> =
                {
                    requestId: req.requestId,
                    value: {
                        encoded,
                    },
                };

            new Uint8Array(encoded.buffer).set(
                encoderInstance.encoder
                    .encoded()
                    .subarray(0, encodedSampleCount)
            );
            postMessage(response, [encoded.buffer]);
            break;
        }
        case RequestType.DecodeFloat: {
            const decoder = decoders.get(req.data.decoderId);
            let decoded: Float32Array | null;

            if (decoder) {
                const decodedSamples = decoder.decodeFloat(
                    new Uint8Array(req.data.encoded),
                    req.data.decodeFec
                );
                decoded = decoder.decoded().slice(0, decodedSamples);
            } else {
                decoded = null;
            }

            const response: RequestResponse<RequestResponseType<IDecodeFloat>> =
                decoded
                    ? {
                          requestId: req.requestId,
                          value: {
                              decoded: decoded.buffer,
                          },
                      }
                    : {
                          requestId: req.requestId,
                          failures: [
                              `no decoder found for decoder id: ${req.data.decoderId}`,
                          ],
                      };

            postMessage(response, decoded ? [decoded.buffer] : []);
            break;
        }
        case RequestType.OpusSetRequest: {
            const encoderInstance = encoders.get(req.data.encoderId);
            const response: RequestResponse<
                RequestResponseType<IOpusSetRequest>
            > = encoderInstance?.encoder
                ? {
                      value: setToEncoder(encoderInstance.encoder, req.data),
                      requestId: req.requestId,
                  }
                : {
                      requestId: req.requestId,
                      failures: [`no encoder found for: ${req.data.encoderId}`],
                  };
            postMessage(response);
            break;
        }
        case RequestType.OpusGetRequest: {
            const encoderInstance = encoders.get(req.data.encoderId);
            const response: RequestResponse<
                RequestResponseType<IOpusGetRequest>
            > = encoderInstance?.encoder
                ? {
                      value: getFromEncoder(encoderInstance.encoder, req.data),
                      requestId: req.requestId,
                  }
                : {
                      requestId: req.requestId,
                      failures: [`no encoder found for: ${req.data.encoderId}`],
                  };
            postMessage(response);
            break;
        }
    }
};
