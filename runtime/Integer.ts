import { IResource } from './ResourcesHolder.js';
import Runtime from './Runtime.js';

export default class Integer implements IResource {
    readonly #runtime;
    #offset;
    public constructor(runtime: Runtime) {
        this.#runtime = runtime;
        this.#offset = runtime.malloc(runtime.originalRuntime().size_of_int());
    }

    public value() {
        if (this.#runtime.originalRuntime().size_of_int() !== 4) {
            throw new Error('invalid integer byte size');
        }
        return this.#runtime.view().getInt32(this.#offset, true);
    }

    public set(value: number) {
        this.#runtime.view().setInt32(this.#offset, value, true);
    }

    public size() {
        return this.#runtime.originalRuntime().size_of_int();
    }

    public offset() {
        if (this.#offset === 0) {
            throw new Error('Integer has been destroyed');
        }
        return this.#offset;
    }

    public destroy() {
        this.#runtime.free(this.#offset);
        this.#offset = 0;
    }

    [Symbol.dispose]() {
        this.destroy();
    }
}
