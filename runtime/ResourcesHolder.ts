
export default class ResourcesHolder {
    readonly #resources = new Set<IResource>();
    public constructor(){

    }
    public add(resource: IResource){
        this.#resources.add(resource);
    }
    public destroy(){
        for(const r of this.#resources){
            r.destroy();
        }
    }
}

export interface IResource {
    destroy(): void;
}
