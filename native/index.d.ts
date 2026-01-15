type GeneratedOpusGettersAndSetters =
    import('./opus-ts-getters-and-setters.d.ts').GeneratedOpusGettersAndSetters;

export interface EmscriptenRuntime extends GeneratedOpusGettersAndSetters {
    memory: { buffer: ArrayBuffer };
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
}

export interface IInitEmscriptenRuntimeOptions {
    wasmFileHref: string;
}

declare const Module: (
    options?: Partial<IInitEmscriptenRuntimeOptions>
) => Promise<EmscriptenRuntime>;

export default Module;
