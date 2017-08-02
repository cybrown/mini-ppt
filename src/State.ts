import { Widget } from "./widget";
import { SlideRecord } from "./slide";

export interface State {
    data: {
        widgets: {[id: string]: Widget},
        slides: {[id: string]: SlideRecord}
    };
    editor: {
        currentSlide: string;
        selectedWidgets: string[];
    }
}
