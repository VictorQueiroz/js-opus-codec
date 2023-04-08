import { OpusGetRequest, OpusSetRequest } from './opus';

export interface IWorkerRequest<Data, Response> {
    data: Data;
    _response?: RequestResponse<Response>;
    transfer?: ArrayBuffer[];
    requestId: RequestId;
}

export type EncoderId = string;

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
    extends IWorkerRequest<ICreateEncoderOptions, EncoderId> {
    type: RequestType.CreateEncoder;
}

export interface IDestroyEncoderOptions {
    encoderId: EncoderId;
}

export interface IDestroyEncoder extends IWorkerRequest<EncoderId, EncoderId> {
    type: RequestType.DestroyEncoder;
}

export function destroyEncoder(encoderId: EncoderId): IDestroyEncoder {
    return {
        type: RequestType.DestroyEncoder,
        data: encoderId,
        requestId: getRequestId(),
    };
}

export enum RequestType {
    CreateEncoder,
    EncodeFloat,
    DestroyEncoder,
    OpusGetRequest,
    OpusSetRequest,
}

export interface IEncodeFloatResult {
    encoded: ArrayBuffer | null;
}

export interface IEncodeFloat
    extends IWorkerRequest<IEncodeFloatOptions, IEncodeFloatResult> {
    type: RequestType.EncodeFloat;
}

export interface IEncodeFloatOptions {
    pcm: Float32Array;
    encoderId: EncoderId;
    frameSize: number;
    maxDataBytes: number;
}

export type RequestResponseType<T> = T extends IWorkerRequest<unknown, infer R>
    ? R
    : never;

export type WorkerRequest =
    | IEncodeFloat
    | ICreateEncoder
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
        transfer: [data.pcm.buffer],
    };
}
