type GeneratedOpusGettersAndSetters =
    import('./opus-ts-getters-and-setters').GeneratedOpusGettersAndSetters;

export interface EmscriptenRuntime extends GeneratedOpusGettersAndSetters {
    HEAPU8: Uint8Array;
    _malloc(n: number): number;
    _size_of_int(): number;
    _size_of_void_ptr(): number;
    _free(n: number): void;
    _opus_decoder_create(
        sampleRate: number,
        channels: number,
        error: number
    ): number;
    _opus_decoder_destroy(dec: number): void;
    _opus_decode_float(
        decoder: number, // OpusDecoder *st,
        data: number, // const unsigned char *data,
        dataLength: number, // opus_int32 len,
        outPcm: number, // float *pcm,
        frameSize: number, // int frame_size,
        decodeFec: number // int decode_fec
    ): number;
    _opus_encoder_create(
        fs: number,
        channels: number,
        application: number,
        err: number
    ): number;
    _opus_encoder_destroy(encoder: number): void;
    _opus_encode_float(
        encoder: number, // OpusEncoder *st,
        pcm: number, // const float *pcm,
        frame_size: number, // int frame_size,
        data: number, // [out] unsigned char *data,
        max_data_bytes: number // opus_int32 max_data_bytes
    ): number;
}

export interface IInitEmscriptenRuntimeOptions {
    wasmBinary: string;
    locateFile(path: string, scriptDirectory: string): string;
}

declare const Module: (
    options?: Partial<IInitEmscriptenRuntimeOptions>
) => Promise<EmscriptenRuntime>;

export default Module;
