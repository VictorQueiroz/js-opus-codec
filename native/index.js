async function createModule({ wasmFileHref } = {}) {
    const memory = new WebAssembly.Memory({ initial: 2 });
    const importObject = {
        env: {
            memory,
        },
        wasi_snapshot_preview1: {
            args_get: () => 1,
            args_sizes_get: () => 1,
            fd_close: () => 1,
            fd_seek: () => 1,
            fd_write: () => 1,
            proc_exit: () => 0,
        },
    };

    let pendingWebAssemblyInstantiateSource;
    if ('process' in globalThis) {
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
            const wasmBinaryUrl = await import('./index.wasm');
            wasmFileHref = wasmBinaryUrl.default;
        }

        if (typeof wasmFileHref !== 'string') {
            throw new Error('Invalid wasmFileHref');
        }

        const response = await fetch(wasmFileHref);
        pendingWebAssemblyInstantiateSource =
            await WebAssembly.instantiateStreaming(response, importObject);
    }

    const webAssemblyInstantiatedSource =
        await pendingWebAssemblyInstantiateSource;

    return {
        ...webAssemblyInstantiatedSource.instance.exports,
        memory,
    };
}

export default createModule;
