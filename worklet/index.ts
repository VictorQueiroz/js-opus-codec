import { RingBufferF32 } from 'ringbud';

type Channels = Float32Array[];

function interleave(ch: Float32Array[]): Float32Array {
    const C = ch.length;
    if (C === 0) return new Float32Array(0);

    const N = ch[0].length;
    for (let c = 1; c < C; c++) {
        if (ch[c].length !== N) throw new Error('Channel length mismatch');
    }

    const out = new Float32Array(N * C);
    for (let i = 0, o = 0; i < N; i++) {
        for (let c = 0; c < C; c++, o++) out[o] = ch[c][i];
    }
    return out;
}

class DefaultAudioProcessor extends AudioWorkletProcessor {
    #ringBuffer: RingBufferF32 | null = null;
    #shouldContinue = true;

    static get parameterDescriptors() {
        return [
            {
                name: 'frameSize',
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

        const interleaved = new Array<Float32Array>();

        for (const channels of inputList) {
            if (!channels.length) {
                continue;
            }

            interleaved.push(interleave(channels));
        }

        this.#ringBuffer.write(interleave(interleaved));

        const samples = this.#ringBuffer.read();

        if (samples !== null) {
            this.port.postMessage({
                samples,
            });
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
