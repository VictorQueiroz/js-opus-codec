import Buffer from '../runtime/Buffer.js';
import Integer from '../runtime/Integer.js';
import { IResource } from '../runtime/ResourcesHolder.js';
import Runtime from '../runtime/Runtime.js';
import constants from './constants.js';
import type OggOpusComments from './OggOpusComments.js';

export default class OggOpusEncoder implements IResource {
    readonly #runtime;
    readonly #id;
    readonly #error;
    readonly #buffer;

    public constructor(
        runtime: Runtime,
        comments: OggOpusComments,
        rate: number,
        channels: number,
        family: 0 | 1,
        sampleCount: number
    ) {
        this.#runtime = runtime;
        this.#error = new Integer(runtime);

        this.#id = this.#runtime
            .originalRuntime()
            .ope_encoder_create_pull(
                comments.id,
                rate,
                channels,
                family,
                this.#error.offset()
            );
        if (this.#error.value() !== constants.OPE_OK) {
            this.destroy();
            throw new Error(
                `Failed to create OggOpusEncoder: error code ${this.#error.value()}`
            );
        }
        this.#buffer = new Buffer(
            runtime,
            sampleCount * channels * Float32Array.BYTES_PER_ELEMENT
        );
    }

    public writeFloat(samples: Float32Array, samplesPerChannel: number) {
        const runtime = this.#runtime.originalRuntime();
        const dest = this.#buffer.data();
        new Float32Array(
            dest.buffer,
            dest.byteOffset,
            dest.length / Float32Array.BYTES_PER_ELEMENT
        ).set(samples);

        return runtime.ope_encoder_write_float(
            this.#id,
            this.#buffer.offset(),
            samplesPerChannel
        );
    }

    public destroy() {
        this.#error.destroy();
        this.#runtime.originalRuntime().ope_encoder_destroy(this.#id);
    }

    public [Symbol.dispose]() {
        this.destroy();
    }
}
