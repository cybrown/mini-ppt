export function set<T>(obj: T, data: Partial<T>): T {
    return {...obj as any, ...data as any};
}
