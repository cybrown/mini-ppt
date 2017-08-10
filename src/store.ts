import { createStore, Reducer } from "redux";
import { uiReducer } from "./ui";
import { widgetRepositoryReducer } from "./widget";
import { slideRepositoryReducer } from "./slide";
import { AppState, AppAction, create, Presentation } from "./app";
import { typedCombineReducers, set } from "./util/index";

const slideId = Math.random().toString();

const slideListeReducer: Reducer<string[]> = (slideList: string[] = [], action: AppAction): string[] => {
    switch (action.type) {
        case 'SlideNew':
            return [...slideList, action.slide.id];
        case 'SlideRemove':
            return slideList.filter(slideId => slideId !== action.slideId);
    }
    return slideList;
};

const presentationReducer: Reducer<Presentation> = typedCombineReducers({
    widgets: widgetRepositoryReducer,
    slides: slideRepositoryReducer,
    slideList: slideListeReducer
});

const appReducer = (state: AppState = {presentation: undefined, ui: undefined, history: []} as any, action: AppAction) => {
    let newPresentation = presentationReducer(state.presentation, action);
    let newHistory = state.history;
    if (newPresentation === state.presentation) {
        if (action.type === 'UIUndo') {
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

store.dispatch(create('SlideNew', {
    slide: {
        id: slideId,
        widgetsIds: []
    }
}));

store.dispatch(create('UISetCurrentSlide', { slideId }));
