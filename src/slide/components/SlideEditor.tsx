import * as React from "react";
import { Slide } from "../index";
import { Widget } from "../../widget";
import { SlideRenderer } from "./SlideRenderer";
import { WidgetBox } from "./WidgetBox";
import { HasPosition } from "../../util/components/HasPosition";
import { Movable } from "../../util/components/Movable";

export class SlideEditor extends React.Component<{
    slide: Slide;
    onMoveSelectedWidgets: (x: number, y: number, isEnd: boolean) => void;
    onResizeWidget: (id: string, deltaX: number, deltaY: number, width: number, height: number, isEnd: boolean) => void;
    selectedWidgets: Widget[];
    onSelectWidget: (widgetId: string, addToCurrentSelection: boolean) => void;
    onStartChangeText: (text: string) => void;
}, {
    isMoving: boolean;
}> {

    state = {
        isMoving: false
    };

    render() {
        const {slide, onMoveSelectedWidgets, onResizeWidget, selectedWidgets, onSelectWidget, onStartChangeText} = this.props;
        return (
            <div style={{position: 'relative'}}>
                <div>
                    <SlideRenderer slide={slide} onWidgetClick={onSelectWidget} />
                </div>
                <div style={{position: 'absolute', top: 0, left: 0}}>
                    {selectedWidgets.map(widget => (
                        <HasPosition key={widget.id} x={widget.x} y={widget.y}>
                            <Movable immediate
                                     onMove={(deltaX, deltaY, isEnd) => onMoveSelectedWidgets( deltaX, deltaY, isEnd)}
                                     onMoveStart={() => this.setState({isMoving: true})}
                                     onMoveEnd={() => this.setState({isMoving: false})}>
                                {!this.state.isMoving ? (
                                    <WidgetBox key={widget.id}
                                               widget={widget}
                                               onWidgetClick={onSelectWidget}
                                               onResizeWidget={onResizeWidget}
                                               onStartChangeText={onStartChangeText} />
                                ) : null}
                            </Movable>
                        </HasPosition>
                    ))}
                </div>
            </div>
        )
    }
}
