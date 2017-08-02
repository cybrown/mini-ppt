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
        case 'WidgetNewRectangle':
        case 'WidgetNewTextZone':
            return set(slides, {
                [action.slideId]: set(slides[action.slideId], {
                    widgetsIds: [...slides[action.slideId].widgetsIds, action.widgetId]
                })
            });
    }
    return slides;
}

export const SlideRenderer: React.SFC<{ slide: Slide }> = ({slide}) => (
    <div style={{backgroundColor: 'white', position: 'relative', width: 500 + 'px', height: 500 + 'px'}}>
        {slide.widgets.map(widget => (
            <HasPosition key={widget.id} x={widget.x} y={widget.y}>
                <WidgetRenderer widget={widget} />
            </HasPosition>
        ))}
    </div>
)

const WidgetBox: React.SFC<{
    widget: Widget;
    onMoveWidget: (id: string, x: number, y: number) => void;
    onResizeWidget: (id: string, width: number, y: number) => void;
}> = ({widget, onMoveWidget, onResizeWidget}) => (
    <div style={{border: 'black thin dotted',
                 boxSizing: 'border-box',
                 width: widget.width + 'px',
                 height: widget.height + 'px'}}>
        <Movable immediate onMove={(deltaX, deltaY) => (onMoveWidget(widget.id, widget.x + deltaX, widget.y + deltaY), onResizeWidget(widget.id, widget.width - deltaX, widget.height - deltaY))}>
            <div style={{position: 'absolute', backgroundColor: 'white', left: '-4px', top: '-4px', width: '8px', height: '8px', border: 'black thin solid'}}></div>
        </Movable>
        <div style={{position: 'absolute', backgroundColor: 'white', left: widget.width - 6 + 'px', top: '-4px', width: '8px', height: '8px', border: 'black thin solid'}}></div>
        <Movable immediate onMove={(deltaX, deltaY) => onResizeWidget(widget.id, widget.width + deltaX, widget.height + deltaY)}>
            <div style={{position: 'absolute', backgroundColor: 'white', left: widget.width - 6 + 'px', top: widget.height - 6 + 'px', width: '8px', height: '8px', border: 'black thin solid'}}></div>
        </Movable>
        <div style={{position: 'absolute', backgroundColor: 'white', left: '-4px', top: widget.height - 6 + 'px', width: '8px', height: '8px', border: 'black thin solid'}}></div>
    </div>
)

export const SlideEditor: React.SFC<{
    slide: Slide;
    onMoveWidget: (id: string, x: number, y: number) => void;
    onResizeWidget: (id: string, width: number, y: number) => void;
}> = ({slide, onMoveWidget, onResizeWidget}) => (
    <div style={{position: 'relative'}}>
        <div style={{position: 'absolute'}}>
            <SlideRenderer slide={slide} />
        </div>
        <div style={{position: 'absolute'}}>
            {slide.widgets.map(widget => (
                <HasPosition key={widget.id} x={widget.x} y={widget.y}>
                    <Movable onMove={(deltaX, deltaY) => onMoveWidget(widget.id, widget.x + deltaX, widget.y + deltaY)}>
                        <WidgetBox key={widget.id} widget={widget} onMoveWidget={onMoveWidget} onResizeWidget={onResizeWidget} />
                    </Movable>
                </HasPosition>
            ))}
        </div>
    </div>
)
