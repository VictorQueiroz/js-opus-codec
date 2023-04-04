import { IResource } from "./ResourcesHolder";
import Runtime from "./Runtime";

export default class Buffer implements IResource {
    #offset;
    readonly #size;
    readonly #runtime;
    public constructor(runtime: Runtime, size: number){
        this.#runtime = runtime;
        this.#size = size;
        this.#offset = runtime.malloc(size);
    }
    public offset(){
        return this.#offset;
    }
    public data(){
        return this.#runtime.subarray(this.#offset,this.#offset + this.#size);
    }
    public size(){
        return this.#size;
    }
    public destroy(){
        this.#runtime.free(this.#offset);
        this.#offset = 0;
    }
}
