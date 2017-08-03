import { Reducer } from "redux";
import { AppAction } from "./AppAction";
import { set } from "./util";

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
        widgetId: string;
    };
    UIWidgetUnselect: {};
}

export const uiInitialState: UIState = {
    currentSlide: 'toto',
    selectedWidgets: [],
    showChangeTextPopup: false,
    currentWidgetText: ''
};

export interface UIState {
    currentSlide: string;
    selectedWidgets: string[];
    showChangeTextPopup: boolean;
    currentWidgetText: string;
}

export const editorReducer: Reducer<UIState> = (state: UIState, action: AppAction): UIState => {
    switch (action.type) {
        case 'UIWidgetSelect':
            return set(state, {
                selectedWidgets: [action.widgetId]
            });
        case 'UIWidgetUnselect':
            return set(state, {selectedWidgets: []});
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
    }
    return state;
}
