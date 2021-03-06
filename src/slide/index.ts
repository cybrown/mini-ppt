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
        case 'widget.new':
            return set(slides, {
                [action.slideId]: set(slides[action.slideId], {
                    widgetsIds: [...slides[action.slideId].widgetsIds, action.widget.id]
                })
            });
        case 'slide.new':
            return set(slides, {
                [action.slide.id]: set(slides[action.slide.id], action.slide)
            });
        case 'ui.clipboard.paste.widgets':
            const newSlides = Object.keys(slides).reduce((newSlides, slideId) => {
                newSlides[slideId] = set(slides[slideId], {
                    widgetsIds: slides[slideId].widgetsIds.filter(id => action.idsToRemove.indexOf(id) === -1)
                });
                return newSlides;
            }, {} as Dictionary<SlideRecord>);
            return set(newSlides, {
                [action.slideId]: set(slides[action.slideId], {
                    widgetsIds: [...slides[action.slideId].widgetsIds, ...action.widgets.map(widget => widget.id)]
                })
            });
        case 'widget.remove':
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

export function slideRecordToSlide(slideRecord: SlideRecord, widgets: Dictionary<Widget>): Slide {
    return {
        id: slideRecord.id,
        widgets: slideRecord.widgetsIds.map(widgetId => widgets[widgetId])
    }
}
