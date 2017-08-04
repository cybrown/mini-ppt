import { Widget } from "./widget";
import { SlideRecord } from "./slide";
import { UIState } from "./ui/ui-main";

export interface State {
    data: {
        widgets: {[id: string]: Widget},
        slides: {[id: string]: SlideRecord}
    };
    ui: UIState;
}
