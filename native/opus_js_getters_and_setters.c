#include <opus.h>
int opus_set_complexity(OpusEncoder* enc,opus_int32 x) {
    return opus_encoder_ctl(enc,OPUS_SET_COMPLEXITY(x));
}
int opus_get_complexity(OpusEncoder* enc,opus_int32* x) {
    return opus_encoder_ctl(enc,OPUS_GET_COMPLEXITY(x));
}
int opus_set_bitrate(OpusEncoder* enc,opus_int32 x) {
    return opus_encoder_ctl(enc,OPUS_SET_BITRATE(x));
}
int opus_get_bitrate(OpusEncoder* enc,opus_int32* x) {
    return opus_encoder_ctl(enc,OPUS_GET_BITRATE(x));
}
int opus_set_vbr(OpusEncoder* enc,opus_int32 x) {
    return opus_encoder_ctl(enc,OPUS_SET_VBR(x));
}
int opus_get_vbr(OpusEncoder* enc,opus_int32* x) {
    return opus_encoder_ctl(enc,OPUS_GET_VBR(x));
}
int opus_set_vbr_constraint(OpusEncoder* enc,opus_int32 x) {
    return opus_encoder_ctl(enc,OPUS_SET_VBR_CONSTRAINT(x));
}
int opus_get_vbr_constraint(OpusEncoder* enc,opus_int32* x) {
    return opus_encoder_ctl(enc,OPUS_GET_VBR_CONSTRAINT(x));
}
int opus_set_force_channels(OpusEncoder* enc,opus_int32 x) {
    return opus_encoder_ctl(enc,OPUS_SET_FORCE_CHANNELS(x));
}
int opus_get_force_channels(OpusEncoder* enc,opus_int32* x) {
    return opus_encoder_ctl(enc,OPUS_GET_FORCE_CHANNELS(x));
}
int opus_set_max_bandwidth(OpusEncoder* enc,opus_int32 x) {
    return opus_encoder_ctl(enc,OPUS_SET_MAX_BANDWIDTH(x));
}
int opus_get_max_bandwidth(OpusEncoder* enc,opus_int32* x) {
    return opus_encoder_ctl(enc,OPUS_GET_MAX_BANDWIDTH(x));
}
int opus_set_bandwidth(OpusEncoder* enc,opus_int32 x) {
    return opus_encoder_ctl(enc,OPUS_SET_BANDWIDTH(x));
}
int opus_set_signal(OpusEncoder* enc,opus_int32 x) {
    return opus_encoder_ctl(enc,OPUS_SET_SIGNAL(x));
}
int opus_get_signal(OpusEncoder* enc,opus_int32* x) {
    return opus_encoder_ctl(enc,OPUS_GET_SIGNAL(x));
}
int opus_set_application(OpusEncoder* enc,opus_int32 x) {
    return opus_encoder_ctl(enc,OPUS_SET_APPLICATION(x));
}
int opus_get_application(OpusEncoder* enc,opus_int32* x) {
    return opus_encoder_ctl(enc,OPUS_GET_APPLICATION(x));
}
int opus_get_lookahead(OpusEncoder* enc,opus_int32* x) {
    return opus_encoder_ctl(enc,OPUS_GET_LOOKAHEAD(x));
}
int opus_set_inband_fec(OpusEncoder* enc,opus_int32 x) {
    return opus_encoder_ctl(enc,OPUS_SET_INBAND_FEC(x));
}
int opus_get_inband_fec(OpusEncoder* enc,opus_int32* x) {
    return opus_encoder_ctl(enc,OPUS_GET_INBAND_FEC(x));
}
int opus_set_packet_loss_perc(OpusEncoder* enc,opus_int32 x) {
    return opus_encoder_ctl(enc,OPUS_SET_PACKET_LOSS_PERC(x));
}
int opus_get_packet_loss_perc(OpusEncoder* enc,opus_int32* x) {
    return opus_encoder_ctl(enc,OPUS_GET_PACKET_LOSS_PERC(x));
}
int opus_set_dtx(OpusEncoder* enc,opus_int32 x) {
    return opus_encoder_ctl(enc,OPUS_SET_DTX(x));
}
int opus_get_dtx(OpusEncoder* enc,opus_int32* x) {
    return opus_encoder_ctl(enc,OPUS_GET_DTX(x));
}
int opus_set_lsb_depth(OpusEncoder* enc,opus_int32 x) {
    return opus_encoder_ctl(enc,OPUS_SET_LSB_DEPTH(x));
}
int opus_get_lsb_depth(OpusEncoder* enc,opus_int32* x) {
    return opus_encoder_ctl(enc,OPUS_GET_LSB_DEPTH(x));
}
int opus_set_expert_frame_duration(OpusEncoder* enc,opus_int32 x) {
    return opus_encoder_ctl(enc,OPUS_SET_EXPERT_FRAME_DURATION(x));
}
int opus_get_expert_frame_duration(OpusEncoder* enc,opus_int32* x) {
    return opus_encoder_ctl(enc,OPUS_GET_EXPERT_FRAME_DURATION(x));
}
int opus_set_prediction_disabled(OpusEncoder* enc,opus_int32 x) {
    return opus_encoder_ctl(enc,OPUS_SET_PREDICTION_DISABLED(x));
}
int opus_get_prediction_disabled(OpusEncoder* enc,opus_int32* x) {
    return opus_encoder_ctl(enc,OPUS_GET_PREDICTION_DISABLED(x));
}
int opus_get_bandwidth(OpusEncoder* enc,opus_int32* x) {
    return opus_encoder_ctl(enc,OPUS_GET_BANDWIDTH(x));
}
int opus_get_sample_rate(OpusEncoder* enc,opus_int32* x) {
    return opus_encoder_ctl(enc,OPUS_GET_SAMPLE_RATE(x));
}
int opus_set_phase_inversion_disabled(OpusEncoder* enc,opus_int32 x) {
    return opus_encoder_ctl(enc,OPUS_SET_PHASE_INVERSION_DISABLED(x));
}
int opus_get_phase_inversion_disabled(OpusEncoder* enc,opus_int32* x) {
    return opus_encoder_ctl(enc,OPUS_GET_PHASE_INVERSION_DISABLED(x));
}
int opus_get_in_dtx(OpusEncoder* enc,opus_int32* x) {
    return opus_encoder_ctl(enc,OPUS_GET_IN_DTX(x));
}
int opus_set_gain(OpusEncoder* enc,opus_int32 x) {
    return opus_encoder_ctl(enc,OPUS_SET_GAIN(x));
}
int opus_get_gain(OpusEncoder* enc,opus_int32* x) {
    return opus_encoder_ctl(enc,OPUS_GET_GAIN(x));
}
int opus_get_last_packet_duration(OpusEncoder* enc,opus_int32* x) {
    return opus_encoder_ctl(enc,OPUS_GET_LAST_PACKET_DURATION(x));
}
int opus_get_pitch(OpusEncoder* enc,opus_int32* x) {
    return opus_encoder_ctl(enc,OPUS_GET_PITCH(x));
}
