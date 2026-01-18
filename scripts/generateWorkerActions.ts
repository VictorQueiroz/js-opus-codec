import { TextStream } from '@textstream/core';
import {
    camelCase,
    getOpusRequestName,
    upperFirst
} from './functionNameHelpers.js';
import { opusGettersAndSetters } from './opusGettersAndSetters.js';
import path from 'node:path';
import fs from 'node:fs';

export async function generateWorkerActions() {
    const currentDir = import.meta.dirname;
    const cs = new TextStream();
    const getEnumName = (value: string) =>
        upperFirst(camelCase(value.replace(/^OPUS_/, '')));
    cs.write(
        `export enum OpusRequest {\n`,
        () => {
            for (const v of opusGettersAndSetters) {
                cs.write(`${getEnumName(v[0])} = '${v[0]}',\n`);
            }
        },
        '}\n'
    );
    const getInterfaceNames = new Set<string>();
    const setInterfaceNames = new Set<string>();
    for (const v of opusGettersAndSetters) {
        const interfaceName = `I${upperFirst(camelCase(v[0]))}`;
        const isGetter = v[0].startsWith('OPUS_GET_');
        if (isGetter) {
            getInterfaceNames.add(interfaceName);
        } else {
            setInterfaceNames.add(interfaceName);
        }
        cs.write(
            `export interface ${interfaceName} {\n`,
            () => {
                cs.write(`type: OpusRequest.${getEnumName(v[0])};\n`);
                cs.write('encoderId: string;\n');
                if (!isGetter) {
                    cs.write(`value: number;\n`);
                }
            },
            '}\n'
        );
        cs.write(
            `export function ${v[0]}(encoderId: string,${
                isGetter
                    ? ''
                    : v[1].arguments.map((a) => `${a}: number`).join(', ')
            }): ${interfaceName} {\n`,
            () => {
                cs.write(
                    `return {\n`,
                    () => {
                        cs.write('encoderId,\n');
                        cs.write(`type: OpusRequest.${getEnumName(v[0])},\n`);
                        if (!isGetter) {
                            cs.write(`value: x\n`);
                        }
                    },
                    '};\n'
                );
            },
            '}\n'
        );
    }
    cs.write(
        `export type OpusGetRequest = ${[...getInterfaceNames].join(' | ')};\n`
    );
    cs.write(
        `export type OpusSetRequest = ${[...setInterfaceNames].join(' | ')};\n`
    );
    await fs.promises.writeFile(
        path.resolve(currentDir, '../actions/opus.ts'),
        cs.value()
    );

    cs.write(
        `import {OpusGetRequest,OpusRequest,OpusSetRequest} from '../actions/opus.js';\n`
    );
    cs.write(`import {Encoder} from '../opus/index.js';\n`);
    cs.write(
        `export function setToEncoder(encoder: Encoder, request: OpusSetRequest){\n`,
        () => {
            cs.write('let result: boolean;\n');
            cs.write(
                `switch(request.type) {\n`,
                () => {
                    for (const v of opusGettersAndSetters) {
                        if (!v[0].startsWith('OPUS_SET_')) continue;
                        cs.write(`case OpusRequest.${getEnumName(v[0])}:\n`);
                        cs.indentBlock(() => {
                            cs.write(
                                `result = encoder.${getOpusRequestName(
                                    v[0]
                                )}(request.value);\n`
                            );
                            cs.write('break;\n');
                        });
                    }
                },
                '}\n'
            );
            cs.write('return result;\n');
        },
        '}\n'
    );
    cs.write(
        `export function getFromEncoder(encoder: Encoder, request: OpusGetRequest){\n`,
        () => {
            cs.write('let result: number;\n');
            cs.write(
                `switch(request.type) {\n`,
                () => {
                    for (const v of opusGettersAndSetters) {
                        if (!v[0].startsWith('OPUS_GET_')) continue;
                        cs.write(`case OpusRequest.${getEnumName(v[0])}:\n`);
                        cs.indentBlock(() => {
                            cs.write(
                                `result = encoder.${getOpusRequestName(
                                    v[0]
                                )}();\n`
                            );
                            cs.write('break;\n');
                        });
                    }
                },
                '}\n'
            );
            cs.write('return result;\n');
        },
        '}\n'
    );
    await fs.promises.writeFile(
        path.resolve(currentDir, '../worker/opus.ts'),
        cs.value()
    );
}
