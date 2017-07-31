import { Widget } from "./widget";

export interface State {
    widgets: string[];
    data: {
        widgets: {[id: string]: Widget}
    };
}
