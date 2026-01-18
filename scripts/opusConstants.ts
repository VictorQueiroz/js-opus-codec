export const otherOpusConstants = new Map<string, number>([
    /** One or more invalid/out of range arguments @hideinitializer*/
    ['OPUS_OK', 0],
    /** Not enough bytes allocated in the buffer @hideinitializer*/
    ['OPUS_BAD_ARG', -1],
    /** An internal error was detected @hideinitializer*/
    ['OPUS_BUFFER_TOO_SMALL', -2],
    /** The compressed data passed is corrupted @hideinitializer*/
    ['OPUS_INTERNAL_ERROR', -3],
    /** Invalid/unsupported request number @hideinitializer*/
    ['OPUS_INVALID_PACKET', -4],
    /** An encoder or decoder structure is invalid or already freed @hideinitializer*/
    ['OPUS_UNIMPLEMENTED', -5],
    /** Memory allocation has failed @hideinitializer*/
    ['OPUS_INVALID_STATE', -6],

    ['OPUS_ALLOC_FAIL', -7],
    /* Values for the various encoder CTLs */
    ['OPUS_AUTO', -1000] /**<Auto/default setting @hideinitializer*/,
    ['OPUS_BITRATE_MAX', -1] /**<Maximum bitrate @hideinitializer*/,

    /** Best for most VoIP/videoconference applications where listening quality and intelligibility matter most
     * @hideinitializer */
    ['OPUS_APPLICATION_VOIP', 2048],
    /** Best for broadcast/high-fidelity application where the decoded audio should be as close as possible to the input
     * @hideinitializer */
    ['OPUS_APPLICATION_AUDIO', 2049],
    /** Only use when lowest-achievable latency is what matters most. Voice-optimized modes cannot be used.
     * @hideinitializer */
    ['OPUS_APPLICATION_RESTRICTED_LOWDELAY', 2051],

    ['OPUS_SIGNAL_VOICE', 3001] /**< Signal being encoded is voice */,
    ['OPUS_SIGNAL_MUSIC', 3002] /**< Signal being encoded is music */,
    ['OPUS_BANDWIDTH_NARROWBAND', 1101] /**< 4 kHz bandpass @hideinitializer*/,
    ['OPUS_BANDWIDTH_MEDIUMBAND', 1102] /**< 6 kHz bandpass @hideinitializer*/,
    ['OPUS_BANDWIDTH_WIDEBAND', 1103] /**< 8 kHz bandpass @hideinitializer*/,
    [
        'OPUS_BANDWIDTH_SUPERWIDEBAND',
        1104
    ] /**<12 kHz bandpass @hideinitializer*/,
    ['OPUS_BANDWIDTH_FULLBAND', 1105] /**<20 kHz bandpass @hideinitializer*/,

    [
        'OPUS_FRAMESIZE_ARG',
        5000
    ] /**< Select frame size from the argument (default) */,
    ['OPUS_FRAMESIZE_2_5_MS', 5001] /**< Use 2.5 ms frames */,
    ['OPUS_FRAMESIZE_5_MS', 5002] /**< Use 5 ms frames */,
    ['OPUS_FRAMESIZE_10_MS', 5003] /**< Use 10 ms frames */,
    ['OPUS_FRAMESIZE_20_MS', 5004] /**< Use 20 ms frames */,
    ['OPUS_FRAMESIZE_40_MS', 5005] /**< Use 40 ms frames */,
    ['OPUS_FRAMESIZE_60_MS', 5006] /**< Use 60 ms frames */,
    ['OPUS_FRAMESIZE_80_MS', 5007] /**< Use 80 ms frames */,
    ['OPUS_FRAMESIZE_100_MS', 5008] /**< Use 100 ms frames */,
    ['OPUS_FRAMESIZE_120_MS', 5009] /**< Use 120 ms frames */
]);
