import { State } from "./State";
import { createSelector } from "reselect/lib";
import { set } from "./util";
import { AppAction } from "./AppAction";
import * as React from "react";

export type WidgetKind = 'text' | 'rectangle';

export interface BaseWidget {
    kind: WidgetKind;
    id: string;
    x: number;
    y: number;
}

export interface WidgetTextZone extends BaseWidget {
    kind: 'text';
    text: string;
}

export interface WidgetRectangle extends BaseWidget {
    kind: 'rectangle';
    color: string;
    width: number;
    height: number;
}

export type Widget = WidgetTextZone | WidgetRectangle;

const widgetData = (state: State) => state.data.widgets;
const widgetList = (state: State) => state.data.slides[state.editor.currentSlide].widgetsIds;

export const widgetsSelector = createSelector(widgetData, widgetList, (widgetData, widgetList) => widgetList.map(id => widgetData[id]));

export const widgetRepositoryReducer = (widgets: State['data']['widgets'], action: AppAction) => {
    switch (action.type) {
        case 'WidgetMoveAction':
            return set(widgets, {[action.id]: set(widgets[action.id], {
                x: action.x,
                y: action.y
            })});
        case 'WidgetNewTextZone':
            return set(widgets, {[action.widgetId]: {
                id: action.widgetId,
                kind: 'text',
                x: 0,
                y: 0,
                text: 'Text'
            }})
        case 'WidgetNewRectangle':
            return set(widgets, {[action.widgetId]: {
                id: action.widgetId,
                kind: 'rectangle',
                x: 0,
                y: 0,
                width: 30,
                height: 30,
                color: 'blue'
            }})
    }
    return widgets;
}

const TextZone: React.SFC<{text: string}> = ({text}) => (
    <div>{text}</div>
);

const Rectangle: React.SFC<{color: string, width: number, height: number}> = ({color, width, height}) => (
    <div style={{width: width + 'px', height: height + 'px', backgroundColor: color}}></div>
)

export class HasPosition extends React.Component<{x: number, y: number, onMove: (x: number, y: number) => void}, {deltaX: number, deltaY: number}> {

    isMoving = false;
    originalX = 0;
    originalY = 0;

    state = {
        deltaX: 0,
        deltaY: 0
    }

    onmousedown: React.EventHandler<React.MouseEvent<HTMLDivElement>> = event => {
        this.isMoving = true;
        this.originalX = event.clientX;
        this.originalY = event.clientY;
        this.setupDocumentEvents();
    }

    onmousemove: EventListener = (event: MouseEvent) => {
        const deltaX = event.clientX - this.originalX;
        const deltaY = event.clientY - this.originalY;
        this.setState({
            deltaX, deltaY
        })
    }

    onmouseup = () => {
        this.removeDocumentEvents();
        this.props.onMove(this.props.x + this.state.deltaX, this.props.y + this.state.deltaY);
        this.setState({deltaX: 0, deltaY: 0})
    }

    private setupDocumentEvents() {
        document.addEventListener('mousemove', this.onmousemove);
        document.addEventListener('mouseup', this.onmouseup);
    }

    private removeDocumentEvents() {
        document.removeEventListener('mousemove', this.onmousemove);
        document.removeEventListener('mouseup', this.onmouseup);
    }

    componentWillUnmount() {
        this.removeDocumentEvents();
    }

    render() {
        const {x, y, children} = this.props;
        return (
            <div style={{position: 'absolute', left: x + this.state.deltaX + 'px', top: y + this.state.deltaY + 'px'}}
                 onMouseDown={this.onmousedown}>
                {children}
            </div>
        )
    }
}

export const RenderWidget: React.SFC<{widget: Widget}> = ({widget}) => {
    switch (widget.kind) {
        case 'text':
            return <TextZone text={widget.text} />;
        case 'rectangle':
            return <Rectangle color={widget.color} width={widget.width} height={widget.height} />;
    }
}

export interface WidgetActions {
    WidgetMoveAction: {
        id: string;
        x: number;
        y: number;
    };
    WidgetNewTextZone: {
        slideId: string;
        widgetId: string;
    };
    WidgetNewRectangle: {
        slideId: string;
        widgetId: string;
    };
}
