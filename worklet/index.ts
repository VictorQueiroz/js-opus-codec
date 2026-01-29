import WorkletRingBuffer from './WorkletRingBuffer.js';
import { LastKnownMemorizer } from 'cachecraft';

type Channels = Float32Array[];

interface ICreateWorkletRingBufferOptions {
    frameSize: number;
    channelCount: number;
}

class DefaultAudioProcessor extends AudioWorkletProcessor {
    #ringBuffer: LastKnownMemorizer<
        ICreateWorkletRingBufferOptions,
        WorkletRingBuffer
    > = new LastKnownMemorizer(
        ({ frameSize, channelCount }) =>
            new WorkletRingBuffer(frameSize, channelCount),
        (a, b) =>
            a.frameSize === b.frameSize && a.channelCount === b.channelCount
    );
    #shouldContinue = true;

    static get parameterDescriptors() {
        return [
            {
                name: 'frameSize'
            },
            {
                name: 'channelCount'
            },
            {
                name: 'queueFrameCount'
            }
        ] as const;
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
        const frameSize = this.#getNumber('frameSize', parameters);
        const channelCount = this.#getNumber('channelCount', parameters);
        const queueFrameCount = this.#getNumber('queueFrameCount', parameters);
        const ringBuffer = this.#ringBuffer.get({ frameSize, channelCount });

        for (const channels of inputList) {
            if (!channels.length) {
                continue;
            }

            ringBuffer.write(channels.slice(0, channelCount));
        }

        const remainingFrames = ringBuffer.remainingFrames();
        if (remainingFrames.some((frames) => frames < queueFrameCount)) {
            return this.#shouldContinue;
        }

        let samples: Float32Array<ArrayBuffer>[] | null;
        do {
            samples = ringBuffer.read();

            if (samples === null) {
                continue;
            }
            this.port.postMessage(
                {
                    samples
                },
                samples.map((s) => s.buffer)
            );
        } while (samples !== null);

        if (!this.#shouldContinue) {
            let samples: Float32Array<ArrayBuffer>[] | null;
            do {
                samples = ringBuffer.drain();
                if (samples !== null) {
                    this.port.postMessage({
                        samples
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

    #getNumber(
        key: 'frameSize' | 'channelCount' | 'queueFrameCount',
        parameters: Record<string, Float32Array>
    ): number {
        const value = parameters[key];
        if (!value || value.length === 0) {
            throw new Error(`Parameter ${key} is missing`);
        }
        return value[0];
    }
}

registerProcessor('default-audio-processor', DefaultAudioProcessor);
