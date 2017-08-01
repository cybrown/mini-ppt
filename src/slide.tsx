import { State } from "./State";
import { AppAction } from "./AppAction";
import { set } from "./util";

export interface Slide {
    id: string;
    widgetsIds: string[];
}

export const slideRepositoryReducer = (slides: State['data']['slides'], action: AppAction): State['data']['slides'] => {
    switch (action.type) {
        case 'WidgetNewRectangle':
        case 'WidgetNewTextZone':
            return set(slides, {
                [action.slideId]: set(slides[action.slideId], {
                    widgetsIds: [...slides[action.slideId].widgetsIds, action.widgetId]
                })
            });
    }
    return slides;
}
