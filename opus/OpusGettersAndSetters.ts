import {Runtime/*,Pointer*/,Integer} from '../runtime';
import constants from './constants';
export class OpusGettersAndSetters {
    readonly #opusEncoderOffset;
    readonly #runtime;
    readonly #value;
    public constructor(runtime: Runtime, opusEncoderOffset: number) {
        this.#runtime = runtime;
        this.#value = new Integer(runtime);
        this.#opusEncoderOffset = opusEncoderOffset;
    }
    public setComplexity(x: number): boolean {
        const result = this.#runtime.originalRuntime()._opus_set_complexity(this.#opusEncoderOffset,x);
        return result === constants.OPUS_OK;
    }
    public getComplexity(): number {
        const result = this.#runtime.originalRuntime()._opus_get_complexity(this.#opusEncoderOffset,this.#value.offset());
        if(result != constants.OPUS_OK) throw new Error('Failed to set OPUS_GET_COMPLEXITY');
        return this.#value.value();
    }
    public setBitrate(x: number): boolean {
        const result = this.#runtime.originalRuntime()._opus_set_bitrate(this.#opusEncoderOffset,x);
        return result === constants.OPUS_OK;
    }
    public getBitrate(): number {
        const result = this.#runtime.originalRuntime()._opus_get_bitrate(this.#opusEncoderOffset,this.#value.offset());
        if(result != constants.OPUS_OK) throw new Error('Failed to set OPUS_GET_BITRATE');
        return this.#value.value();
    }
    public setVbr(x: number): boolean {
        const result = this.#runtime.originalRuntime()._opus_set_vbr(this.#opusEncoderOffset,x);
        return result === constants.OPUS_OK;
    }
    public getVbr(): number {
        const result = this.#runtime.originalRuntime()._opus_get_vbr(this.#opusEncoderOffset,this.#value.offset());
        if(result != constants.OPUS_OK) throw new Error('Failed to set OPUS_GET_VBR');
        return this.#value.value();
    }
    public setVbrConstraint(x: number): boolean {
        const result = this.#runtime.originalRuntime()._opus_set_vbr_constraint(this.#opusEncoderOffset,x);
        return result === constants.OPUS_OK;
    }
    public getVbrConstraint(): number {
        const result = this.#runtime.originalRuntime()._opus_get_vbr_constraint(this.#opusEncoderOffset,this.#value.offset());
        if(result != constants.OPUS_OK) throw new Error('Failed to set OPUS_GET_VBR_CONSTRAINT');
        return this.#value.value();
    }
    public setForceChannels(x: number): boolean {
        const result = this.#runtime.originalRuntime()._opus_set_force_channels(this.#opusEncoderOffset,x);
        return result === constants.OPUS_OK;
    }
    public getForceChannels(): number {
        const result = this.#runtime.originalRuntime()._opus_get_force_channels(this.#opusEncoderOffset,this.#value.offset());
        if(result != constants.OPUS_OK) throw new Error('Failed to set OPUS_GET_FORCE_CHANNELS');
        return this.#value.value();
    }
    public setMaxBandwidth(x: number): boolean {
        const result = this.#runtime.originalRuntime()._opus_set_max_bandwidth(this.#opusEncoderOffset,x);
        return result === constants.OPUS_OK;
    }
    public getMaxBandwidth(): number {
        const result = this.#runtime.originalRuntime()._opus_get_max_bandwidth(this.#opusEncoderOffset,this.#value.offset());
        if(result != constants.OPUS_OK) throw new Error('Failed to set OPUS_GET_MAX_BANDWIDTH');
        return this.#value.value();
    }
    public setBandwidth(x: number): boolean {
        const result = this.#runtime.originalRuntime()._opus_set_bandwidth(this.#opusEncoderOffset,x);
        return result === constants.OPUS_OK;
    }
    public setSignal(x: number): boolean {
        const result = this.#runtime.originalRuntime()._opus_set_signal(this.#opusEncoderOffset,x);
        return result === constants.OPUS_OK;
    }
    public getSignal(): number {
        const result = this.#runtime.originalRuntime()._opus_get_signal(this.#opusEncoderOffset,this.#value.offset());
        if(result != constants.OPUS_OK) throw new Error('Failed to set OPUS_GET_SIGNAL');
        return this.#value.value();
    }
    public setApplication(x: number): boolean {
        const result = this.#runtime.originalRuntime()._opus_set_application(this.#opusEncoderOffset,x);
        return result === constants.OPUS_OK;
    }
    public getApplication(): number {
        const result = this.#runtime.originalRuntime()._opus_get_application(this.#opusEncoderOffset,this.#value.offset());
        if(result != constants.OPUS_OK) throw new Error('Failed to set OPUS_GET_APPLICATION');
        return this.#value.value();
    }
    public getLookahead(): number {
        const result = this.#runtime.originalRuntime()._opus_get_lookahead(this.#opusEncoderOffset,this.#value.offset());
        if(result != constants.OPUS_OK) throw new Error('Failed to set OPUS_GET_LOOKAHEAD');
        return this.#value.value();
    }
    public setInbandFec(x: number): boolean {
        const result = this.#runtime.originalRuntime()._opus_set_inband_fec(this.#opusEncoderOffset,x);
        return result === constants.OPUS_OK;
    }
    public getInbandFec(): number {
        const result = this.#runtime.originalRuntime()._opus_get_inband_fec(this.#opusEncoderOffset,this.#value.offset());
        if(result != constants.OPUS_OK) throw new Error('Failed to set OPUS_GET_INBAND_FEC');
        return this.#value.value();
    }
    public setPacketLossperc(x: number): boolean {
        const result = this.#runtime.originalRuntime()._opus_set_packet_loss_perc(this.#opusEncoderOffset,x);
        return result === constants.OPUS_OK;
    }
    public getPacketLossperc(): number {
        const result = this.#runtime.originalRuntime()._opus_get_packet_loss_perc(this.#opusEncoderOffset,this.#value.offset());
        if(result != constants.OPUS_OK) throw new Error('Failed to set OPUS_GET_PACKET_LOSS_PERC');
        return this.#value.value();
    }
    public setDtx(x: number): boolean {
        const result = this.#runtime.originalRuntime()._opus_set_dtx(this.#opusEncoderOffset,x);
        return result === constants.OPUS_OK;
    }
    public getDtx(): number {
        const result = this.#runtime.originalRuntime()._opus_get_dtx(this.#opusEncoderOffset,this.#value.offset());
        if(result != constants.OPUS_OK) throw new Error('Failed to set OPUS_GET_DTX');
        return this.#value.value();
    }
    public setLsbDepth(x: number): boolean {
        const result = this.#runtime.originalRuntime()._opus_set_lsb_depth(this.#opusEncoderOffset,x);
        return result === constants.OPUS_OK;
    }
    public getLsbDepth(): number {
        const result = this.#runtime.originalRuntime()._opus_get_lsb_depth(this.#opusEncoderOffset,this.#value.offset());
        if(result != constants.OPUS_OK) throw new Error('Failed to set OPUS_GET_LSB_DEPTH');
        return this.#value.value();
    }
    public setExpertFrameduration(x: number): boolean {
        const result = this.#runtime.originalRuntime()._opus_set_expert_frame_duration(this.#opusEncoderOffset,x);
        return result === constants.OPUS_OK;
    }
    public getExpertFrameduration(): number {
        const result = this.#runtime.originalRuntime()._opus_get_expert_frame_duration(this.#opusEncoderOffset,this.#value.offset());
        if(result != constants.OPUS_OK) throw new Error('Failed to set OPUS_GET_EXPERT_FRAME_DURATION');
        return this.#value.value();
    }
    public setPredictionDisabled(x: number): boolean {
        const result = this.#runtime.originalRuntime()._opus_set_prediction_disabled(this.#opusEncoderOffset,x);
        return result === constants.OPUS_OK;
    }
    public getPredictionDisabled(): number {
        const result = this.#runtime.originalRuntime()._opus_get_prediction_disabled(this.#opusEncoderOffset,this.#value.offset());
        if(result != constants.OPUS_OK) throw new Error('Failed to set OPUS_GET_PREDICTION_DISABLED');
        return this.#value.value();
    }
    public getBandwidth(): number {
        const result = this.#runtime.originalRuntime()._opus_get_bandwidth(this.#opusEncoderOffset,this.#value.offset());
        if(result != constants.OPUS_OK) throw new Error('Failed to set OPUS_GET_BANDWIDTH');
        return this.#value.value();
    }
    public getSampleRate(): number {
        const result = this.#runtime.originalRuntime()._opus_get_sample_rate(this.#opusEncoderOffset,this.#value.offset());
        if(result != constants.OPUS_OK) throw new Error('Failed to set OPUS_GET_SAMPLE_RATE');
        return this.#value.value();
    }
    public setPhaseInversiondisabled(x: number): boolean {
        const result = this.#runtime.originalRuntime()._opus_set_phase_inversion_disabled(this.#opusEncoderOffset,x);
        return result === constants.OPUS_OK;
    }
    public getPhaseInversiondisabled(): number {
        const result = this.#runtime.originalRuntime()._opus_get_phase_inversion_disabled(this.#opusEncoderOffset,this.#value.offset());
        if(result != constants.OPUS_OK) throw new Error('Failed to set OPUS_GET_PHASE_INVERSION_DISABLED');
        return this.#value.value();
    }
    public getInDtx(): number {
        const result = this.#runtime.originalRuntime()._opus_get_in_dtx(this.#opusEncoderOffset,this.#value.offset());
        if(result != constants.OPUS_OK) throw new Error('Failed to set OPUS_GET_IN_DTX');
        return this.#value.value();
    }
    public setGain(x: number): boolean {
        const result = this.#runtime.originalRuntime()._opus_set_gain(this.#opusEncoderOffset,x);
        return result === constants.OPUS_OK;
    }
    public getGain(): number {
        const result = this.#runtime.originalRuntime()._opus_get_gain(this.#opusEncoderOffset,this.#value.offset());
        if(result != constants.OPUS_OK) throw new Error('Failed to set OPUS_GET_GAIN');
        return this.#value.value();
    }
    public getLastPacketduration(): number {
        const result = this.#runtime.originalRuntime()._opus_get_last_packet_duration(this.#opusEncoderOffset,this.#value.offset());
        if(result != constants.OPUS_OK) throw new Error('Failed to set OPUS_GET_LAST_PACKET_DURATION');
        return this.#value.value();
    }
    public getPitch(): number {
        const result = this.#runtime.originalRuntime()._opus_get_pitch(this.#opusEncoderOffset,this.#value.offset());
        if(result != constants.OPUS_OK) throw new Error('Failed to set OPUS_GET_PITCH');
        return this.#value.value();
    }
}
