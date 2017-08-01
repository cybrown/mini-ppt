import { State } from "./State";
import { AppAction } from "./AppAction";
import { set } from "./util";
import { Widget, HasPosition, WidgetRenderer } from "./widget";
import * as React from "react";

export interface Slide {
    id: string;
    widgetsIds: string[];
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

export const SlideEditor: React.SFC<{
    widgets: Widget[],
    slide: Slide,
    onMoveWidget: (id: string, x: number, y: number) => void
}> = ({children, widgets, slide, onMoveWidget}) => (
    <div style={{backgroundColor: 'white', position: 'relative', width: 500 + 'px', height: 500 + 'px'}}>
        {widgets.map(widget => (
            <HasPosition key={widget.id} x={widget.x} y={widget.y} onMove={(x, y) => onMoveWidget(widget.id, x, y)}>
                <WidgetRenderer widget={widget} />
            </HasPosition>
        ))}
    </div>
)
