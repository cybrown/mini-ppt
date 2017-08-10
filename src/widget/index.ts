import { createSelector } from "reselect/lib";
import { set, Dictionary } from "../util";
import { Slide } from "../slide";
import { AppState, AppAction } from "../app";

export type WidgetKind = 'text' | 'rectangle';

export function createTextZoneWidget(backgroundColor: string): WidgetTextZone {
    return {
        id: Math.random().toString(),
        x: 250 - 100 / 2,
        y: 250 - 20 / 2,
        width: 100,
        height: 20,
        backgroundColor,
        fontSize: 14,
        kind: 'text',
        text: 'Text',
        opacity: 1
    };
}

export function createRectangleWidget(backgroundColor: string): WidgetRectangle {
    return {
        id: Math.random().toString(),
        kind: 'rectangle',
        x: 250 - 40 / 2,
        y: 250 - 40 / 2,
        width: 40,
        height: 40,
        backgroundColor,
        opacity: 1
    };
}

export interface BaseWidget {
    kind: WidgetKind;
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    backgroundColor: string;
    opacity: number;
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

// TODO: Move to util
function notNull(value: any) {
    return value != null;
}

const widgetData = (state: AppState) => state.presentation.widgets;
export const currentSlideRecord = (state: AppState) => state.ui.currentSlide ? state.presentation.slides[state.ui.currentSlide] : null;
export const widgetList = createSelector(currentSlideRecord, (currentSlide) => currentSlide ? currentSlide.widgetsIds : []);
export const widgetsSelector = createSelector(widgetData, widgetList, (widgetData, widgetList) => widgetList.map(id => widgetData[id]));
export const currentSlide = createSelector(currentSlideRecord, widgetsSelector, (currentSlide, widgets): Slide | null => (currentSlide ? {
    id: currentSlide.id,
    widgets
} : null))

export const selectedWidgets = (state: AppState) => state.ui.selectedWidgets.map(widgetId => state.presentation.widgets[widgetId]).filter(notNull);

export const widgetRepositoryReducer = (widgets: Dictionary<Widget> = {}, action: AppAction) => {
    switch (action.type) {
        case 'widget.new':
            return set(widgets, {[action.widget.id]: action.widget});
        case 'widget.set.position':
            return set(widgets, {
                [action.widgetId]: set(widgets[action.widgetId], {
                    x: action.x,
                    y: action.y,
                })
            });
        case 'widget.set.bulk.position':
            return action.widgetProperties.reduce((widgets, widget) => {
                return set(widgets, {
                    [widget.widgetId]: set(widgets[widget.widgetId], {
                        x: widget.x,
                        y: widget.y
                    })
                });
            }, widgets);
        case 'widget.set.dimensionsAndPosition':
            return set(widgets, {
                [action.widgetId]: set(widgets[action.widgetId], {
                    x: action.x,
                    y: action.y,
                    height: action.height,
                    width: action.width,
                })
            });
        case 'widget.set.bulk.backgroundColor':
            return action.widgetIds.reduce((widgets, widgetId) => {
                return set(widgets, {
                    [widgetId]: set(widgets[widgetId], {
                        backgroundColor: action.backgroundColor,
                    })
                })
            }, widgets);
        case 'widget.set.bulk.opacity':
            return action.widgetIds.reduce((widgets, widgetId) => {
                return set(widgets, {
                    [widgetId]: set(widgets[widgetId], {
                        opacity: action.opacity,
                    })
                })
            }, widgets);
        case 'widget.textZone.set.text': {
            const widget = widgets[action.widgetId];
            if (widget.kind === 'text') {
                return set(widgets, {
                    [action.widgetId]: set(widget, {
                        text: action.text,
                    })
                });
            }
            break;
        }
        case 'widget.textZone.set.bulk.fontSize': {
            return action.widgetIds.reduce((widgets, widgetId) => {
                return set(widgets, {
                    [widgetId]: set(widgets[widgetId], {
                        fontSize: action.fontSize,
                    })
                })
            }, widgets);
        }
        case 'ui.clipboard.paste.widgets':
            return action.widgets.reduce((widgets, widget) => set(widgets, {
                [widget.id]: set(widget, {x: widget.x + action.x, y: widget.y + action.y})
            }), widgets);
    }
    return widgets;
}

export interface WidgetActions {
    'widget.new': {
        slideId: string;
        widget: Widget;
    };
    'widget.set.bulk.position': {
        widgetProperties: {
            widgetId: string;
            x: number;
            y: number;
        }[];
        history: boolean;
    };
    'widget.set.position': {
        widgetId: string;
        history: boolean;
        x: number;
        y: number;
    };
    'widget.set.bulk.backgroundColor': {
        widgetIds: string[];
        backgroundColor: string;
        history: boolean;
    };
    'widget.set.dimensionsAndPosition': {
        widgetId: string;
        history: boolean;
        x: number;
        y: number;
        width: number;
        height: number;
    };
    'widget.set.bulk.opacity': {
        widgetIds: string[];
        opacity: number;
        history: boolean;
    };
    'widget.textZone.set.text': {
        widgetId: string;
        text: string;
    };
    'widget.textZone.set.bulk.fontSize': {
        widgetIds: string[];
        fontSize: number;
    };
    'widget.remove': {
        slideId: string;
        widgetIds: string[];
    };
}
