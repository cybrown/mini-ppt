import { createStore, Reducer } from "redux";
import { uiInitialState, uiReducer } from "./ui";
import { set } from "./util";
import { AppState, AppAction, create } from "./app";
import { presentationReducer } from "./presentation/index";

const slideId = Math.random().toString();

const initialState: AppState = {
    presentation: {
        slideOrder: [],
        slides: {}
    },
    ui: uiInitialState
};

const appReducer: Reducer<AppState> = (state = initialState, action: AppAction) => (
    set(state, {
        presentation: presentationReducer(state.presentation, action),
        ui: uiReducer(state.ui, action)
    })
);

export const store = createStore<AppState>(appReducer, (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__());

store.dispatch(create('SlideNew', {
    slide: {
        id: slideId,
        widgetOrder: [],
        widgets: {}
    }
}));

store.dispatch(create('UISetCurrentSlide', { slideId }));
