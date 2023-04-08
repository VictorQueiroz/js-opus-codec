export enum OpusRequest {
    SetComplexity = 'OPUS_SET_COMPLEXITY',
    GetComplexity = 'OPUS_GET_COMPLEXITY',
    SetBitrate = 'OPUS_SET_BITRATE',
    GetBitrate = 'OPUS_GET_BITRATE',
    SetVbr = 'OPUS_SET_VBR',
    GetVbr = 'OPUS_GET_VBR',
    SetVbrConstraint = 'OPUS_SET_VBR_CONSTRAINT',
    GetVbrConstraint = 'OPUS_GET_VBR_CONSTRAINT',
    SetForceChannels = 'OPUS_SET_FORCE_CHANNELS',
    GetForceChannels = 'OPUS_GET_FORCE_CHANNELS',
    SetMaxBandwidth = 'OPUS_SET_MAX_BANDWIDTH',
    GetMaxBandwidth = 'OPUS_GET_MAX_BANDWIDTH',
    SetBandwidth = 'OPUS_SET_BANDWIDTH',
    SetSignal = 'OPUS_SET_SIGNAL',
    GetSignal = 'OPUS_GET_SIGNAL',
    SetApplication = 'OPUS_SET_APPLICATION',
    GetApplication = 'OPUS_GET_APPLICATION',
    GetLookahead = 'OPUS_GET_LOOKAHEAD',
    SetInbandFec = 'OPUS_SET_INBAND_FEC',
    GetInbandFec = 'OPUS_GET_INBAND_FEC',
    SetPacketLossperc = 'OPUS_SET_PACKET_LOSS_PERC',
    GetPacketLossperc = 'OPUS_GET_PACKET_LOSS_PERC',
    SetDtx = 'OPUS_SET_DTX',
    GetDtx = 'OPUS_GET_DTX',
    SetLsbDepth = 'OPUS_SET_LSB_DEPTH',
    GetLsbDepth = 'OPUS_GET_LSB_DEPTH',
    SetExpertFrameduration = 'OPUS_SET_EXPERT_FRAME_DURATION',
    GetExpertFrameduration = 'OPUS_GET_EXPERT_FRAME_DURATION',
    SetPredictionDisabled = 'OPUS_SET_PREDICTION_DISABLED',
    GetPredictionDisabled = 'OPUS_GET_PREDICTION_DISABLED',
    GetBandwidth = 'OPUS_GET_BANDWIDTH',
    GetSampleRate = 'OPUS_GET_SAMPLE_RATE',
    SetPhaseInversiondisabled = 'OPUS_SET_PHASE_INVERSION_DISABLED',
    GetPhaseInversiondisabled = 'OPUS_GET_PHASE_INVERSION_DISABLED',
    GetInDtx = 'OPUS_GET_IN_DTX',
    SetGain = 'OPUS_SET_GAIN',
    GetGain = 'OPUS_GET_GAIN',
    GetLastPacketduration = 'OPUS_GET_LAST_PACKET_DURATION',
    GetPitch = 'OPUS_GET_PITCH',
}
export interface IOpusSetComplexity {
    type: OpusRequest.SetComplexity;
    encoderId: string;
    value: number;
}
export function OPUS_SET_COMPLEXITY(encoderId: string,x: number): IOpusSetComplexity {
    return {
        encoderId,
        type: OpusRequest.SetComplexity,
        value: x
    };
}
export interface IOpusGetComplexity {
    type: OpusRequest.GetComplexity;
    encoderId: string;
}
export function OPUS_GET_COMPLEXITY(encoderId: string,): IOpusGetComplexity {
    return {
        encoderId,
        type: OpusRequest.GetComplexity,
    };
}
export interface IOpusSetBitrate {
    type: OpusRequest.SetBitrate;
    encoderId: string;
    value: number;
}
export function OPUS_SET_BITRATE(encoderId: string,x: number): IOpusSetBitrate {
    return {
        encoderId,
        type: OpusRequest.SetBitrate,
        value: x
    };
}
export interface IOpusGetBitrate {
    type: OpusRequest.GetBitrate;
    encoderId: string;
}
export function OPUS_GET_BITRATE(encoderId: string,): IOpusGetBitrate {
    return {
        encoderId,
        type: OpusRequest.GetBitrate,
    };
}
export interface IOpusSetVbr {
    type: OpusRequest.SetVbr;
    encoderId: string;
    value: number;
}
export function OPUS_SET_VBR(encoderId: string,x: number): IOpusSetVbr {
    return {
        encoderId,
        type: OpusRequest.SetVbr,
        value: x
    };
}
export interface IOpusGetVbr {
    type: OpusRequest.GetVbr;
    encoderId: string;
}
export function OPUS_GET_VBR(encoderId: string,): IOpusGetVbr {
    return {
        encoderId,
        type: OpusRequest.GetVbr,
    };
}
export interface IOpusSetVbrconstraint {
    type: OpusRequest.SetVbrConstraint;
    encoderId: string;
    value: number;
}
export function OPUS_SET_VBR_CONSTRAINT(encoderId: string,x: number): IOpusSetVbrconstraint {
    return {
        encoderId,
        type: OpusRequest.SetVbrConstraint,
        value: x
    };
}
export interface IOpusGetVbrconstraint {
    type: OpusRequest.GetVbrConstraint;
    encoderId: string;
}
export function OPUS_GET_VBR_CONSTRAINT(encoderId: string,): IOpusGetVbrconstraint {
    return {
        encoderId,
        type: OpusRequest.GetVbrConstraint,
    };
}
export interface IOpusSetForcechannels {
    type: OpusRequest.SetForceChannels;
    encoderId: string;
    value: number;
}
export function OPUS_SET_FORCE_CHANNELS(encoderId: string,x: number): IOpusSetForcechannels {
    return {
        encoderId,
        type: OpusRequest.SetForceChannels,
        value: x
    };
}
export interface IOpusGetForcechannels {
    type: OpusRequest.GetForceChannels;
    encoderId: string;
}
export function OPUS_GET_FORCE_CHANNELS(encoderId: string,): IOpusGetForcechannels {
    return {
        encoderId,
        type: OpusRequest.GetForceChannels,
    };
}
export interface IOpusSetMaxbandwidth {
    type: OpusRequest.SetMaxBandwidth;
    encoderId: string;
    value: number;
}
export function OPUS_SET_MAX_BANDWIDTH(encoderId: string,x: number): IOpusSetMaxbandwidth {
    return {
        encoderId,
        type: OpusRequest.SetMaxBandwidth,
        value: x
    };
}
export interface IOpusGetMaxbandwidth {
    type: OpusRequest.GetMaxBandwidth;
    encoderId: string;
}
export function OPUS_GET_MAX_BANDWIDTH(encoderId: string,): IOpusGetMaxbandwidth {
    return {
        encoderId,
        type: OpusRequest.GetMaxBandwidth,
    };
}
export interface IOpusSetBandwidth {
    type: OpusRequest.SetBandwidth;
    encoderId: string;
    value: number;
}
export function OPUS_SET_BANDWIDTH(encoderId: string,x: number): IOpusSetBandwidth {
    return {
        encoderId,
        type: OpusRequest.SetBandwidth,
        value: x
    };
}
export interface IOpusSetSignal {
    type: OpusRequest.SetSignal;
    encoderId: string;
    value: number;
}
export function OPUS_SET_SIGNAL(encoderId: string,x: number): IOpusSetSignal {
    return {
        encoderId,
        type: OpusRequest.SetSignal,
        value: x
    };
}
export interface IOpusGetSignal {
    type: OpusRequest.GetSignal;
    encoderId: string;
}
export function OPUS_GET_SIGNAL(encoderId: string,): IOpusGetSignal {
    return {
        encoderId,
        type: OpusRequest.GetSignal,
    };
}
export interface IOpusSetApplication {
    type: OpusRequest.SetApplication;
    encoderId: string;
    value: number;
}
export function OPUS_SET_APPLICATION(encoderId: string,x: number): IOpusSetApplication {
    return {
        encoderId,
        type: OpusRequest.SetApplication,
        value: x
    };
}
export interface IOpusGetApplication {
    type: OpusRequest.GetApplication;
    encoderId: string;
}
export function OPUS_GET_APPLICATION(encoderId: string,): IOpusGetApplication {
    return {
        encoderId,
        type: OpusRequest.GetApplication,
    };
}
export interface IOpusGetLookahead {
    type: OpusRequest.GetLookahead;
    encoderId: string;
}
export function OPUS_GET_LOOKAHEAD(encoderId: string,): IOpusGetLookahead {
    return {
        encoderId,
        type: OpusRequest.GetLookahead,
    };
}
export interface IOpusSetInbandfec {
    type: OpusRequest.SetInbandFec;
    encoderId: string;
    value: number;
}
export function OPUS_SET_INBAND_FEC(encoderId: string,x: number): IOpusSetInbandfec {
    return {
        encoderId,
        type: OpusRequest.SetInbandFec,
        value: x
    };
}
export interface IOpusGetInbandfec {
    type: OpusRequest.GetInbandFec;
    encoderId: string;
}
export function OPUS_GET_INBAND_FEC(encoderId: string,): IOpusGetInbandfec {
    return {
        encoderId,
        type: OpusRequest.GetInbandFec,
    };
}
export interface IOpusSetPacketlossPerc {
    type: OpusRequest.SetPacketLossperc;
    encoderId: string;
    value: number;
}
export function OPUS_SET_PACKET_LOSS_PERC(encoderId: string,x: number): IOpusSetPacketlossPerc {
    return {
        encoderId,
        type: OpusRequest.SetPacketLossperc,
        value: x
    };
}
export interface IOpusGetPacketlossPerc {
    type: OpusRequest.GetPacketLossperc;
    encoderId: string;
}
export function OPUS_GET_PACKET_LOSS_PERC(encoderId: string,): IOpusGetPacketlossPerc {
    return {
        encoderId,
        type: OpusRequest.GetPacketLossperc,
    };
}
export interface IOpusSetDtx {
    type: OpusRequest.SetDtx;
    encoderId: string;
    value: number;
}
export function OPUS_SET_DTX(encoderId: string,x: number): IOpusSetDtx {
    return {
        encoderId,
        type: OpusRequest.SetDtx,
        value: x
    };
}
export interface IOpusGetDtx {
    type: OpusRequest.GetDtx;
    encoderId: string;
}
export function OPUS_GET_DTX(encoderId: string,): IOpusGetDtx {
    return {
        encoderId,
        type: OpusRequest.GetDtx,
    };
}
export interface IOpusSetLsbdepth {
    type: OpusRequest.SetLsbDepth;
    encoderId: string;
    value: number;
}
export function OPUS_SET_LSB_DEPTH(encoderId: string,x: number): IOpusSetLsbdepth {
    return {
        encoderId,
        type: OpusRequest.SetLsbDepth,
        value: x
    };
}
export interface IOpusGetLsbdepth {
    type: OpusRequest.GetLsbDepth;
    encoderId: string;
}
export function OPUS_GET_LSB_DEPTH(encoderId: string,): IOpusGetLsbdepth {
    return {
        encoderId,
        type: OpusRequest.GetLsbDepth,
    };
}
export interface IOpusSetExpertframeDuration {
    type: OpusRequest.SetExpertFrameduration;
    encoderId: string;
    value: number;
}
export function OPUS_SET_EXPERT_FRAME_DURATION(encoderId: string,x: number): IOpusSetExpertframeDuration {
    return {
        encoderId,
        type: OpusRequest.SetExpertFrameduration,
        value: x
    };
}
export interface IOpusGetExpertframeDuration {
    type: OpusRequest.GetExpertFrameduration;
    encoderId: string;
}
export function OPUS_GET_EXPERT_FRAME_DURATION(encoderId: string,): IOpusGetExpertframeDuration {
    return {
        encoderId,
        type: OpusRequest.GetExpertFrameduration,
    };
}
export interface IOpusSetPredictiondisabled {
    type: OpusRequest.SetPredictionDisabled;
    encoderId: string;
    value: number;
}
export function OPUS_SET_PREDICTION_DISABLED(encoderId: string,x: number): IOpusSetPredictiondisabled {
    return {
        encoderId,
        type: OpusRequest.SetPredictionDisabled,
        value: x
    };
}
export interface IOpusGetPredictiondisabled {
    type: OpusRequest.GetPredictionDisabled;
    encoderId: string;
}
export function OPUS_GET_PREDICTION_DISABLED(encoderId: string,): IOpusGetPredictiondisabled {
    return {
        encoderId,
        type: OpusRequest.GetPredictionDisabled,
    };
}
export interface IOpusGetBandwidth {
    type: OpusRequest.GetBandwidth;
    encoderId: string;
}
export function OPUS_GET_BANDWIDTH(encoderId: string,): IOpusGetBandwidth {
    return {
        encoderId,
        type: OpusRequest.GetBandwidth,
    };
}
export interface IOpusGetSamplerate {
    type: OpusRequest.GetSampleRate;
    encoderId: string;
}
export function OPUS_GET_SAMPLE_RATE(encoderId: string,): IOpusGetSamplerate {
    return {
        encoderId,
        type: OpusRequest.GetSampleRate,
    };
}
export interface IOpusSetPhaseinversionDisabled {
    type: OpusRequest.SetPhaseInversiondisabled;
    encoderId: string;
    value: number;
}
export function OPUS_SET_PHASE_INVERSION_DISABLED(encoderId: string,x: number): IOpusSetPhaseinversionDisabled {
    return {
        encoderId,
        type: OpusRequest.SetPhaseInversiondisabled,
        value: x
    };
}
export interface IOpusGetPhaseinversionDisabled {
    type: OpusRequest.GetPhaseInversiondisabled;
    encoderId: string;
}
export function OPUS_GET_PHASE_INVERSION_DISABLED(encoderId: string,): IOpusGetPhaseinversionDisabled {
    return {
        encoderId,
        type: OpusRequest.GetPhaseInversiondisabled,
    };
}
export interface IOpusGetIndtx {
    type: OpusRequest.GetInDtx;
    encoderId: string;
}
export function OPUS_GET_IN_DTX(encoderId: string,): IOpusGetIndtx {
    return {
        encoderId,
        type: OpusRequest.GetInDtx,
    };
}
export interface IOpusSetGain {
    type: OpusRequest.SetGain;
    encoderId: string;
    value: number;
}
export function OPUS_SET_GAIN(encoderId: string,x: number): IOpusSetGain {
    return {
        encoderId,
        type: OpusRequest.SetGain,
        value: x
    };
}
export interface IOpusGetGain {
    type: OpusRequest.GetGain;
    encoderId: string;
}
export function OPUS_GET_GAIN(encoderId: string,): IOpusGetGain {
    return {
        encoderId,
        type: OpusRequest.GetGain,
    };
}
export interface IOpusGetLastpacketDuration {
    type: OpusRequest.GetLastPacketduration;
    encoderId: string;
}
export function OPUS_GET_LAST_PACKET_DURATION(encoderId: string,): IOpusGetLastpacketDuration {
    return {
        encoderId,
        type: OpusRequest.GetLastPacketduration,
    };
}
export interface IOpusGetPitch {
    type: OpusRequest.GetPitch;
    encoderId: string;
}
export function OPUS_GET_PITCH(encoderId: string,): IOpusGetPitch {
    return {
        encoderId,
        type: OpusRequest.GetPitch,
    };
}
export type OpusGetRequest = IOpusGetComplexity | IOpusGetBitrate | IOpusGetVbr | IOpusGetVbrconstraint | IOpusGetForcechannels | IOpusGetMaxbandwidth | IOpusGetSignal | IOpusGetApplication | IOpusGetLookahead | IOpusGetInbandfec | IOpusGetPacketlossPerc | IOpusGetDtx | IOpusGetLsbdepth | IOpusGetExpertframeDuration | IOpusGetPredictiondisabled | IOpusGetBandwidth | IOpusGetSamplerate | IOpusGetPhaseinversionDisabled | IOpusGetIndtx | IOpusGetGain | IOpusGetLastpacketDuration | IOpusGetPitch;
export type OpusSetRequest = IOpusSetComplexity | IOpusSetBitrate | IOpusSetVbr | IOpusSetVbrconstraint | IOpusSetForcechannels | IOpusSetMaxbandwidth | IOpusSetBandwidth | IOpusSetSignal | IOpusSetApplication | IOpusSetInbandfec | IOpusSetPacketlossPerc | IOpusSetDtx | IOpusSetLsbdepth | IOpusSetExpertframeDuration | IOpusSetPredictiondisabled | IOpusSetPhaseinversionDisabled | IOpusSetGain;
