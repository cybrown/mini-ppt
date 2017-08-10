import { Reducer } from "redux";
import { set } from "../util";
import { Widget } from "../widget";
import { AppAction } from "../app";

export interface UIState {
    currentSlide: string | null;
    selectedWidgets: string[];
    showChangeTextPopup: boolean;
    currentWidgetText: string;
    currentBackgroundColor: string;
    showBackgroundColorPicker: boolean;
    contextMenu: {
        position: {
            top: number;
            left: number;
        };
        visible: boolean;
        entries: {
            [topic: string]: ContextMenuEntry[]
        };
    };
    clipboard: Widget[];
}

export interface UIActions {
    'ui.popup.changeText.set.visibility': {
        visible: boolean;
        text?: string;
    };
    'ui.set.widgetText': {
        text: string;
    };
    'ui.selection.widgets.replace': {
        widgets: Widget[];
    };
    'ui.current.backgroundColor.set': {
        backgroundColor: string;
    };
    'ui.backgroundColorPicker.set.visiblity': {
        visible: boolean;
    };
    'ui.current.slide.set': {
        slideId: string;
    };
    'ui.contextMenu.showAtPosition': {
        top: number;
        left: number;
    };
    'ui.contextMenu.topic.add': {
        topic: string;
        entries: ContextMenuEntry[];
    };
    'ui.contextMenu.hide': {};
    'ui.clipboard.copy.widgets': {
        x: number;
        y: number;
        widgets: Widget[];
    };
    'ui.clipboard.paste.widgets': {
        x: number;
        y: number;
        slideId: string;
        widgets: Widget[];
    };
    UIUndo: {};
}

export interface ContextMenuEntry {
    caption: string;
    actions: AppAction[];
}

const uiInitialState: UIState = {
    currentSlide: null,
    selectedWidgets: [],
    showChangeTextPopup: false,
    currentWidgetText: '',
    currentBackgroundColor: 'rgba(50,139,241,1)',
    showBackgroundColorPicker: false,
    contextMenu: {
        position: {
            top: 0,
            left: 0
        },
        visible: false,
        entries: {}
    },
    clipboard: []
};

export const uiReducer: Reducer<UIState> = (state: UIState = uiInitialState, action: AppAction): UIState => {
    switch (action.type) {
        case 'ui.selection.widgets.replace':
            return set(state, {
                selectedWidgets: action.widgets.map(w => w.id),
                showBackgroundColorPicker: false,
                currentBackgroundColor: action.widgets.length === 1 ? action.widgets[0].backgroundColor : state.currentBackgroundColor
            });
        case 'ui.set.widgetText':
            return set(state, {
                showChangeTextPopup: true,
                currentWidgetText: action.text
            });
        case 'ui.popup.changeText.set.visibility':
            return set(state, {
                showChangeTextPopup: action.visible,
                currentWidgetText: action.text ? action.text : state.currentWidgetText
            });
        case 'ui.current.backgroundColor.set':
            return set(state, {
                currentBackgroundColor: action.backgroundColor
            });
        case 'widget.new':
            return set(state, {
                selectedWidgets: [action.widget.id]
            });
        case 'ui.backgroundColorPicker.set.visiblity':
            return set(state, {
                showBackgroundColorPicker: action.visible
            });
        case 'ui.current.slide.set':
            return set(state, {
                currentSlide: action.slideId,
                selectedWidgets: []
            });
        case 'slide.new':
            return set(state, {
                currentSlide: action.slide.id,
                selectedWidgets: []
            });
        case 'ui.contextMenu.showAtPosition':
            return set(state, {
                contextMenu: set(state.contextMenu, {
                    position: set(state.contextMenu.position, {
                        top: action.top,
                        left: action.left
                    }),
                    visible: true
                })
            });
        case 'ui.contextMenu.topic.add':
            return set(state, {
                contextMenu: set(state.contextMenu, {
                    entries: set(state.contextMenu.entries, {
                        [action.topic]: action.entries
                    })
                })
            });
        case 'ui.contextMenu.hide':
            return set(state, {
                contextMenu: set(state.contextMenu, {
                    visible: false,
                    entries: {}
                })
            });
        case 'ui.clipboard.copy.widgets':
            return set(state, {
                selectedWidgets: action.widgets.map(widget => widget.id),
                clipboard: action.widgets.map(widget => set(widget, {
                    id: Math.random().toString(),
                    x: widget.x - action.x,
                    y: widget.y - action.y
                }))
            });
        case 'widget.remove':
            return set(state, {
                selectedWidgets: []
            });
    }
    return state;
}
