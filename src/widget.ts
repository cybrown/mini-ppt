export type WidgetKind = 'text' | 'rectangle';

export interface BaseWidget {
    kind: WidgetKind;
    id: string;
    x: number;
    y: number;
}

export interface WidgetTextZone extends BaseWidget {
    kind: 'text';
    text: string;
}

export interface WidgetRectangle extends BaseWidget {
    kind: 'rectangle';
    color: string;
    width: number;
    height: number;
}

export type Widget = WidgetTextZone | WidgetRectangle;
