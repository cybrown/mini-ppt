import { Widget } from "./widget";
import { SlideRecord } from "./slide";
import { UIState } from "./ui";

export interface State {
    data: {
        widgets: {[id: string]: Widget},
        slides: {[id: string]: SlideRecord}
    };
    ui: UIState;
}
