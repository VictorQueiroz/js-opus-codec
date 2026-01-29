import { IResource } from '../runtime/ResourcesHolder.js';
import Runtime from '../runtime/Runtime.js';

export default class OggOpusComments implements IResource {
    public readonly id;
    readonly #runtime;
    public constructor(runtime: Runtime) {
        this.#runtime = runtime;
        this.id = this.#runtime.originalRuntime().ope_comments_create();
    }
    public destroy() {
        this.#runtime.originalRuntime().ope_comments_destroy(this.id);
    }
    public [Symbol.dispose]() {
        this.destroy();
    }
}
