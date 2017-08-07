import * as React from "react";
import { Widget } from "../../widget";
import { modifierForMultiSelection } from "../../util";
import { Movable } from "../../util/components/Movable";

export const WidgetBox: React.SFC<{
    widget: Widget;
    onMoveWidget: (id: string, x: number, y: number) => void;
    onResizeWidget: (id: string, width: number, y: number) => void;
    onStartChangeText: (text: string) => void;
    onWidgetClick: (widgetId: string, ctrl: boolean) => void;
}> = ({widget, onMoveWidget, onResizeWidget, onStartChangeText, onWidgetClick}) => (
    <div style={{border: 'black thin dotted',
                 boxSizing: 'border-box',
                 width: widget.width + 'px',
                 height: widget.height + 'px'}}
        onClick={e => onWidgetClick(widget.id, e.getModifierState(modifierForMultiSelection()))}
        onDoubleClick={e => (widget.kind === 'text' && onStartChangeText(widget.text), e.stopPropagation(), e.preventDefault())}>
        <Movable immediate onMove={(deltaX, deltaY) => (onMoveWidget(widget.id, widget.x + deltaX, widget.y + deltaY), onResizeWidget(widget.id, widget.width - deltaX, widget.height - deltaY))}>
            <div style={{position: 'absolute', backgroundColor: 'white', left: '-4px', top: '-4px', width: '8px', height: '8px', border: 'black thin solid'}}></div>
        </Movable>
        <Movable immediate onMove={(deltaX, deltaY) => (onMoveWidget(widget.id, widget.x, widget.y + deltaY), onResizeWidget(widget.id, widget.width + deltaX, widget.height - deltaY))}>
            <div style={{position: 'absolute', backgroundColor: 'white', left: widget.width - 6 + 'px', top: '-4px', width: '8px', height: '8px', border: 'black thin solid'}}></div>
        </Movable>
        <Movable immediate onMove={(deltaX, deltaY) => onResizeWidget(widget.id, widget.width + deltaX, widget.height + deltaY)}>
            <div style={{position: 'absolute', backgroundColor: 'white', left: widget.width - 6 + 'px', top: widget.height - 6 + 'px', width: '8px', height: '8px', border: 'black thin solid'}}></div>
        </Movable>
        <Movable immediate onMove={(deltaX, deltaY) => (onMoveWidget(widget.id, widget.x + deltaX, widget.y), onResizeWidget(widget.id, widget.width - deltaX, widget.height + deltaY))}>
            <div style={{position: 'absolute', backgroundColor: 'white', left: '-4px', top: widget.height - 6 + 'px', width: '8px', height: '8px', border: 'black thin solid'}}></div>
        </Movable>
    </div>
)
