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
    UIChangeTextPopupSetVisibility: {
        visible: boolean;
        text?: string;
    };
    UIChangeWidgetText: {
        text: string;
    };
    UIWidgetReplaceSelection: {
        widgets: Widget[];
    };
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
        case 'UIWidgetReplaceSelection':
            return set(state, {
                selectedWidgets: action.widgets.map(w => w.id),
                showBackgroundColorPicker: false,
                currentBackgroundColor: action.widgets.length === 1 ? action.widgets[0].backgroundColor : state.currentBackgroundColor
            });
        case 'UIChangeWidgetText':
            return set(state, {
                showChangeTextPopup: true,
                currentWidgetText: action.text
            });
        case 'UIChangeTextPopupSetVisibility':
            return set(state, {
                showChangeTextPopup: action.visible,
                currentWidgetText: action.text ? action.text : state.currentWidgetText
            });
        case 'UIChangeCurrentBackgroundColor':
            return set(state, {
                currentBackgroundColor: action.backgroundColor
            });
        case 'WidgetNew':
            return set(state, {
                selectedWidgets: [action.widget.id]
            });
        case 'UIChangeBackgroundColorPickerVisibility':
            return set(state, {
                showBackgroundColorPicker: action.visible
            });
    }
    return state;
}
