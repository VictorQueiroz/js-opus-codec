import {
    RequestType,
    WorkerRequest,
    IInitializeWorker
} from '../actions/actions.js';
import native from '../native/index.js';
import { Runtime } from '../runtime/index.js';
import { WorkerMessageProcessor } from './WorkerMessageProcessor.js';

let workerState:
    | WorkerMessageProcessor
    | {
          queue: Set<WorkerRequest>;
      } = {
    queue: new Set()
};

const onRequest = async (req: WorkerRequest) => {
    if (!('queue' in workerState)) {
        workerState.onRequest(req);
        return;
    }
    switch (req.type) {
        case RequestType.InitializeWorker: {
            const queue = workerState.queue;
            const newWorkerState = new WorkerMessageProcessor(
                new Runtime(
                    await native({
                        wasmFileHref: req.data.wasmFileHref
                    })
                )
            );
            workerState = newWorkerState;
            for (const req of queue) {
                await onRequest(req);
            }
            queue.clear();
            workerState.sendResponse<IInitializeWorker>({
                requestId: req.requestId,
                value: null
            });
            break;
        }
        default:
            workerState.queue.add(req);
            break;
    }
};

let pending = Promise.resolve();

onmessage = (e: MessageEvent) => {
    const req = e.data as WorkerRequest;
    pending = pending
        .then(() => onRequest(req))
        .catch((reason) => {
            console.error('failed to process request: %o', {
                request: req,
                reason
            });
        });
};
