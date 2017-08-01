import { Widget } from "./widget";
import { Slide } from "./slide";

export interface State {
    data: {
        widgets: {[id: string]: Widget},
        slides: {[id: string]: Slide}
    };
    editor: {
        currentSlide: string;
    }
}
