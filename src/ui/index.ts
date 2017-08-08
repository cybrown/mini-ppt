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
    UISetCurrentSlide: {
        slideId: string;
    };
    UIContextMenuShowAtPosition: {
        top: number;
        left: number;
    };
    UIContextMenuSetTopic: {
        topic: string;
        entries: ContextMenuEntry[];
    };
    UIContextMenuHide: {};
    UICopyWidgets: {
        x: number;
        y: number;
        widgets: Widget[];
    };
    UIPasteWidgets: {
        x: number;
        y: number;
        slideId: string;
        widgets: Widget[];
    };
}

export interface ContextMenuEntry {
    caption: string;
    actions: AppAction[];
}

export const uiInitialState: UIState = {
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
        case 'UISetCurrentSlide':
            return set(state, {
                currentSlide: action.slideId,
                selectedWidgets: []
            });
        case 'SlideNew':
            return set(state, {
                currentSlide: action.slide.id,
                selectedWidgets: []
            });
        case 'UIContextMenuShowAtPosition':
            return set(state, {
                contextMenu: set(state.contextMenu, {
                    position: set(state.contextMenu.position, {
                        top: action.top,
                        left: action.left
                    }),
                    visible: true
                })
            });
        case 'UIContextMenuSetTopic':
            return set(state, {
                contextMenu: set(state.contextMenu, {
                    entries: set(state.contextMenu.entries, {
                        [action.topic]: action.entries
                    })
                })
            });
        case 'UIContextMenuHide':
            return set(state, {
                contextMenu: set(state.contextMenu, {
                    visible: false,
                    entries: {}
                })
            });
        case 'UICopyWidgets':
            return set(state, {
                selectedWidgets: action.widgets.map(widget => widget.id),
                clipboard: action.widgets.map(widget => set(widget, {
                    id: Math.random().toString(),
                    x: widget.x - action.x,
                    y: widget.y - action.y
                }))
            });
    }
    return state;
}
