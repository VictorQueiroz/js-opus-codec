import { Runtime, Integer, ResourcesHolder, Buffer } from '../runtime';
import { OpusGettersAndSetters } from './OpusGettersAndSetters';

export default class Encoder extends OpusGettersAndSetters {
    readonly #error;
    readonly #runtime;
    readonly #encoder;
    readonly #encoded;
    readonly #pcm;
    readonly #holder;
    public constructor(
        runtime: Runtime,
        sampleRate: number,
        channels: number,
        application: number,
        /**
         * what is the size of the buffer that holds the encoded data
         */
        outBufferLength: number,
        /**
         * how many bytes will we be receiving through encodeFloat() function
         */
        pcmBufferLength: number
    ) {
        const error = new Integer(runtime);
        const encoderId = runtime
            .originalRuntime()
            ._opus_encoder_create(
                sampleRate,
                channels,
                application,
                error.offset()
            );

        super(runtime, encoderId);
        this.#holder = new ResourcesHolder();
        this.#error = error;
        this.#runtime = runtime;
        /**
         * pcm buffer
         */
        this.#pcm = new Buffer(runtime, pcmBufferLength);
        /**
         * out buffer
         */
        this.#encoded = new Buffer(runtime, outBufferLength);
        /**
         * add items to resources holder
         */
        this.#holder.add(this.#encoded);
        this.#holder.add(this.#pcm);
        this.#holder.add(this.#error);
        /**
         * create encoder
         */
        this.#encoder = encoderId;
        if (error.value() < 0) {
            throw new Error('Failed to create encoder');
        }
        if (!outBufferLength) {
            throw new Error('outBufferLength must be more than 0');
        }
    }
    public encoded() {
        return this.#encoded.data();
    }
    /**
     *
     * @param value
     * @param frameSize
     * @param maxDataBytes
     * @returns encoded sample count
     */
    public encodeFloat(
        value: Float32Array,
        frameSize: number,
        maxDataBytes: number
    ) {
        if (maxDataBytes > this.#encoded.size()) {
            throw new Error(
                `encoded buffer length is ${this.#encoded.size()}, but maxDataBytes is ${maxDataBytes}`
            );
        }

        this.#pcm
            .data()
            .set(
                new Uint8Array(value.buffer, value.byteOffset, value.byteLength)
            );

        const result = this.#runtime
            .originalRuntime()
            ._opus_encode_float(
                this.#encoder,
                this.#pcm.offset(),
                frameSize,
                this.#encoded.offset(),
                maxDataBytes
            );

        if (result < 0) {
            throw new Error(`Failed to encode float`);
        }

        return result;
    }
    public destroy() {
        this.#holder.destroy();
        this.#runtime.originalRuntime()._opus_encoder_destroy(this.#encoder);
    }
}
