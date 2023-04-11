import { OpusGetRequest, OpusSetRequest } from './opus';

export interface IWorkerRequest<Data, Response> {
    data: Data;
    _response?: RequestResponse<Response>;
    transfer?: ArrayBuffer[];
    requestId: RequestId;
}

export type CodecId = string;

export type RequestResponse<T> =
    | {
          requestId: RequestId;
          value: T;
      }
    | {
          requestId: RequestId;
          failures: string[];
      };

export type RequestId = ReturnType<typeof getRequestId>;

export interface ICreateEncoderOptions {
    sampleRate: number;
    channels: number;
    application: number;
    outBufferLength: number;
    pcmBufferLength: number;
}

export interface IOpusGetRequest
    extends IWorkerRequest<OpusGetRequest, number> {
    type: RequestType.OpusGetRequest;
}

export function getFromEncoder(data: OpusGetRequest): IOpusGetRequest {
    return {
        type: RequestType.OpusGetRequest,
        data,
        requestId: getRequestId(),
    };
}

export interface IOpusSetRequest
    extends IWorkerRequest<OpusSetRequest, boolean> {
    type: RequestType.OpusSetRequest;
}

export function setToEncoder(data: OpusSetRequest): IOpusSetRequest {
    return {
        type: RequestType.OpusSetRequest,
        data,
        requestId: getRequestId(),
    };
}

export interface ICreateEncoder
    extends IWorkerRequest<ICreateEncoderOptions, CodecId> {
    type: RequestType.CreateEncoder;
}

export interface ICreateDecoderOptions {
    sampleRate: number;
    channels: number;
    frameSize: number;
}

export interface ICreateDecoder
    extends IWorkerRequest<ICreateDecoderOptions, CodecId> {
    type: RequestType.CreateDecoder;
}

export function createDecoder(
    sampleRate: number,
    channels: number,
    frameSize: number
): ICreateDecoder {
    return {
        type: RequestType.CreateDecoder,
        data: {
            frameSize,
            sampleRate,
            channels,
        },
        requestId: getRequestId(),
    };
}

export interface IDestroyEncoderOptions {
    encoderId: CodecId;
}

export interface IDestroyEncoder extends IWorkerRequest<CodecId, null> {
    type: RequestType.DestroyEncoder;
}

export function destroyEncoder(encoderId: CodecId): IDestroyEncoder {
    return {
        type: RequestType.DestroyEncoder,
        data: encoderId,
        requestId: getRequestId(),
    };
}

export interface IDrainRingBufferResult {}

export enum RequestType {
    CreateEncoder,
    CreateDecoder,
    EncodeFloat,
    DecodeFloat,
    DestroyEncoder,
    InitializeWorker,
    DestroyDecoder,
    OpusGetRequest,
    OpusSetRequest,
}

export interface IInitializeWorker
    extends IWorkerRequest<IInitializeWorkerOptions, null> {
    type: RequestType.InitializeWorker;
}

export interface IInitializeWorkerOptions {
    wasmFileHref: string;
}

export function initializeWorker(
    data: IInitializeWorkerOptions
): IInitializeWorker {
    return {
        requestId: getRequestId(),
        data,
        type: RequestType.InitializeWorker,
    };
}

export interface IDestroyDecoder
    extends IWorkerRequest<{ decoderId: CodecId }, null> {
    type: RequestType.DestroyDecoder;
}

export function destroyDecoder(decoderId: CodecId): IDestroyDecoder {
    return {
        type: RequestType.DestroyDecoder,
        data: {
            decoderId,
        },
        requestId: getRequestId(),
    };
}

export interface IDecodeFloatOptions {
    decoderId: CodecId;
    decodeFec?: number;
    encoded: ArrayBuffer;
}
export interface IDecodeFloatResult {
    decoded: ArrayBuffer;
}

export interface IDecodeFloat
    extends IWorkerRequest<IDecodeFloatOptions, IDecodeFloatResult> {
    type: RequestType.DecodeFloat;
}

export function decodeFloat(data: IDecodeFloatOptions): IDecodeFloat {
    return {
        type: RequestType.DecodeFloat,
        data,
        requestId: getRequestId(),
        transfer: [data.encoded],
    };
}

export interface IEncodeFloatResult {
    /**
     * if null, it means the data was written to the ring buffer, but not yet submitted
     */
    encoded: {
        buffer: ArrayBuffer;
        /**
         * duration in milliseconds
         */
        duration: number;
    } | null;
}

export interface IEncodeFloat
    extends IWorkerRequest<IEncodeFloatOptions, IEncodeFloatResult> {
    type: RequestType.EncodeFloat;
}

export interface IEncodeFloatOptions {
    encoderId: CodecId;
    maxDataBytes: number;
    /**
     * if null, it will try to drain the ring buffer for the data
     * that has been queued
     */
    input: {
        pcm: Float32Array;
    } | null;
}

export type RequestResponseType<T> = T extends IWorkerRequest<unknown, infer R>
    ? R
    : never;

export type WorkerRequest =
    | IInitializeWorker
    | IEncodeFloat
    | ICreateEncoder
    | ICreateDecoder
    | IDestroyDecoder
    | IDecodeFloat
    | IDestroyEncoder
    | IOpusGetRequest
    | IOpusSetRequest;

function getRequestId() {
    const ids = crypto.getRandomValues(new Int32Array(4));
    return ids.join('-');
}

export function createEncoder(data: ICreateEncoderOptions): ICreateEncoder {
    return {
        data,
        requestId: getRequestId(),
        type: RequestType.CreateEncoder,
    };
}

export function encodeFloat(data: IEncodeFloatOptions): IEncodeFloat {
    return {
        data,
        requestId: getRequestId(),
        type: RequestType.EncodeFloat,
        transfer: data.input !== null ? [data.input.pcm] : [],
    };
}
