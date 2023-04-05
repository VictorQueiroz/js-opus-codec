import { boundMethod } from 'autobind-decorator';
import {
    IWorkerRequest,
    RequestResponse,
    RequestResponseType,
} from './actions';

export default class Client {
    readonly #worker;
    readonly #pending = new Map<
        string,
        (result: RequestResponse<unknown>) => void
    >();
    public constructor(worker: Worker) {
        this.#worker = worker;
        worker.addEventListener('message', this.onMessage);
    }
    public close() {
        this.#worker.terminate();
        for (const p of this.#pending) {
            p[1]({
                requestId: p[0],
                failures: ['Worker destroyed'],
            });
        }
    }
    public sendMessage<T extends IWorkerRequest<unknown, unknown>>(data: T) {
        return new Promise<RequestResponse<RequestResponseType<T>>>(
            (resolve, reject) => {
                if (this.#pending.has(data.requestId)) {
                    reject(
                        new Error(`Request already exists: ${data.requestId}`)
                    );
                    return;
                }
                this.#pending.set(data.requestId, (data) => {
                    resolve(data as RequestResponse<RequestResponseType<T>>);
                });
                this.#worker.postMessage(data);
            }
        );
    }
    @boundMethod private onMessage(e: MessageEvent) {
        const data = e.data as RequestResponse<unknown>;
        const request = this.#pending.get(data.requestId);
        if (!request) {
            console.error('failed to get pending request: %s', data.requestId);
            return;
        }
        request(data);
    }
}
