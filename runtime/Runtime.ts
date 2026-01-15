import { type EmscriptenRuntime } from '../native/index.js';

export default class Runtime {
    readonly #runtime;
    public constructor(runtime: EmscriptenRuntime) {
        this.#runtime = runtime;
    }
    public originalRuntime() {
        return this.#runtime;
    }
    public subarray(start: number, end: number) {
        return new Uint8Array(this.#runtime.memory.buffer, start, end - start);
    }
    public free(offset: number) {
        this.#runtime.free(offset);
    }
    public view() {
        return new DataView(this.#runtime.memory.buffer);
    }
    public malloc(len: number) {
        const offset = this.#runtime.malloc(len);
        if (!offset) {
            throw new Error(`failed to allocate ${len} bytes`);
        }
        return offset;
    }
}
