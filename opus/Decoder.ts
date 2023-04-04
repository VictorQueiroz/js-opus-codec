import {Runtime, Integer, Pointer, ResourcesHolder, Buffer} from '../runtime';

export default class Decoder {
    readonly #errorPointer;
    readonly #error;
    readonly #decoder;
    readonly #holder;
    readonly #runtime;
    readonly #pcm;
    readonly #frameSize;
    public constructor(runtime: Runtime, sampleRate: number, channels: number, frameSize: number){
        this.#frameSize = frameSize;
        this.#runtime = runtime;
        this.#holder = new ResourcesHolder();
        this.#error = new Integer(runtime);
        this.#errorPointer = new Pointer(runtime,this.#error);
        /**
         * holder
         */
        this.#holder.add(this.#error);
        this.#holder.add(this.#errorPointer);
        /**
         * create decoder
         */
        this.#decoder = runtime.originalRuntime()._opus_decoder_create(
            sampleRate,
            channels,
            this.#errorPointer.offset()
        );
        if(!this.#decoder || this.#error.value() < 0){
            throw new Error('Failed to create decoder');
        }
        this.#pcm = new Buffer(runtime,this.#frameSize*channels*Float32Array.BYTES_PER_ELEMENT);
    }
    #data: Buffer | null = null;
    public decodeFloat(value: Uint8Array, decodeFec = 0){
        let data = this.#data;
        if(!data) {
            data = new Buffer(this.#runtime,value.byteLength);
        }
        /**
         * reallocate in case current allocated buffer is smaller than the actual
         * incoming data
         */
        if(data.data().byteLength < value.byteLength){
            data.destroy();
            data = new Buffer(this.#runtime,value.byteLength);
        }
        /**
         * set data
         */
        data.data().set(value);
        /**
         * in case the data buffer has changed, set it back to the class
         * instance so we can later destroy it
         */
        this.#data = data;
        /**
         * decode float data
         */
        const decodedSamples = this.#runtime.originalRuntime()._opus_decode_float(
            this.#decoder,
            data.offset(),
            value.byteLength,
            this.#pcm.offset(),
            this.#frameSize,
            decodeFec
        );
        if(decodedSamples < 0){
            throw new Error('Failed to decode float');
        }
        return decodedSamples;
    }
    public decoded(){
        const pcm = this.#pcm.data();
        return new Float32Array(pcm.buffer,pcm.byteOffset,pcm.byteLength / Float32Array.BYTES_PER_ELEMENT);
    }
    public destroy(){
        this.#runtime.originalRuntime()._opus_decoder_destroy(this.#decoder);
        this.#holder.destroy();
        this.#data?.destroy();
    }
}