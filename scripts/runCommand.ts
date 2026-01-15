import { spawn } from '@high-nodejs/child_process';
import type { SpawnOptions } from 'node:child_process';

export default function runCommand(
    cmd: string,
    args: string[],
    options: SpawnOptions = {}
) {
    return spawn.wait(cmd, args, {
        stdio: 'inherit',
        log: true,
        ...options,
    });
}
