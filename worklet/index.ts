import { RingBuffer } from 'opus-codec/opus';
import { MessagePort } from 'worker_threads';

type Channels = Float32Array[];

declare abstract class AudioWorkletProcessor {
    port: MessagePort;
    abstract process(
        inputList: Channels[],
        outputList: Channels[],
        parameters: Record<string, Float32Array>
    ): boolean;
}

declare const registerProcessor: (
    name: string,
    value: new () => AudioWorkletProcessor
) => void;

class DefaultAudioProcessor extends AudioWorkletProcessor {
    ringBuffer: RingBuffer | null = null;
    static get parameterDescriptors() {
        return [
            {
                name: 'frameSize',
            },
            {
                name: 'debug',
            },
        ];
    }
    process(
        inputList: Channels[],
        _: Channels[],
        parameters: Record<string, Float32Array>
    ) {
        const frameSize = parameters['frameSize'][0];
        const debug = parameters['debug'][0] ? true : false;
        if (!this.ringBuffer) {
            this.ringBuffer = new RingBuffer(frameSize);
        }

        if (!inputList.length) {
            console.error('no data available in input list: %o', inputList);
            return true;
        }

        for (const inputChannel of inputList) {
            if (!inputChannel.length) {
                console.error(
                    'channel available, but no data: %o',
                    inputChannel
                );
                break;
            }

            this.ringBuffer.write(inputChannel[0]);

            const samples = this.ringBuffer.read();

            if (samples) {
                if (debug) {
                    console.log(
                        'read %d samples out from ring buffer',
                        samples.length
                    );
                }
                this.port.postMessage({
                    samples,
                });
            }
            break;
        }
        return true;
    }
}

registerProcessor('default-audio-processor', DefaultAudioProcessor);
