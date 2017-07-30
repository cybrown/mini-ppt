export interface WidgetMoveAction {
    type: 'widget.move';
    id: string;
    x: number;
    y: number;
}

export type AppAction = WidgetMoveAction;
