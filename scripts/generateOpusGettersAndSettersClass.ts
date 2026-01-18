import fs from 'node:fs';
import path from 'node:path';
import { TextStream } from '@textstream/core';
import { getOpusRequestName } from './functionNameHelpers.js';
import { opusGettersAndSetters } from './opusGettersAndSetters.js';

export async function generateOpusGettersAndSettersClass() {
    const cs = new TextStream();
    cs.write(
        `import { Runtime, Integer, type IResource } from '../runtime/index.js';\n`
    );
    cs.write(`import constants from './constants.js';\n`);
    cs.write(
        'export class OpusGettersAndSetters implements IResource {\n',
        () => {
            cs.write(`readonly #opusEncoderOffset;\n`);
            cs.write(`readonly #runtime;\n`);
            cs.write(`readonly #value;\n`);
            cs.write(
                'public constructor(runtime: Runtime, opusEncoderOffset: number) {\n',
                () => {
                    cs.write(`this.#runtime = runtime;\n`);
                    cs.write(`this.#value = new Integer(runtime);\n`);
                    cs.write(`this.#opusEncoderOffset = opusEncoderOffset;\n`);
                },
                '}\n'
            );
            for (const v of opusGettersAndSetters) {
                const name = getOpusRequestName(v[0]);
                const args = `${v[1].arguments
                    .map((c) => `${c}: number`)
                    .join(', ')}`;
                const isGetter = v[0].startsWith('OPUS_GET_');
                cs.write(
                    `public ${name}(${isGetter ? '' : args}): ${
                        isGetter ? 'number' : 'boolean'
                    } {\n`,
                    () => {
                        let varName: string;
                        if (isGetter) {
                            varName = `this.#value.offset()`;
                        } else {
                            varName = 'x';
                        }
                        cs.write(
                            `const result = this.#runtime.originalRuntime().${v[0].toLowerCase()}(this.#opusEncoderOffset,${varName});\n`
                        );
                        if (isGetter) {
                        }
                        if (isGetter) {
                            cs.write(
                                `if(result != constants.OPUS_OK) throw new Error('Failed to set ${v[0]}');\n`
                            );
                            cs.write('return this.#value.value();\n');
                        } else {
                            cs.write(`return result === constants.OPUS_OK;\n`);
                        }
                    },
                    '}\n'
                );
            }
            cs.write(
                'public destroy() {\n',
                () => {
                    cs.write('this.#value.destroy();\n');
                },
                '}\n'
            );
            cs.write(
                '[Symbol.dispose]() {\n',
                () => {
                    cs.write('this.destroy();\n');
                },
                '}\n'
            );
        },
        '}\n'
    );
    await fs.promises.writeFile(
        path.resolve(import.meta.dirname, '../opus/OpusGettersAndSetters.ts'),
        cs.value()
    );
}
