import { Reducer } from "redux";
import { AppAction } from "./AppAction";
import { set } from "./util";
import { Widget } from "./widget";

export interface UIState {
    currentSlide: string;
    selectedWidgets: string[];
    showChangeTextPopup: boolean;
    currentWidgetText: string;
    currentBackgroundColor: string;
    showBackgroundColorPicker: boolean;
}

export interface UIActions {
    UIShowChangeTextPopup: {
        widgetId: string;
        text: string;
    };
    UIHideChangeTextPopup: {};
    UIChangeWidgetText: {
        text: string;
    };
    UIWidgetSelect: {
        widget: Widget;
    };
    UIWidgetUnselect: {};
    UIChangeCurrentBackgroundColor: {
        backgroundColor: string;
    };
    UIChangeBackgroundColorPickerVisibility: {
        visible: boolean;
    };
}

export const uiInitialState: UIState = {
    currentSlide: 'toto',
    selectedWidgets: [],
    showChangeTextPopup: false,
    currentWidgetText: '',
    currentBackgroundColor: 'rgba(192,137,45,0.3)',
    showBackgroundColorPicker: false
};

export const uiReducer: Reducer<UIState> = (state: UIState, action: AppAction): UIState => {
    switch (action.type) {
        case 'UIWidgetSelect':
            return set(state, {
                selectedWidgets: [action.widget.id],
                currentBackgroundColor: action.widget.backgroundColor
            });
        case 'UIWidgetUnselect':
            return set(state, {
                selectedWidgets: [],
                showBackgroundColorPicker: false
            });
        case 'UIShowChangeTextPopup':
            return set(state, {
                showChangeTextPopup: true,
                currentWidgetText: action.text
            });
        case 'UIChangeWidgetText':
            return set(state, {
                showChangeTextPopup: true,
                currentWidgetText: action.text
            });
        case 'UIHideChangeTextPopup':
            return set(state, {
                showChangeTextPopup: false,
                currentWidgetText: ''
            });
        case 'UIChangeCurrentBackgroundColor':
            return set(state, {
                currentBackgroundColor: action.backgroundColor
            });
        case 'WidgetNewRectangle':
            return set(state, {
                selectedWidgets: [action.widgetId]
            });
        case 'WidgetNewTextZone':
            return set(state, {
                selectedWidgets: [action.widgetId],
            });
        case 'UIChangeBackgroundColorPickerVisibility':
            return set(state, {
                showBackgroundColorPicker: action.visible
            });
    }
    return state;
}
