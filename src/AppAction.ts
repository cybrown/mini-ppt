export interface WidgetMoveAction {
    type: 'widget.move';
    id: string;
    x: number;
    y: number;
}

export interface InputChangeAction {
    type: 'input.change';
    value: string;
}

export type AppAction = WidgetMoveAction | InputChangeAction;
