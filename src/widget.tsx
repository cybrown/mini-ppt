import { State } from "./State";
import { createSelector } from "reselect/lib";
import { set } from "./util";
import { AppAction } from "./AppAction";
import * as React from "react";
import { Slide } from "./slide";

export type WidgetKind = 'text' | 'rectangle';

export interface BaseWidget {
    kind: WidgetKind;
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface WidgetTextZone extends BaseWidget {
    kind: 'text';
    text: string;
}

export interface WidgetRectangle extends BaseWidget {
    kind: 'rectangle';
    color: string;
}

export type Widget = WidgetTextZone | WidgetRectangle;

const widgetData = (state: State) => state.data.widgets;
export const currentSlideRecord = (state: State) => state.data.slides[state.editor.currentSlide];
export const widgetList = createSelector(currentSlideRecord, (currentSlide) => currentSlide.widgetsIds);
export const widgetsSelector = createSelector(widgetData, widgetList, (widgetData, widgetList) => widgetList.map(id => widgetData[id]));
export const currentSlide = createSelector(currentSlideRecord, widgetsSelector, (currentSlide, widgets): Slide => ({
    id: currentSlide.id,
    widgets
}))

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
                width: 50,
                height: 20,
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

const TextZone: React.SFC<{text: string, width: number, height: number}> = ({text, width, height}) => (
    <div style={{width: width + 'px', height: height + 'px'}}>{text}</div>
);

const Rectangle: React.SFC<{color: string, width: number, height: number}> = ({color, width, height}) => (
    <div style={{width: width + 'px', height: height + 'px', backgroundColor: color}}></div>
)

export const WidgetRenderer: React.SFC<{widget: Widget}> = ({widget}) => {
    switch (widget.kind) {
        case 'text':
            return <TextZone text={widget.text} width={widget.width} height={widget.height} />;
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
