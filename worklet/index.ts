import { RingBufferF32 } from 'ringbud';

type Channels = Float32Array[];

class DefaultAudioProcessor extends AudioWorkletProcessor {
    #ringBuffer: RingBufferF32 | null = null;
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

    public constructor() {
        super();
        this.port.addEventListener('message', this.onMessage);
        this.port.start();
    }

    public process(
        inputList: Channels[],
        _: Channels[],
        parameters: Record<string, Float32Array>
    ) {
        const frameSize = parameters['frameSize'][0];
        if (!this.#ringBuffer) {
            this.#ringBuffer = new RingBufferF32(frameSize);
        }

        if (!inputList.length) {
            console.error('no data available in input list: %o', inputList);
        }

        for (const inputChannel of inputList) {
            if (!inputChannel.length) {
                console.error(
                    'channel available, but no data: %o',
                    inputChannel
                );
                break;
            }

            // for now, get just the first channel
            this.#ringBuffer.write(inputChannel[0]);

            const samples = this.#ringBuffer.read();

            if (samples !== null) {
                this.port.postMessage({
                    samples,
                });
            }
            break;
        }

        if (!this.#shouldContinue) {
            let samples: Float32Array | null;
            do {
                samples = this.#ringBuffer.drain();
                if (samples !== null) {
                    this.port.postMessage({
                        samples,
                    });
                }
            } while (samples !== null);
        }

        return this.#shouldContinue;
    }
    private onMessage = (e: MessageEvent) => {
        if (e.data && e.data.stop) {
            this.#shouldContinue = false;
        }
    };
}

registerProcessor('default-audio-processor', DefaultAudioProcessor);
