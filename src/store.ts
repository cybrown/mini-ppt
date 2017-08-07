import { createStore, Reducer } from "redux";
import { uiInitialState, uiReducer } from "./ui";
import { set } from "./util";
import { widgetRepositoryReducer } from "./widget";
import { slideRepositoryReducer } from "./slide";
import { AppState, AppAction, create } from "./app";

const slideId = Math.random().toString();

const initialState: AppState = {
    data: {
        widgets: {},
        slides: {}
    },
    ui: uiInitialState
};

const appReducer: Reducer<AppState> = (state = initialState, action: AppAction) => (
    set(state, {
        data: set(state.data, {
            widgets: widgetRepositoryReducer(state.data.widgets, action),
            slides: slideRepositoryReducer(state.data.slides, action)
        }),
        ui: uiReducer(state.ui, action)
    })
);

export const store = createStore<AppState>(appReducer, (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__());

store.dispatch(create('SlideNew', {
    slide: {
        id: slideId,
        widgetsIds: []
    }
}));

store.dispatch(create('UISetCurrentSlide', { slideId }));
