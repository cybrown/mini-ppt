import { set } from "../util";
import { Widget } from "../widget";
import { AppAction } from "../app";

export interface SlideActions {
    SlideNew: {
        slide: Slide;
    };
    SlideRemove: {
        slideId: string;
    };
}

export interface Slide {
    id: string;
    widgets: {[widgetId: string]: Widget};
    widgetOrder: string[];
}

interface SlideState {
    [slideId: string]: {
        id: string;
        widgets: {
            [widgetId: string]: Widget;
        };
        widgetOrder: string[];
    };
}

export const slideRepositoryReducer = (slides: SlideState, action: AppAction): SlideState => {
    switch (action.type) {
        case 'WidgetNew':
            return set(slides, {
                [action.slideId]: set(slides[action.slideId], {
                    widgetOrder: [...slides[action.slideId].widgetOrder, action.widget.id]
                })
            });
        case 'SlideNew':
            return set(slides, {
                [action.slide.id]: set(slides[action.slide.id], action.slide)
            });
        case 'UIPasteWidgets':
            return set(slides, {
                [action.slideId]: set(slides[action.slideId], {
                    widgetOrder: slides[action.slideId].widgetOrder.concat(action.widgets.map(w => w.id))
                })
            })
        case 'WidgetRemove':
            return set(slides, {
                [action.slideId]: set(slides[action.slideId], {
                    widgetOrder: slides[action.slideId].widgetOrder.filter(id => action.widgetIds.indexOf(id) === -1)
                })
            });
        case 'SlideRemove': {
            const newSlides = set(slides, {});
            delete newSlides[action.slideId];
            return newSlides;
        }
    }
    return slides;
}
