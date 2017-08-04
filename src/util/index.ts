export function set<T>(obj: T, data: Partial<T>): T {
    return {...obj as any, ...data as any};
}

export const rgbaToString = ({r, g, b, a}: {r: number, g: number, b: number, a?: number}) => `rgba(${r},${g},${b},${a === undefined ? 1 : a})`;
