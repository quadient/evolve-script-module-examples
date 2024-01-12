export function pathCombine(path1: string, path2: string): string {
    return path1.endsWith('/') ? path1 + path2 : `${path1}/${path2}`;
}
