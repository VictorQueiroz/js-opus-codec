type GeneratedOpusGettersAndSetters =
    import('./opus-ts-getters-and-setters.d.ts').GeneratedOpusGettersAndSetters;

export interface EmscriptenRuntime extends GeneratedOpusGettersAndSetters {
    memory: { buffer: ArrayBuffer; grow(delta: number): number };
    __data_end: { value: number };
    __heap_end: { value: number };
    __heap_base: { value: number };
    malloc(n: number): number;
    size_of_int(): number;
    size_of_void_ptr(): number;
    free(n: number): void;
    opus_decoder_create(
        sampleRate: number,
        channels: number,
        error: number
    ): number;
    opus_decoder_destroy(dec: number): void;
    opus_decode_float(
        decoder: number, // OpusDecoder *st,
        data: number, // const unsigned char *data,
        dataLength: number, // opus_int32 len,
        outPcm: number, // float *pcm,
        frameSize: number, // int frame_size,
        decodeFec: number // int decode_fec
    ): number;
    opus_encoder_create(
        fs: number,
        channels: number,
        application: number,
        err: number
    ): number;
    opus_encoder_destroy(encoder: number): void;
    opus_encode_float(
        encoder: number, // OpusEncoder *st,
        pcm: number, // const float *pcm,
        frame_size: number, // int frame_size,
        data: number, // [out] unsigned char *data,
        max_data_bytes: number // opus_int32 max_data_bytes
    ): number;

    /**
     * libopusenc
     */
    /** Create a new OggOpus stream to be used along with.ope_encoder_get_page().
     This is mostly useful for muxing with other streams.
        \param comments   Comments associated with the stream
        \param rate       Input sampling rate (48 kHz is faster)
        \param channels   Number of channels
        \param family     Mapping family (0 for mono/stereo, 1 for surround)
        \param[out] error Error code (NULL if no error is to be returned)
        \return Newly-created encoder.
        */
    ope_encoder_create_pull: (
        comments: number,
        rate: number,
        channels: number,
        family: 0 | 1,
        error: number
    ) => number;
    ope_encoder_get_page: () => number;
    ope_encoder_write_float: (
        enc: number,
        pcm: number,
        samples_per_channel: number
    ) => number;
    ope_encoder_drain: () => number;
    ope_encoder_destroy: (id: number) => void;
    ope_encoder_ctl: () => number;
    ope_strerror: () => number;
    ope_comments_create: () => number;
    /** Add a comment.
        \param[in,out] comments Where to add the comments
        \param         tag      Tag for the comment (must not contain = char)
        \param         val      Value for the tag
        \return Error code
    */
    ope_comments_add: (comments: number, tag: number, val: number) => number;
    ope_comments_destroy: (comments: number) => number;
}

export interface IInitEmscriptenRuntimeOptions {
    wasmFileHref: string;
}

declare const Module: (
    options?: Partial<IInitEmscriptenRuntimeOptions>
) => Promise<EmscriptenRuntime>;

export default Module;
