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
    backgroundColor: string;
}

export interface WidgetTextZone extends BaseWidget {
    kind: 'text';
    text: string;
    fontSize: number;
}

export interface WidgetRectangle extends BaseWidget {
    kind: 'rectangle';
}

export type Widget = WidgetTextZone | WidgetRectangle;

const widgetData = (state: State) => state.data.widgets;
export const currentSlideRecord = (state: State) => state.ui.currentSlide ? state.data.slides[state.ui.currentSlide] : null;
export const widgetList = createSelector(currentSlideRecord, (currentSlide) => currentSlide ? currentSlide.widgetsIds : []);
export const widgetsSelector = createSelector(widgetData, widgetList, (widgetData, widgetList) => widgetList.map(id => widgetData[id]));
export const currentSlide = createSelector(currentSlideRecord, widgetsSelector, (currentSlide, widgets): Slide | null => (currentSlide ? {
    id: currentSlide.id,
    widgets
} : null))

export const selectedWidgets = (state: State) => state.ui.selectedWidgets.map(widgetId => state.data.widgets[widgetId]);

export const widgetRepositoryReducer = (widgets: State['data']['widgets'], action: AppAction) => {
    switch (action.type) {
        case 'WidgetNew':
            return set(widgets, {[action.widget.id]: action.widget});
        case 'WidgetUpdate':
            return set(widgets, {
                [action.widgetId]: set(widgets[action.widgetId], {
                    backgroundColor: action.backgroundColor !== undefined ? action.backgroundColor : widgets[action.widgetId].backgroundColor,
                    height: action.height !== undefined ? action.height : widgets[action.widgetId].height,
                    width: action.width !== undefined ? action.width : widgets[action.widgetId].width,
                    x: action.x !== undefined ? action.x : widgets[action.widgetId].x,
                    y: action.y !== undefined ? action.y : widgets[action.widgetId].y,
                })
            });
        case 'WidgetUpdateTextZone': {
            const widget = widgets[action.widgetId];
            if (widget.kind === 'text') {
                return set(widgets, {
                    [action.widgetId]: set(widget, {
                        text: action.text !== undefined ? action.text : widget.text,
                        fontSize: action.fontSize !== undefined ? action.fontSize : widget.fontSize,
                    })
                });
            }
        }
    }
    return widgets;
}

const TextZone: React.SFC<{
    text: string;
    width: number;
    height: number;
    fontSize: number;
    backgroundColor: string;
}> = ({text, width, height, fontSize, backgroundColor}) => (
    <div style={{width: width + 'px', height: height + 'px', fontSize: fontSize + 'px', backgroundColor}}>{text}</div>
);

const Rectangle: React.SFC<{backgroundColor: string, width: number, height: number}> = ({backgroundColor, width, height}) => (
    <div style={{width: width + 'px', height: height + 'px', backgroundColor}}></div>
)

export const WidgetRenderer: React.SFC<{widget: Widget}> = ({widget}) => {
    switch (widget.kind) {
        case 'text':
            return <TextZone backgroundColor={widget.backgroundColor} text={widget.text} width={widget.width} height={widget.height} fontSize={widget.fontSize} />;
        case 'rectangle':
            return <Rectangle backgroundColor={widget.backgroundColor} width={widget.width} height={widget.height} />;
    }
}

export interface WidgetActions {
    WidgetNew: {
        slideId: string;
        widget: Widget;
    };
    WidgetUpdate: {
        widgetId: string;
        x?: number;
        y?: number;
        backgroundColor?: string;
        width?: number;
        height?: number;
    };
    WidgetUpdateTextZone: {
        widgetId: string;
        fontSize?: number;
        text?: string;
    };
}
