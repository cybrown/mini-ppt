import { createStore, Reducer } from "redux";
import { uiReducer } from "./ui";
import { widgetRepositoryReducer } from "./widget";
import { slideRepositoryReducer } from "./slide";
import { AppState, AppAction, create, Presentation } from "./app";
import { typedCombineReducers, set } from "./util/index";

const slideListeReducer: Reducer<string[]> = (slideList: string[] = [], action: AppAction): string[] => {
    switch (action.type) {
        case 'slide.new':
            return [...slideList, action.slide.id];
        case 'slide.remove':
            return slideList.filter(slideId => slideId !== action.slideId);
    }
    return slideList;
};

const presentationReducer: Reducer<Presentation> = typedCombineReducers({
    widgets: widgetRepositoryReducer,
    slides: slideRepositoryReducer,
    slideList: slideListeReducer
});

const appReducer: Reducer<AppState> = (state: AppState = {presentation: undefined, ui: undefined, history: []} as any, action: AppAction) => {
    if (action.type === 'state.set') {
        return action.state;
    }
    let newPresentation = presentationReducer(state.presentation, action);
    let newHistory = state.history;
    if (newPresentation === state.presentation) {
        if (action.type === 'ui.history.undo') {
            if (state.history.length > 0) {
                const offset = state.history[state.history.length - 1] === state.presentation ? 2 : 1;
                newPresentation = state.history[state.history.length - offset];
                newHistory = state.history.slice(0, state.history.length - offset);
            }
        }
    } else if ((action as any).history !== false && state.presentation != null) {
        newHistory = [...state.history, newPresentation];
    }
    return set(state, {
        presentation: newPresentation,
        ui: uiReducer(state.ui, action),
        history: newHistory
    });
}

export const store = createStore<AppState>(appReducer, (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__());

store.dispatch(create('slide.new', {
    slide: {
        id: Math.random().toString(),
        widgetsIds: []
    }
}));
