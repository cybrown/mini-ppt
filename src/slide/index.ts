import { set } from "../util";
import { Widget } from "../widget";
import { AppState, AppAction } from "../app";

export interface SlideActions {
    SlideNew: {
        slide: SlideRecord;
    };
}

export interface SlideRecord {
    id: string;
    widgetsIds: string[];
}

export interface Slide {
    id: string;
    widgets: Widget[];
}

export const slideRepositoryReducer = (slides: AppState['data']['slides'], action: AppAction): AppState['data']['slides'] => {
    switch (action.type) {
        case 'WidgetNew':
            return set(slides, {
                [action.slideId]: set(slides[action.slideId], {
                    widgetsIds: [...slides[action.slideId].widgetsIds, action.widget.id]
                })
            });
        case 'SlideNew':
            return set(slides, {
                [action.slide.id]: set(slides[action.slide.id], action.slide)
            });
    }
    return slides;
}
