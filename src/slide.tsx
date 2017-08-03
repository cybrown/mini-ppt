import { State } from "./State";
import { AppAction } from "./AppAction";
import { set, HasPosition, Movable } from "./util";
import { Widget, WidgetRenderer } from "./widget";
import * as React from "react";

export interface SlideRecord {
    id: string;
    widgetsIds: string[];
}

export interface Slide {
    id: string;
    widgets: Widget[];
}

export const slideRepositoryReducer = (slides: State['data']['slides'], action: AppAction): State['data']['slides'] => {
    switch (action.type) {
        case 'WidgetNew':
            return set(slides, {
                [action.slideId]: set(slides[action.slideId], {
                    widgetsIds: [...slides[action.slideId].widgetsIds, action.widget.id]
                })
            });
    }
    return slides;
}

export const SlideRenderer: React.SFC<{
    slide: Slide;
    onWidgetClick: (widgetId: string) => void;
}> = ({slide, onWidgetClick}) => (
    <div style={{backgroundColor: 'white', position: 'relative', width: 500 + 'px', height: 500 + 'px'}}>
        {slide.widgets.map(widget => (
            <HasPosition key={widget.id} x={widget.x} y={widget.y} onClick={() => onWidgetClick(widget.id)}>
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
}> = ({widget, onMoveWidget, onResizeWidget, onStartChangeText}) => (
    <div style={{border: 'black thin dotted',
                 boxSizing: 'border-box',
                 width: widget.width + 'px',
                 height: widget.height + 'px'}}
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
    onSelectWidget: (widgetId: string) => void;
    onStartChangeText: (text: string) => void;
}> = ({slide, onMoveWidget, onResizeWidget, selectedWidgets, onSelectWidget, onStartChangeText}) => (
    <div style={{position: 'relative'}}>
        <div>
            <SlideRenderer slide={slide} onWidgetClick={onSelectWidget} />
        </div>
        <div style={{position: 'absolute', top: 0, left: 0}}>
            {selectedWidgets.map(widget => (
                <HasPosition key={widget.id} x={widget.x} y={widget.y}>
                    <Movable immediate onMove={(deltaX, deltaY) => onMoveWidget(widget.id, widget.x + deltaX, widget.y + deltaY)}>
                        <WidgetBox key={widget.id}
                                   widget={widget}
                                   onMoveWidget={onMoveWidget}
                                   onResizeWidget={onResizeWidget}
                                   onStartChangeText={onStartChangeText} />
                    </Movable>
                </HasPosition>
            ))}
        </div>
    </div>
)
