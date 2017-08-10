import { set, Dictionary } from "../util";
import { Widget } from "../widget";
import { AppAction } from "../app";

export interface SlideActions {
    'slide.new': {
        slide: SlideRecord;
    };
    'slide.remove': {
        slideId: string;
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

export const slideRepositoryReducer = (slides: Dictionary<SlideRecord> = {}, action: AppAction): Dictionary<SlideRecord> => {
    switch (action.type) {
        case 'WidgetNew':
            return set(slides, {
                [action.slideId]: set(slides[action.slideId], {
                    widgetsIds: [...slides[action.slideId].widgetsIds, action.widget.id]
                })
            });
        case 'slide.new':
            return set(slides, {
                [action.slide.id]: set(slides[action.slide.id], action.slide)
            });
        case 'UIPasteWidgets':
            return set(slides, {
                [action.slideId]: set(slides[action.slideId], {
                    widgetsIds: slides[action.slideId].widgetsIds.concat(action.widgets.map(widget => widget.id))
                })
            })
        case 'WidgetRemove':
            return set(slides, {
                [action.slideId]: set(slides[action.slideId], {
                    widgetsIds: slides[action.slideId].widgetsIds.filter(id => action.widgetIds.indexOf(id) === -1)
                })
            });
        case 'slide.remove': {
            const newSlides = set(slides, {});
            delete newSlides[action.slideId];
            return newSlides;
        }
    }
    return slides;
}
