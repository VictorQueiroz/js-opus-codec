import { Encoder, RingBuffer } from 'opus-codec/opus';
import {
    ICreateEncoder,
    IDestroyEncoder,
    IEncodeFloat,
    RequestResponse,
    RequestType,
    RequestResponseType,
    WorkerRequest,
    EncoderId,
    IOpusSetRequest,
    IOpusGetRequest,
} from '../actions/actions';
import native from 'opus-codec/native';
import { Runtime } from 'opus-codec/runtime';
import { getFromEncoder, setToEncoder } from './opus';

const pendingRuntime = native({
    locateFile: () => '/opus/index.wasm',
});
const encoders = new Map<EncoderId, IEncoderInstance>();

interface IEncoderInstance {
    encoder: Encoder;
    ringBuffer: RingBuffer;
}

function generateEncoderId() {
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
            const encoderId = generateEncoderId();
            encoders.set(encoderId, {
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
        case RequestType.DestroyEncoder: {
            const encoderInstance = encoders.get(req.data);
            if (!encoderInstance) {
                throw new Error('Failed to get encoder');
            }

            encoderInstance.encoder.destroy();
            encoders.delete(req.data);
            const response: RequestResponse<
                RequestResponseType<IDestroyEncoder>
            > = {
                requestId: req.requestId,
                value: req.data,
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
            const response: RequestResponse<RequestResponseType<IEncodeFloat>> =
                {
                    requestId: req.requestId,
                    value: {
                        encoded: null,
                    },
                };

            if (samples === null) {
                postMessage(response);
                return;
            }

            const encodedSampleCount = encoderInstance.encoder.encodeFloat(
                samples,
                req.data.frameSize,
                req.data.maxDataBytes
            );
            response.value.encoded = new ArrayBuffer(encodedSampleCount);
            new Uint8Array(response.value.encoded).set(
                encoderInstance.encoder
                    .encoded()
                    .subarray(0, encodedSampleCount)
            );
            postMessage(response, [response.value.encoded]);
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
