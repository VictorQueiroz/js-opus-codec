async function getInstantiatedSource({ wasmFileHref, importObject }) {
    let pendingWebAssemblyInstantiateSource;
    if ('process' in globalThis && process.env['RUNTIME'] === 'nodejs') {
        const fs = await import('fs');
        const path = await import('path');
        const wasmPath = path.resolve(import.meta.dirname, 'index.wasm');
        const wasmBinary = await fs.promises.readFile(wasmPath);
        pendingWebAssemblyInstantiateSource = WebAssembly.instantiate(
            wasmBinary,
            importObject
        );
    } else {
        if (typeof wasmFileHref !== 'string') {
            throw new Error('Invalid wasmFileHref');
        }

        const response = await fetch(wasmFileHref);
        pendingWebAssemblyInstantiateSource =
            await WebAssembly.instantiateStreaming(response, importObject);
    }

    return pendingWebAssemblyInstantiateSource;
}

async function createModule({ wasmFileHref } = {}) {
    const wasi_snapshot_preview1 = {
        proc_exit: function (code) {
            console.log('WASI proc_exit called with code:', code);
            throw new Error(`WASI exit with code: ${code}`);
        }
    };
    for (const funcName of [
        'args_get',
        'args_sizes_get',
        'fd_close',
        'fd_seek',
        'fd_write',
        'fd_fdstat_get',
        'fd_prestat_get',
        'fd_prestat_dir_name'
    ]) {
        wasi_snapshot_preview1[funcName] = function (args) {
            console.log('[%s] called with %o', funcName, args);
            return 0; // Success
        };
    }

    const importObject = {
        wasi_snapshot_preview1
    };

    const webAssemblyInstantiatedSource = await getInstantiatedSource({
        wasmFileHref,
        importObject
    });
    const memory =
        webAssemblyInstantiatedSource.instance.exports.memory ?? null;
    if (memory === null) {
        throw new Error('Memory was expected to be imported but is null');
    }

    return {
        ...webAssemblyInstantiatedSource.instance.exports,
        memory
    };
}

export default createModule;
