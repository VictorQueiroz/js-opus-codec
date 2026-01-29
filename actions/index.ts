import { type RequestResponse } from './actions.js';

export * as default from './actions.js';

export async function successOrFail<T>(
    pendingResponse: RequestResponse<T> | Promise<RequestResponse<T>>
) {
    const response = await Promise.resolve(pendingResponse);
    if ('failures' in response) {
        throw new Error(
            `Request ${response.requestId} failed: ${response.failures?.join(', ')}`
        );
    }
    return response;
}
