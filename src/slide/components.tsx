import { HasPosition, Movable, modifierForMultiSelection } from "../util/components";
import { WidgetRenderer } from "../widget/components";
import * as React from "react";
import { Slide } from "./index";
import { Widget } from "../widget";

export const SlideRenderer: React.SFC<{
    slide: Slide;
    onWidgetClick?: (widgetId: string, ctrl: boolean) => void;
}> = ({slide, onWidgetClick}) => (
    <div style={{backgroundColor: 'white', position: 'relative', width: 500 + 'px', height: 500 + 'px'}}>
        {slide.widgets.map(widget => (
            <HasPosition key={widget.id} x={widget.x} y={widget.y} onClick={onWidgetClick && ((ctrl) => onWidgetClick(widget.id, ctrl))}>
                <WidgetRenderer widget={widget}/>
            </HasPosition>
        ))}
    </div>
)

const WidgetBox: React.SFC<{
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

export const SlideEditor: React.SFC<{
    slide: Slide;
    onMoveWidget: (id: string, x: number, y: number) => void;
    onResizeWidget: (id: string, width: number, y: number) => void;
    selectedWidgets: Widget[];
    onSelectWidget: (widgetId: string, addToCurrentSelection: boolean) => void;
    onStartChangeText: (text: string) => void;
}> = ({slide, onMoveWidget, onResizeWidget, selectedWidgets, onSelectWidget, onStartChangeText}) => (
    <div style={{position: 'relative'}}>
        <div>
            <SlideRenderer slide={slide} onWidgetClick={onSelectWidget} />
        </div>
        <div style={{position: 'absolute', top: 0, left: 0}}>
            {selectedWidgets.map(widget => (
                <HasPosition key={widget.id} x={widget.x} y={widget.y}>
                    <Movable immediate onMove={(deltaX, deltaY) => onMoveWidget(widget.id, deltaX, deltaY)}>
                        <WidgetBox key={widget.id}
                                   widget={widget}
                                   onWidgetClick={onSelectWidget}
                                   onMoveWidget={onMoveWidget}
                                   onResizeWidget={onResizeWidget}
                                   onStartChangeText={onStartChangeText} />
                    </Movable>
                </HasPosition>
            ))}
        </div>
    </div>
)
