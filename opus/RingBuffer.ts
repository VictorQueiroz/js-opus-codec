export default class RingBuffer {
    #arrayBuffer;
    #readOffset;
    #writeOffset;
    #frameSize;
    public constructor(frameSize: number) {
        this.#readOffset = 0;
        this.#writeOffset = 0;
        this.#arrayBuffer = new ArrayBuffer(this.#initialSize());
        this.#frameSize = frameSize;
    }
    #view() {
        return new Float32Array(this.#arrayBuffer);
    }
    public write(value: Float32Array) {
        this.#maybeReallocate(value.length);
        this.#view().set(value, this.#writeOffset);
        this.#writeOffset += value.length;
    }
    public read(): Float32Array | null {
        const remainingBytes = this.#writeOffset - this.#readOffset;
        if (remainingBytes >= this.#frameSize) {
            const view = this.#view().subarray(
                this.#readOffset,
                this.#readOffset + this.#frameSize
            );
            this.#readOffset += this.#frameSize;
            if (this.#readOffset >= this.#writeOffset) {
                this.#writeOffset = 0;
                this.#readOffset = 0;
            }
            return view;
        }
        return null;
    }
    #maybeReallocate(samples: number) {
        const sampleCountInBytes = samples * Float32Array.BYTES_PER_ELEMENT;
        if (this.#view().length <= samples) {
            const oldArrayBuffer = this.#arrayBuffer;
            this.#arrayBuffer = new ArrayBuffer(
                oldArrayBuffer.byteLength +
                    sampleCountInBytes +
                    this.#initialSize()
            );
            this.#view().set(new Uint8Array(oldArrayBuffer));
        }
    }
    #initialSize() {
        return this.#frameSize * Float32Array.BYTES_PER_ELEMENT * 2;
    }
}
