export default class ResourcesHolder {
    readonly #resources = new Set<IResource>();
    #destroyed = false;
    public constructor() {}
    public add(resource: IResource) {
        this.#resources.add(resource);
    }
    public destroy() {
        if (this.#destroyed) {
            throw new Error('ResourcesHolder already destroyed');
        }
        for (const r of this.#resources) {
            r.destroy();
        }
        this.#resources.clear();
        this.#destroyed = true;
    }
    [Symbol.dispose]() {
        this.destroy();
    }
}

export interface IResource {
    destroy(): void;
    [Symbol.dispose](): void;
}
