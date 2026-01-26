import { RingBufferF32 } from 'ringbud';

export default class WorkletRingBuffer {
    readonly #ringBuffers;
    public constructor(frameSize: number, channelCount: number) {
        this.#ringBuffers = new Array<RingBufferF32>();
        for (let i = 0; i < channelCount; i++) {
            this.#ringBuffers.push(
                new RingBufferF32(frameSize, {
                    frameCacheSize: 20
                })
            );
        }
    }
    public write(channels: Float32Array[]) {
        if (channels.length !== this.#ringBuffers.length) {
            throw new Error(
                `Expected ${this.#ringBuffers.length} channels, but got ${channels.length}`
            );
        }
        for (let i = 0; i < channels.length; i++) {
            this.#ringBuffers[i].write(channels[i]);
        }
    }
    public read(): Float32Array<ArrayBuffer>[] | null {
        const result: Float32Array<ArrayBuffer>[] = [];
        for (let i = 0; i < this.#ringBuffers.length; i++) {
            const samples = this.#ringBuffers[i].read();
            if (samples === null) {
                return null;
            }
            result.push(samples.slice(0));
        }
        return result;
    }
    public remainingFrames(): number[] {
        const result: number[] = [];
        for (const rb of this.#ringBuffers) {
            result.push(rb.remainingFrames());
        }
        return result;
    }
    public drain(): Float32Array<ArrayBuffer>[] | null {
        const result: Float32Array<ArrayBuffer>[] = [];
        for (let i = 0; i < this.#ringBuffers.length; i++) {
            const samples = this.#ringBuffers[i].drain();
            if (samples === null) {
                return null;
            }
            result.push(samples.slice(0));
        }
        if (!result.length) {
            return null;
        }
        return result;
    }
}
