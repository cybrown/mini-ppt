import * as React from "react";
import { Slide } from "../index";
import { Widget } from "../../widget";
import { SlideRenderer } from "./SlideRenderer";
import { WidgetBox } from "./WidgetBox";
import { HasPosition } from "../../util/components/HasPosition";
import { Movable } from "../../util/components/Movable";

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
);
