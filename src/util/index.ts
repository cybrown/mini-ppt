import { Reducer, combineReducers } from "redux";

export function set<T>(obj: T, data: Partial<T>): T {
    return {...obj as any, ...data as any};
}

export const rgbaToString = ({r, g, b, a}: {r: number, g: number, b: number, a?: number}) => `rgba(${r},${g},${b},${a === undefined ? 1 : a})`;

export function isAppleProduct() {
    return ['MacPPC','MacIntel', 'iPhone', 'iPad', 'iPod'].indexOf(navigator.platform) >= 0;
}

export function modifierForMultiSelection() {
    if (isAppleProduct()) {
        return 'Meta';
    } else {
        return 'Control';
    }
}

export interface Dictionary<T> {
    [id: string]: T;
}

type ReducersMapObject<S> = {
    [K in keyof S]: Reducer<S[K] | undefined>;
};

export function typedCombineReducers<S>(reducers: ReducersMapObject<S>): Reducer<S> {
    return combineReducers(reducers as any);
}

export const stopPropagation: React.MouseEventHandler<any> = e => {
    e.stopPropagation();
    e.stopPropagation();
};

export function requestFullscreen(el: Element): void {
    if (el.requestFullscreen) {
        el.requestFullscreen();
    } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
    } else if (el.webkitRequestFullScreen) {
        el.webkitRequestFullScreen();
    } else if ((el as any).mozRequestFullscreen) {
        (el as any).mozRequestFullscreen();
    } else if ((el as any).msRequestFullscreen) {
        (el as any).msRequestFullscreen();
    }
}
