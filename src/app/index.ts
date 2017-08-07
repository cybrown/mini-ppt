import { WidgetActions } from "../widget";
import { SlideActions } from "../slide";
import { UIActions } from "../ui";
import { Widget } from "../widget";
import { SlideRecord } from "../slide";
import { UIState } from "../ui";

interface Actions extends WidgetActions, UIActions, SlideActions { }

type ActionsWithTypes = {
    [ActionType in keyof Actions]: {type: ActionType} & Actions[ActionType];
};

export type AppAction = ActionsWithTypes[keyof ActionsWithTypes];

export function create<Type extends keyof Actions>(type: Type, data: Actions[Type]): ActionsWithTypes[Type] {
    return { type, ...data as any }
}

export interface AppState {
    data: {
        widgets: {[id: string]: Widget},
        slides: {[id: string]: SlideRecord}
    };
    ui: UIState;
}