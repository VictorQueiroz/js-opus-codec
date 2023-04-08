import native from '../native';
import Runtime from '../runtime/Runtime';
import assert from 'assert';
import child_process from 'child_process';
import * as opus from '../opus';

async function createRuntime() {
    return new Runtime(await native());
}

async function testEncoderOpusBadArg() {
    const runtime = await createRuntime();

    assert.strict.throws(() => {
        new opus.Encoder(runtime, 48000, 1, 0, 10000, 1024 * 2);
    }, /Failed to create encoder/);
}

async function testEncoderOpusSuccess() {
    const runtime = await createRuntime();
    new opus.Encoder(
        runtime,
        48000,
        1,
        opus.constants.OPUS_APPLICATION_VOIP,
        10000,
        1024 * 2
    );
}

async function testEncoderOpusEncoding() {
    const runtime = await createRuntime();
    const frameSizeInSamples = 2880;
    const frameSizeInBytes =
        frameSizeInSamples * Float32Array.BYTES_PER_ELEMENT;
    const enc = new opus.Encoder(
        runtime,
        48000,
        1,
        opus.constants.OPUS_APPLICATION_VOIP,
        10000,
        frameSizeInBytes
    );
    const pcm = child_process.spawn('arecord', [
        '-r',
        '48000',
        '-f',
        'FLOAT_LE',
        '-d',
        '4',
        `--buffer-size=${frameSizeInBytes}`,
    ]);
    const dec = new opus.Decoder(runtime, 48000, 1, frameSizeInSamples);
    const aplay = child_process.spawn('aplay', [
        '-f',
        'FLOAT_LE',
        '-r',
        '48000',
        '-c',
        '1',
        '-i',
    ]);
    const ringBuffer = new opus.RingBuffer(frameSizeInSamples);
    pcm.stdout.on('data', (chunk) => {
        assert.strict.ok(Buffer.isBuffer(chunk));
        const buffer = new Float32Array(chunk.buffer);
        ringBuffer.write(buffer);
        const samples = ringBuffer.read();
        if (samples === null) {
            return;
        }
        const encodedSamples = enc.encodeFloat(
            samples,
            frameSizeInSamples,
            10000
        );
        const decodedSamples = dec.decodeFloat(
            enc.encoded().subarray(0, encodedSamples)
        );
        const pcmAgain = dec.decoded().subarray(0, decodedSamples);
        aplay.stdin.write(
            new Uint8Array(
                pcmAgain.buffer,
                pcmAgain.byteOffset,
                pcmAgain.byteLength
            )
        );
    });
    pcm.stdout.on('end', () => {
        aplay.stdin.end();
    });
}

async function testEncoderOpusBitrate() {
    const runtime = await createRuntime();
    const frameSizeInSamples = 2880;
    const frameSizeInBytes =
        frameSizeInSamples * Float32Array.BYTES_PER_ELEMENT;
    const enc = new opus.Encoder(
        runtime,
        48000,
        1,
        opus.constants.OPUS_APPLICATION_VOIP,
        10000,
        frameSizeInBytes
    );
    assert.strict.equal(enc.getBitrate(), 72000);
    assert.strict.equal(enc.getSampleRate(), 48000);
    assert.strict.equal(
        enc.getApplication(),
        opus.constants.OPUS_APPLICATION_VOIP
    );
    enc.setBitrate(16000);
    assert.strict.equal(enc.getBitrate(), 16000);
    const pcm = child_process.spawn('arecord', [
        '-r',
        '48000',
        '-f',
        'FLOAT_LE',
        '-d',
        '4',
        `--buffer-size=${frameSizeInBytes}`,
    ]);
    const dec = new opus.Decoder(runtime, 48000, 1, frameSizeInSamples);
    const aplay = child_process.spawn('aplay', [
        '-f',
        'FLOAT_LE',
        '-r',
        '48000',
        '-c',
        '1',
        '-i',
    ]);
    const ringBuffer = new opus.RingBuffer(frameSizeInSamples);
    pcm.stdout.on('data', (chunk) => {
        assert.strict.ok(Buffer.isBuffer(chunk));
        const buffer = new Float32Array(chunk.buffer);
        ringBuffer.write(buffer);
        const samples = ringBuffer.read();
        if (samples === null) {
            return;
        }
        const encodedSamples = enc.encodeFloat(
            samples,
            frameSizeInSamples,
            10000
        );
        const decodedSamples = dec.decodeFloat(
            enc.encoded().subarray(0, encodedSamples)
        );
        const pcmAgain = dec.decoded().subarray(0, decodedSamples);
        aplay.stdin.write(
            new Uint8Array(
                pcmAgain.buffer,
                pcmAgain.byteOffset,
                pcmAgain.byteLength
            )
        );
    });
    pcm.stdout.on('end', () => {
        aplay.stdin.end();
    });
}

async function testRingBuffer() {
    const ringBuffer = new opus.RingBuffer(2880);
    ringBuffer.write(new Float32Array(2000));
    assert.strict.equal(ringBuffer.read(), null);
    ringBuffer.write(new Float32Array(880));
    assert.strict.deepEqual(ringBuffer.read(), new Float32Array(2880));
    assert.strict.equal(ringBuffer.read(), null);
    ringBuffer.write(new Float32Array(2000).fill(0.75));
    ringBuffer.write(new Float32Array(880).fill(0.75));
    assert.strict.deepEqual(
        ringBuffer.read(),
        new Float32Array(2880).fill(0.75)
    );
}

(async () => {
    await testRingBuffer();
    await testEncoderOpusBadArg();
    await testEncoderOpusSuccess();
    await testEncoderOpusEncoding();
    await testEncoderOpusBitrate();
})().catch((reason) => {
    process.exitCode = 1;
    console.error(reason);
});
