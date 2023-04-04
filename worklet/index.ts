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
        ];
    }
    process(
        inputList: Channels[],
        _: Channels[],
        parameters: Record<string, Float32Array>
    ) {
        const frameSize = parameters['frameSize'][0];
        if (!this.ringBuffer) {
            this.ringBuffer = new RingBuffer(frameSize);
        }

        this.ringBuffer.write(inputList[0][0]);

        const samples = this.ringBuffer.read();
        if (!samples) {
            return true;
        }

        this.port.postMessage({
            samples,
        });
        return true;
    }
}

registerProcessor('default-audio-processor', DefaultAudioProcessor);
