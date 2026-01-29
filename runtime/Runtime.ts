import { type EmscriptenRuntime } from '../native/index.js';

export default class Runtime {
    readonly #runtime;
    readonly #allocations = new Map<number, string | null>();
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
        this.#allocations.delete(offset);
        this.#runtime.free(offset);
    }
    public view() {
        return new DataView(this.#runtime.memory.buffer);
    }
    public malloc(len: number) {
        const offset = this.#runtime.malloc(len);
        if (!offset) {
            throw new Error(`Failed to allocate ${len} bytes`);
        }
        const stack = new Error().stack ?? null;
        this.#allocations.set(offset, stack);
        return offset;
    }
    [Symbol.dispose]() {
        for (const [offset, stack] of this.#allocations) {
            throw new Error(
                `Memory leak detected at offset ${offset}\nAllocation stack:\n${stack}`
            );
        }
    }
}
