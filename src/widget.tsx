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
    fontSize: number;
}

export interface WidgetRectangle extends BaseWidget {
    kind: 'rectangle';
    backgroundColor: string;
}

export type Widget = WidgetTextZone | WidgetRectangle;

const widgetData = (state: State) => state.data.widgets;
export const currentSlideRecord = (state: State) => state.data.slides[state.ui.currentSlide];
export const widgetList = createSelector(currentSlideRecord, (currentSlide) => currentSlide.widgetsIds);
export const widgetsSelector = createSelector(widgetData, widgetList, (widgetData, widgetList) => widgetList.map(id => widgetData[id]));
export const currentSlide = createSelector(currentSlideRecord, widgetsSelector, (currentSlide, widgets): Slide => ({
    id: currentSlide.id,
    widgets
}))

export const selectedWidgets = (state: State) => state.ui.selectedWidgets.map(widgetId => state.data.widgets[widgetId]);

export const widgetRepositoryReducer = (widgets: State['data']['widgets'], action: AppAction) => {
    switch (action.type) {
        case 'WidgetMoveAction':
            return set(widgets, {[action.id]: set(widgets[action.id], {
                x: action.x,
                y: action.y
            })});
        case 'WidgetResizeAction':
            return set(widgets, {[action.id]: set(widgets[action.id], {
                width: action.width,
                height: action.height
            })});
        case 'WidgetNewTextZone':
            return set(widgets, {[action.widgetId]: {
                id: action.widgetId,
                kind: 'text',
                x: action.x,
                y: action.y,
                width: action.width,
                height: action.height,
                text: 'Text',
                fontSize: 12
            }})
        case 'WidgetNewRectangle':
            return set(widgets, {[action.widgetId]: {
                id: action.widgetId,
                kind: 'rectangle',
                x: action.x,
                y: action.y,
                width: action.width,
                height: action.height,
                backgroundColor: action.backgroundColor
            }})
        case 'WidgetChangeBackgroundColor':
            return set(widgets, {[action.widgetId]: set(widgets[action.widgetId], {backgroundColor: action.backgroundColor})});
        case 'WidgetChangeFontSize':
            return set(widgets, {[action.widgetId]: set(widgets[action.widgetId], {fontSize: action.fontSize})});
        case 'WidgetChangeText':
            return set(widgets, {[action.widgetId]: set(widgets[action.widgetId], {text: action.text})});
    }
    return widgets;
}

const TextZone: React.SFC<{
    text: string;
    width: number;
    height: number;
    fontSize: number;
}> = ({text, width, height, fontSize}) => (
    <div style={{width: width + 'px', height: height + 'px', fontSize: fontSize + 'px'}}>{text}</div>
);

const Rectangle: React.SFC<{backgroundColor: string, width: number, height: number}> = ({backgroundColor, width, height}) => (
    <div style={{width: width + 'px', height: height + 'px', backgroundColor}}></div>
)

export const WidgetRenderer: React.SFC<{widget: Widget}> = ({widget}) => {
    switch (widget.kind) {
        case 'text':
            return <TextZone text={widget.text} width={widget.width} height={widget.height} fontSize={widget.fontSize} />;
        case 'rectangle':
            return <Rectangle backgroundColor={widget.backgroundColor} width={widget.width} height={widget.height} />;
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
        x: number;
        y: number;
        width: number;
        height: number;
    };
    WidgetNewRectangle: {
        slideId: string;
        widgetId: string;
        x: number;
        y: number;
        width: number;
        height: number;
        backgroundColor: string;
    };
    WidgetResizeAction: {
        id: string;
        width: number;
        height: number;
    };
    WidgetChangeBackgroundColor: {
        widgetId: string;
        backgroundColor: string;
    };
    WidgetChangeFontSize: {
        widgetId: string;
        fontSize: number
    };
    WidgetChangeText: {
        widgetId: string;
        text: string;
    };
}
