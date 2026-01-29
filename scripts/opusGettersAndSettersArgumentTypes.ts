export const opusGettersAndSettersArgumentTypes = new Map<
    string,
    {
        arguments: {
            name: string;
            type: 'int' | 'int_ptr';
        }[];
    }
>([
    ['OPUS_SET_COMPLEXITY', { arguments: [{ name: 'x', type: 'int' }] }],
    ['OPUS_GET_COMPLEXITY', { arguments: [{ name: 'x', type: 'int_ptr' }] }],
    ['OPUS_SET_BITRATE', { arguments: [{ name: 'x', type: 'int' }] }],
    ['OPUS_GET_BITRATE', { arguments: [{ name: 'x', type: 'int_ptr' }] }],
    ['OPUS_SET_VBR', { arguments: [{ name: 'x', type: 'int' }] }],
    ['OPUS_GET_VBR', { arguments: [{ name: 'x', type: 'int_ptr' }] }],
    ['OPUS_SET_VBR_CONSTRAINT', { arguments: [{ name: 'x', type: 'int' }] }],
    [
        'OPUS_GET_VBR_CONSTRAINT',
        { arguments: [{ name: 'x', type: 'int_ptr' }] }
    ],
    ['OPUS_SET_FORCE_CHANNELS', { arguments: [{ name: 'x', type: 'int' }] }],
    [
        'OPUS_GET_FORCE_CHANNELS',
        { arguments: [{ name: 'x', type: 'int_ptr' }] }
    ],
    ['OPUS_SET_MAX_BANDWIDTH', { arguments: [{ name: 'x', type: 'int' }] }],
    ['OPUS_GET_MAX_BANDWIDTH', { arguments: [{ name: 'x', type: 'int_ptr' }] }],
    ['OPUS_SET_BANDWIDTH', { arguments: [{ name: 'x', type: 'int' }] }],
    ['OPUS_SET_SIGNAL', { arguments: [{ name: 'x', type: 'int' }] }],
    ['OPUS_GET_SIGNAL', { arguments: [{ name: 'x', type: 'int_ptr' }] }],
    ['OPUS_SET_APPLICATION', { arguments: [{ name: 'x', type: 'int' }] }],
    ['OPUS_GET_APPLICATION', { arguments: [{ name: 'x', type: 'int_ptr' }] }],
    ['OPUS_GET_LOOKAHEAD', { arguments: [{ name: 'x', type: 'int_ptr' }] }],
    ['OPUS_SET_INBAND_FEC', { arguments: [{ name: 'x', type: 'int' }] }],
    ['OPUS_GET_INBAND_FEC', { arguments: [{ name: 'x', type: 'int_ptr' }] }],
    ['OPUS_SET_PACKET_LOSS_PERC', { arguments: [{ name: 'x', type: 'int' }] }],
    [
        'OPUS_GET_PACKET_LOSS_PERC',
        { arguments: [{ name: 'x', type: 'int_ptr' }] }
    ],
    ['OPUS_SET_DTX', { arguments: [{ name: 'x', type: 'int' }] }],
    ['OPUS_GET_DTX', { arguments: [{ name: 'x', type: 'int_ptr' }] }],
    ['OPUS_SET_LSB_DEPTH', { arguments: [{ name: 'x', type: 'int' }] }],
    ['OPUS_GET_LSB_DEPTH', { arguments: [{ name: 'x', type: 'int_ptr' }] }],
    [
        'OPUS_SET_EXPERT_FRAME_DURATION',
        { arguments: [{ name: 'x', type: 'int' }] }
    ],
    [
        'OPUS_GET_EXPERT_FRAME_DURATION',
        { arguments: [{ name: 'x', type: 'int_ptr' }] }
    ],
    [
        'OPUS_SET_PREDICTION_DISABLED',
        { arguments: [{ name: 'x', type: 'int' }] }
    ],
    [
        'OPUS_GET_PREDICTION_DISABLED',
        { arguments: [{ name: 'x', type: 'int_ptr' }] }
    ],
    ['OPUS_GET_BANDWIDTH', { arguments: [{ name: 'x', type: 'int_ptr' }] }],
    ['OPUS_GET_SAMPLE_RATE', { arguments: [{ name: 'x', type: 'int_ptr' }] }],
    [
        'OPUS_SET_PHASE_INVERSION_DISABLED',
        { arguments: [{ name: 'x', type: 'int' }] }
    ],
    [
        'OPUS_GET_PHASE_INVERSION_DISABLED',
        { arguments: [{ name: 'x', type: 'int_ptr' }] }
    ],
    ['OPUS_GET_IN_DTX', { arguments: [{ name: 'x', type: 'int_ptr' }] }],
    ['OPUS_SET_GAIN', { arguments: [{ name: 'x', type: 'int' }] }],
    ['OPUS_GET_GAIN', { arguments: [{ name: 'x', type: 'int_ptr' }] }],
    [
        'OPUS_GET_LAST_PACKET_DURATION',
        { arguments: [{ name: 'x', type: 'int_ptr' }] }
    ],
    ['OPUS_GET_PITCH', { arguments: [{ name: 'x', type: 'int_ptr' }] }]
]);
