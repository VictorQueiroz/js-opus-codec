import child_process from 'node:child_process';

export function alsaPlay({
    sampleRate,
    channels
}: {
    sampleRate: number;
    channels: number;
}) {
    return child_process.spawn(
        'aplay',
        [
            '-f',
            'FLOAT_LE',
            '-r',
            sampleRate.toString(),
            '-c',
            channels.toString(),
            '-i'
        ],
        {
            stdio: ['pipe', 'inherit', 'inherit']
        }
    );
}

export function alsaRecord({
    sampleRate,
    channels,
    duration,
    bufferSize
}: {
    sampleRate: number;
    channels: number;
    duration: number;
    bufferSize: number;
}) {
    return child_process.spawn(
        'arecord',
        [
            '-r',
            sampleRate.toString(),
            '-f',
            'FLOAT_LE',
            `-c`,
            channels.toString(),
            `--duration=${duration}`,
            `--buffer-size=${bufferSize}`
        ],
        { stdio: ['ignore', 'pipe', 'inherit'] }
    );
}
