import native from '../native/index.js';
import Runtime from '../runtime/Runtime.js';
import assert from 'node:assert';
import stream from 'node:stream';
import * as opus from '../opus/index.js';
import { test } from 'node:test';
import { alsaPlay, alsaRecord } from './alsa-tools.js';

const RingBufferF32 = (await import('ringbud')).RingBufferF32;

async function createRuntime() {
    return new Runtime(await native());
}

test('encoder WebAssembly memory grow', async (t) => {
    using runtime = await createRuntime();
    const frameSizeInSamples = 2880;
    const frameSizeInBytes =
        frameSizeInSamples * Float32Array.BYTES_PER_ELEMENT;
    const outBufferLength = 1024 * 1024 * 1;
    using enc = new opus.Encoder(
        runtime,
        48000,
        1,
        opus.constants.OPUS_APPLICATION_VOIP,
        outBufferLength,
        frameSizeInBytes
    );
    const inputSamples = new Float32Array(frameSizeInSamples);
    const encodedSamples = enc.encodeFloat(
        inputSamples,
        frameSizeInSamples,
        outBufferLength
    );
    t.assert.equal(encodedSamples, 168);
});

test('encoder opus bad arg', async () => {
    const runtime = await createRuntime();

    assert.strict.throws(() => {
        new opus.Encoder(runtime, 48000, 1, 0, 10000, 1024 * 2);
    }, /Failed to create encoder/);
});

test('encoder opus success', async () => {
    using runtime = await createRuntime();
    using _ = new opus.Encoder(
        runtime,
        48000,
        1,
        opus.constants.OPUS_APPLICATION_VOIP,
        10000,
        1024 * 2
    );
});

test('encoder opus encoding', async () => {
    using runtime = await createRuntime();
    const frameSizeInSamples = 2880;
    const frameSizeInBytes =
        frameSizeInSamples * Float32Array.BYTES_PER_ELEMENT;
    using enc = new opus.Encoder(
        runtime,
        48000,
        1,
        opus.constants.OPUS_APPLICATION_VOIP,
        10000,
        frameSizeInBytes
    );
    using dec = new opus.Decoder(runtime, 48000, 1, frameSizeInSamples);
    using alsaPlayer = alsaPlay({ sampleRate: 48000, channels: 1 });
    using pcm = alsaRecord({
        sampleRate: 48000,
        channels: 1,
        duration: 4,
        bufferSize: frameSizeInBytes
    });
    const ringBuffer = new RingBufferF32(frameSizeInSamples);
    for await (const chunk of pcm.stdout) {
        assert.strict.ok(Buffer.isBuffer(chunk));
        const buffer = new Float32Array(
            chunk.buffer,
            chunk.byteOffset,
            chunk.byteLength / Float32Array.BYTES_PER_ELEMENT
        );
        ringBuffer.write(buffer);
        const samples = ringBuffer.read();
        if (samples === null) {
            continue;
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
        assert.strict.ok(
            alsaPlayer.stdin.write(
                new Uint8Array(
                    pcmAgain.buffer,
                    pcmAgain.byteOffset,
                    pcmAgain.byteLength
                )
            )
        );
    }
    await stream.promises.finished(pcm.stdout);
    await stream.promises.finished(alsaPlayer.stdin.end());
});

test('encoder opus bitrate', async (t) => {
    using runtime = await createRuntime();
    const frameSizeInSamples = 2880;
    const frameSizeInBytes =
        frameSizeInSamples * Float32Array.BYTES_PER_ELEMENT;
    const outBufferLength = 10000;
    using enc = new opus.Encoder(
        runtime,
        48000,
        1,
        opus.constants.OPUS_APPLICATION_VOIP,
        outBufferLength,
        frameSizeInBytes
    );
    t.assert.equal(enc.getBitrate(), 72000);
    t.assert.equal(enc.getSampleRate(), 48000);
    t.assert.equal(enc.getApplication(), opus.constants.OPUS_APPLICATION_VOIP);
    assert.strict.ok(enc.setBitrate(16000));
    t.assert.equal(enc.getBitrate(), 16000);
    using pcm = alsaRecord({
        sampleRate: 48000,
        channels: 1,
        duration: 4,
        bufferSize: frameSizeInBytes
    });
    using dec = new opus.Decoder(runtime, 48000, 1, frameSizeInSamples);
    using alsaPlayer = alsaPlay({ sampleRate: 48000, channels: 1 });
    const ringBuffer = new RingBufferF32(frameSizeInSamples);
    for await (const chunk of pcm.stdout) {
        assert.strict.ok(Buffer.isBuffer(chunk));
        const buffer = new Float32Array(
            chunk.buffer,
            chunk.byteOffset,
            chunk.byteLength / Float32Array.BYTES_PER_ELEMENT
        );
        ringBuffer.write(buffer);
        const samples = ringBuffer.read();
        if (samples === null) {
            continue;
        }
        const encodedSamples = enc.encodeFloat(
            samples,
            frameSizeInSamples,
            outBufferLength
        );
        const decodedSamples = dec.decodeFloat(
            enc.encoded().subarray(0, encodedSamples)
        );
        const pcmAgain = dec.decoded().subarray(0, decodedSamples);
        assert.strict.ok(
            alsaPlayer.stdin.write(
                new Uint8Array(
                    pcmAgain.buffer,
                    pcmAgain.byteOffset,
                    pcmAgain.byteLength
                )
            )
        );
    }
    await stream.promises.finished(pcm.stdout);
    await stream.promises.finished(alsaPlayer.stdin.end());
});
