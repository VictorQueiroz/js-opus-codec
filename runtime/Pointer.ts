import Integer from "./Integer";
import { IResource } from "./ResourcesHolder";
import Runtime from "./Runtime";

export default class Pointer implements IResource {
    readonly #offset;
    readonly #runtime;
    public constructor(runtime: Runtime, value: Integer){
        this.#runtime = runtime;
        this.#offset = runtime.malloc(runtime.originalRuntime()._size_of_void_ptr());
        this.#runtime.view().setUint32(this.#offset, value.offset(), true);
    }
    public offset(){
        return this.#offset;
    }
    public destroy(){
        this.#runtime.free(this.#offset);
    }
    public value(){
        return this.#runtime.view().getUint32(this.#offset,true);
    }
}
