export function lowerFirst(v: string) {
    return `${v[0]?.toLowerCase()}${v.substring(1)}`;
}
export function upperFirst(v: string) {
    return `${v[0]?.toUpperCase()}${v.substring(1)}`;
}
export function camelCase(value: string) {
    return value
        .replace(/([a-zA-Z]+)_([a-zA-Z]+)/g, (_, a: string, b: string) => {
            return `${lowerFirst(a.toLowerCase())}${upperFirst(
                b.toLowerCase()
            )}`;
        })
        .replace(/_([a-zA-Z]+)/g, (_, a: string) =>
            upperFirst(a.toLowerCase())
        );
}

export function getOpusRequestName(name: string) {
    return camelCase(name.replace(/^OPUS_/, ''));
}
