import {OpusGetRequest,OpusRequest,OpusSetRequest} from '../actions/opus';
import {Encoder} from 'opus-codec/opus';
export function setToEncoder(encoder: Encoder, request: OpusSetRequest){
    let result: boolean;
    switch(request.type) {
        case OpusRequest.SetComplexity:
            result = encoder.setComplexity(request.value);
            break;
        case OpusRequest.SetBitrate:
            result = encoder.setBitrate(request.value);
            break;
        case OpusRequest.SetVbr:
            result = encoder.setVbr(request.value);
            break;
        case OpusRequest.SetVbrConstraint:
            result = encoder.setVbrConstraint(request.value);
            break;
        case OpusRequest.SetForceChannels:
            result = encoder.setForceChannels(request.value);
            break;
        case OpusRequest.SetMaxBandwidth:
            result = encoder.setMaxBandwidth(request.value);
            break;
        case OpusRequest.SetBandwidth:
            result = encoder.setBandwidth(request.value);
            break;
        case OpusRequest.SetSignal:
            result = encoder.setSignal(request.value);
            break;
        case OpusRequest.SetApplication:
            result = encoder.setApplication(request.value);
            break;
        case OpusRequest.SetInbandFec:
            result = encoder.setInbandFec(request.value);
            break;
        case OpusRequest.SetPacketLossperc:
            result = encoder.setPacketLossperc(request.value);
            break;
        case OpusRequest.SetDtx:
            result = encoder.setDtx(request.value);
            break;
        case OpusRequest.SetLsbDepth:
            result = encoder.setLsbDepth(request.value);
            break;
        case OpusRequest.SetExpertFrameduration:
            result = encoder.setExpertFrameduration(request.value);
            break;
        case OpusRequest.SetPredictionDisabled:
            result = encoder.setPredictionDisabled(request.value);
            break;
        case OpusRequest.SetPhaseInversiondisabled:
            result = encoder.setPhaseInversiondisabled(request.value);
            break;
        case OpusRequest.SetGain:
            result = encoder.setGain(request.value);
            break;
    }
    return result;
}
export function getFromEncoder(encoder: Encoder, request: OpusGetRequest){
    let result: number;
    switch(request.type) {
        case OpusRequest.GetComplexity:
            result = encoder.getComplexity();
            break;
        case OpusRequest.GetBitrate:
            result = encoder.getBitrate();
            break;
        case OpusRequest.GetVbr:
            result = encoder.getVbr();
            break;
        case OpusRequest.GetVbrConstraint:
            result = encoder.getVbrConstraint();
            break;
        case OpusRequest.GetForceChannels:
            result = encoder.getForceChannels();
            break;
        case OpusRequest.GetMaxBandwidth:
            result = encoder.getMaxBandwidth();
            break;
        case OpusRequest.GetSignal:
            result = encoder.getSignal();
            break;
        case OpusRequest.GetApplication:
            result = encoder.getApplication();
            break;
        case OpusRequest.GetLookahead:
            result = encoder.getLookahead();
            break;
        case OpusRequest.GetInbandFec:
            result = encoder.getInbandFec();
            break;
        case OpusRequest.GetPacketLossperc:
            result = encoder.getPacketLossperc();
            break;
        case OpusRequest.GetDtx:
            result = encoder.getDtx();
            break;
        case OpusRequest.GetLsbDepth:
            result = encoder.getLsbDepth();
            break;
        case OpusRequest.GetExpertFrameduration:
            result = encoder.getExpertFrameduration();
            break;
        case OpusRequest.GetPredictionDisabled:
            result = encoder.getPredictionDisabled();
            break;
        case OpusRequest.GetBandwidth:
            result = encoder.getBandwidth();
            break;
        case OpusRequest.GetSampleRate:
            result = encoder.getSampleRate();
            break;
        case OpusRequest.GetPhaseInversiondisabled:
            result = encoder.getPhaseInversiondisabled();
            break;
        case OpusRequest.GetInDtx:
            result = encoder.getInDtx();
            break;
        case OpusRequest.GetGain:
            result = encoder.getGain();
            break;
        case OpusRequest.GetLastPacketduration:
            result = encoder.getLastPacketduration();
            break;
        case OpusRequest.GetPitch:
            result = encoder.getPitch();
            break;
    }
    return result;
}
