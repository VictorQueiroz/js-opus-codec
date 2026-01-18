async function wasmNoop(returnValue) {
    return (...args) => {
        console.log(args);
        return returnValue; // Success
    };
}

async function createModule({ wasmFileHref } = {}) {
    const wasi_snapshot_preview1 = {};
    for (const funcName of [
        'args_get',
        'args_sizes_get',
        'fd_close',
        'fd_seek',
        'fd_write',
        'proc_exit'
    ]) {
        wasi_snapshot_preview1[funcName] = function (args) {
            console.log('[%s] called with %o', funcName, args);
            return 0; // Success
        };
    }

    const importObject = {
        wasi_snapshot_preview1
    };

    let memory;
    const shouldImportMemory = process.env['WASI_IMPORT_MEMORY'];

    if (shouldImportMemory) {
        memory = new WebAssembly.Memory({ initial: 3 });
        importObject['env'] = {
            memory
        };
    } else {
        memory = null;
    }

    let pendingWebAssemblyInstantiateSource;
    if (process.env['NODE_ENV'] !== 'production') {
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

    if (!shouldImportMemory) {
        memory = webAssemblyInstantiatedSource.instance.exports.memory;
    }
    if (memory === null) {
        throw new Error('Memory was expected to be imported but is null');
    }

    console.log(
        Object.keys(webAssemblyInstantiatedSource.instance.exports).join(', ')
    );

    return {
        ...webAssemblyInstantiatedSource.instance.exports,
        memory
    };
}

export default createModule;
