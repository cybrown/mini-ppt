import { createStore, Reducer } from "redux";
import { uiReducer } from "./ui";
import { widgetRepositoryReducer } from "./widget";
import { slideRepositoryReducer } from "./slide";
import { AppState, AppAction, create, Presentation } from "./app";
import { typedCombineReducers } from "./util/index";

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

const appReducer = typedCombineReducers({
    presentation: presentationReducer,
    ui: uiReducer
});

export const store = createStore<AppState>(appReducer, (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__());

store.dispatch(create('SlideNew', {
    slide: {
        id: slideId,
        widgetsIds: []
    }
}));

store.dispatch(create('UISetCurrentSlide', { slideId }));
