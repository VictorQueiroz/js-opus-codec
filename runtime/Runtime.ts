import { EmscriptenRuntime } from "../native";

export default class Runtime {
    readonly #runtime;
    public constructor(runtime: EmscriptenRuntime){
        this.#runtime = runtime;
    }
    public originalRuntime(){
        return this.#runtime;
    }
    public subarray(start: number, end: number){
        return this.#runtime.HEAPU8.subarray(start,end);
    }
    public free(offset: number){
        this.#runtime._free(offset);
    }
    public view(){
        return new DataView(this.#runtime.HEAPU8.buffer);
    }
    public malloc(len: number){
        const offset = this.#runtime._malloc(len);
        if(!offset){
            throw new Error(`failed to allocate ${len} bytes`);
        }
        return offset;
    }
}