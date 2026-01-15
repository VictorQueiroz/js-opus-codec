async function createModule({ wasmFileHref } = {}) {
    const memory = new WebAssembly.Memory({ initial: 256, maximum: 512 });
    const importObject = {
        env: {
            memory,
        },
        wasi_snapshot_preview1: {
            args_get: () => {},
            args_sizes_get: () => {},
            environ_get: () => {},
            environ_sizes_get: () => {},
            fd_close: () => {},
            fd_fdstat_get: () => {},
            fd_read: () => {},
            fd_seek: () => {},
            fd_write: () => {},
            proc_exit: () => {},
            random_get: () => {},
            clock_res_get: () => {},
            clock_time_get: () => {},
            fd_advise: () => {},
            fd_allocate: () => {},
            fd_datasync: () => {},
            fd_fdstat_set_flags: () => {},
            fd_fdstat_set_rights: () => {},
            fd_filestat_get: () => {},
            fd_filestat_set_size: () => {},
            fd_filestat_set_times: () => {},
            fd_pread: () => {},
            fd_prestat_get: () => {},
            fd_prestat_dir_name: () => {},
            fd_pwrite: () => {},
            fd_readdir: () => {},
            fd_renumber: () => {},
            fd_sync: () => {},
            fd_tell: () => {},
            path_create_directory: () => {},
            path_filestat_get: () => {},
            path_filestat_set_times: () => {},
            path_link: () => {},
            path_open: () => {},
            path_readlink: () => {},
            path_remove_directory: () => {},
            path_rename: () => {},
            path_symlink: () => {},
            path_unlink_file: () => {},
            poll_oneoff: () => {},
            sched_yield: () => {},
            sock_accept: () => {},
            sock_recv: () => {},
            sock_send: () => {},
            sock_shutdown: () => {},
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

(async () => {
    const wasmRuntime = await createModule();
    console.log(wasmRuntime);
    const { default: Encoder } = await import('../opus/Encoder.js');
    const { Runtime } = await import('../runtime/index.js');
    const runtime = new Runtime(wasmRuntime);
    const input = new Float32Array(2880);
    const encoder = new Encoder(
        runtime,
        48000,
        1,
        2048,
        10000,
        2880 * Float32Array.BYTES_PER_ELEMENT
    );
    const output = encoder.encodeFloat(input, 2880, 10000);
    console.log('Encoded output length:', output);
    encoder.destroy();
})().catch((err) => {
    console.error(err);
});

export default createModule;
