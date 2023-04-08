import { boundMethod } from 'autobind-decorator';
import { RingBuffer } from 'opus-codec/opus';

type Channels = Float32Array[];

declare abstract class AudioWorkletProcessor {
    port: MessagePort;
    constructor(...args: unknown[]);
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
    #ringBuffer: RingBuffer | null = null;
    #shouldContinue = true;

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

    public constructor(...args: unknown[]) {
        super(args);
        this.port.addEventListener('message', this.onMessage);
        this.port.start();
    }

    public process(
        inputList: Channels[],
        _: Channels[],
        parameters: Record<string, Float32Array>
    ) {
        const frameSize = parameters['frameSize'][0];
        const debug = parameters['debug'][0] ? true : false;
        if (!this.#ringBuffer) {
            this.#ringBuffer = new RingBuffer(frameSize);
        }

        if (!inputList.length) {
            console.error('no data available in input list: %o', inputList);
            return this.#shouldContinue;
        }

        for (const inputChannel of inputList) {
            if (!inputChannel.length) {
                console.error(
                    'channel available, but no data: %o',
                    inputChannel
                );
                break;
            }

            this.#ringBuffer.write(inputChannel[0]);

            const samples = this.#ringBuffer.read();

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
        return this.#shouldContinue;
    }
    @boundMethod private onMessage(e: MessageEvent) {
        if (e.data && e.data.stop) {
            this.#shouldContinue = false;
        }
    }
}

registerProcessor('default-audio-processor', DefaultAudioProcessor);
