# opus-codec

## Installation

```
yarn add opus-codec
```

## Usage

```ts
import native from '../native';
export default async () => {
    const runtime = new Runtime(await native());
    const enc = new opus.Encoder(
        runtime,
        48000,
        1,
        opus.constants.OPUS_APPLICATION_VOIP,
        10000,
        frameSizeInBytes
    );
    const frameSizeInSamples = 2880;
    enc.setBitrate(16000);
    console.log(enc.getBitrate()); // 16000
    onreceivesamples = (samples: Float32Array) => {
        const encodedSamples = enc.encodeFloat(
            samples,
            frameSizeInSamples,
            10000
        );
        console.log(
            'encoded buffer: %o',
            enc.encoded().subarray(0, encodedSamples)
        );
    };
};
```
