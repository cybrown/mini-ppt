import { Widget, widgetRepositoryReducer } from "../widget/index";
import { Reducer } from "redux";
import { AppAction } from "../app/index";
import { set } from "../util/index";
import { Slide } from "../slide/index";

export interface PresentationState {
    slides: { [slideId: string]: Slide; };
    slideOrder: string[];
}

export const presentationReducer: Reducer<PresentationState> = (state: PresentationState, action: AppAction) => {
    const newSlides: {
        [slideId: string]: {
            widgets: {
                [widgetId: string]: Widget;
            };
            widgetOrder: string[];
        };
    } = {};
    Object.keys(state.slides).map(slideId => {
        const slide = state.slides[slideId];
        newSlides[slideId] = set(slide, {
            widgets: widgetRepositoryReducer(state.slides[slideId].widgets, action)
        })
    });
    set(state, {
        slides: {}
    });
    return state;
}
