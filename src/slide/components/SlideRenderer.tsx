import * as React from "react";
import { Slide } from "../index";
import { WidgetRenderer } from "../../widget/components/WidgetRenderer";
import { HasPosition } from "../../util/components/HasPosition";

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
);
