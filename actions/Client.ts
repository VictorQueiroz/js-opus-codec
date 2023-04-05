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
        worker.addEventListener('messageerror', this.onMessageError);
        worker.addEventListener('error', this.onError);
    }
    public close() {
        this.#worker.terminate();
        for (const p of this.#pending) {
            this.#pending.delete(p[0]);
            p[1]({
                requestId: p[0],
                failures: ['Worker destroyed'],
            });
        }
    }
    public sendMessage<T extends IWorkerRequest<unknown, unknown>>(data: T) {
        const waitTimeBeforeResolvingAutomaticallyInMilliseconds = 10000;
        type Response = RequestResponse<RequestResponseType<T>>;
        return new Promise<Response>((resolve, reject) => {
            if (this.#pending.has(data.requestId)) {
                reject(new Error(`Request already exists: ${data.requestId}`));
                return;
            }
            const timeoutId = setTimeout(() => {
                resolve({
                    requestId: data.requestId,
                    failures: [
                        `Timeout expired. It took more than ${waitTimeBeforeResolvingAutomaticallyInMilliseconds} to resolve this request.`,
                    ],
                });
            }, waitTimeBeforeResolvingAutomaticallyInMilliseconds);
            this.#pending.set(data.requestId, (data) => {
                clearTimeout(timeoutId);
                resolve(data as Response);
            });
            this.#worker.postMessage(data);
        });
    }
    @boundMethod private onMessageError(e: MessageEvent) {
        console.error(e);
    }
    @boundMethod private onError(e: ErrorEvent) {
        console.error(e);
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
