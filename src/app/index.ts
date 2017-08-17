import { WidgetActions } from "../widget";
import { SlideActions } from "../slide";
import { UIActions } from "../ui";
import { Widget } from "../widget";
import { SlideRecord } from "../slide";
import { UIState } from "../ui";
import { Dictionary } from "../util/index";

interface Actions extends WidgetActions, UIActions, SlideActions {
    'state.set': {
        state: AppState;
    };
}

type ActionsWithTypes = {
    [ActionType in keyof Actions]: {type: ActionType} & Actions[ActionType];
};

export type AppAction = ActionsWithTypes[keyof ActionsWithTypes];

export function create<Type extends keyof Actions>(type: Type, data: Actions[Type]): ActionsWithTypes[Type] {
    return { type, ...data as any }
}

export interface Presentation {
    widgets: Dictionary<Widget>;
    slides: Dictionary<SlideRecord>;
    slideList: string[];
}

export interface AppState {
    presentation: Presentation;
    ui: UIState;
    history: Presentation[];
}
