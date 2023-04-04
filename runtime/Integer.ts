import { IResource } from "./ResourcesHolder";
import Runtime from "./Runtime";

export default class Integer implements IResource {
    readonly #runtime;
    #offset;
    public constructor(runtime: Runtime){
        this.#runtime = runtime;
        this.#offset = runtime.malloc(runtime.originalRuntime()._size_of_int());
    }

    public value(){
        if(this.#runtime.originalRuntime()._size_of_int() !== 4){
            throw new Error('invalid integer byte size');
        }
        return this.#runtime.view().getInt32(this.#offset);
    }

    public size(){
        return this.#runtime.originalRuntime()._size_of_int();
    }

    public offset(){
        return this.#offset;
    }

    public destroy(){
        this.#runtime.free(this.#offset);
        this.#offset = 0;
    }
}
