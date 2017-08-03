import { Reducer } from "redux";
import { AppAction } from "./AppAction";
import { set } from "./util";
import { Widget } from "./widget";

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
    UIChangeCurrentColor: {
        color: string;
    };
    UIChangeColorPickerVisibility: {
        visible: boolean;
    };
}

export const uiInitialState: UIState = {
    currentSlide: 'toto',
    selectedWidgets: [],
    showChangeTextPopup: false,
    currentWidgetText: '',
    currentColor: 'rgba(0,0,255,1)',
    showColorPicker: false
};

export interface UIState {
    currentSlide: string;
    selectedWidgets: string[];
    showChangeTextPopup: boolean;
    currentWidgetText: string;
    currentColor: string;
    showColorPicker: boolean;
}

export const editorReducer: Reducer<UIState> = (state: UIState, action: AppAction): UIState => {
    switch (action.type) {
        case 'UIWidgetSelect':
            return set(state, {
                selectedWidgets: [action.widget.id],
                currentColor: action.widget.kind === 'rectangle' ? action.widget.color : state.currentColor
            });
        case 'UIWidgetUnselect':
            return set(state, {
                selectedWidgets: [],
                showColorPicker: false
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
        case 'UIChangeCurrentColor':
            return set(state, {
                currentColor: action.color
            });
        case 'WidgetNewRectangle':
            return set(state, {
                selectedWidgets: [action.widgetId]
            });
        case 'WidgetNewTextZone':
            return set(state, {
                selectedWidgets: [action.widgetId],
            });
        case 'UIChangeColorPickerVisibility':
            return set(state, {
                showColorPicker: action.visible
            });
    }
    return state;
}
