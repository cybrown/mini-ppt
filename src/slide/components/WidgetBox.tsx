import * as React from "react";
import { Widget } from "../../widget";
import { modifierForMultiSelection, stopPropagation } from "../../util";
import { Movable } from "../../util/components/Movable";

export const WidgetBox: React.SFC<{
    widget: Widget;
    onResizeWidget: (id: string, deltaX: number, deltaY: number, width: number, height: number, isEnd: boolean) => void;
    onStartChangeText: (text: string) => void;
    onWidgetClick: (widgetId: string, ctrl: boolean) => void;
}> = ({widget, onResizeWidget, onStartChangeText, onWidgetClick}) => (
    <div
        style={{
            border: 'black thin dotted',
            boxSizing: 'border-box',
            width: widget.width + 'px',
            height: widget.height + 'px'
        }}
        onClick={e => onWidgetClick(widget.id, e.getModifierState(modifierForMultiSelection()))}
        onDoubleClick={e => (widget.kind === 'text' && onStartChangeText(widget.text), e.stopPropagation(), e.preventDefault())}
    >
        <Movable
            immediate
            onClick={stopPropagation}
            onMove={(deltaX, deltaY, isEnd) => onResizeWidget(widget.id, deltaX, deltaY, widget.width - deltaX, widget.height - deltaY, isEnd)}
        >
            <div style={{position: 'absolute', backgroundColor: 'white', left: '-4px', top: '-4px', width: '8px', height: '8px', border: 'black thin solid'}} />
        </Movable>
        <Movable
            immediate
            onClick={stopPropagation}
            onMove={(deltaX, deltaY, isEnd) => onResizeWidget(widget.id, 0, deltaY, widget.width + deltaX, widget.height - deltaY, isEnd)}
        >
            <div style={{position: 'absolute', backgroundColor: 'white', left: widget.width - 6 + 'px', top: '-4px', width: '8px', height: '8px', border: 'black thin solid'}} />
        </Movable>
        <Movable
            immediate
            onClick={stopPropagation}
            onMove={(deltaX, deltaY, isEnd) => onResizeWidget(widget.id, 0, 0, widget.width + deltaX, widget.height + deltaY, isEnd)}
        >
            <div style={{position: 'absolute', backgroundColor: 'white', left: widget.width - 6 + 'px', top: widget.height - 6 + 'px', width: '8px', height: '8px', border: 'black thin solid'}} />
        </Movable>
        <Movable
            immediate
            onClick={stopPropagation}
            onMove={(deltaX, deltaY, isEnd) => onResizeWidget(widget.id, deltaX, 0, widget.width - deltaX, widget.height + deltaY, isEnd)}
        >
            <div style={{position: 'absolute', backgroundColor: 'white', left: '-4px', top: widget.height - 6 + 'px', width: '8px', height: '8px', border: 'black thin solid'}} />
        </Movable>
    </div>
);
