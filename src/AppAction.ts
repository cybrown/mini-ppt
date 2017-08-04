import { WidgetActions } from "./widget";
import { SlideActions } from "./slide";
import { UIActions } from "./ui/ui-main";

interface Actions extends WidgetActions, UIActions, SlideActions { }

type ActionsWithTypes = {
    [ActionType in keyof Actions]: {type: ActionType} & Actions[ActionType];
}

export type AppAction = ActionsWithTypes[keyof ActionsWithTypes];

export function create<Type extends keyof Actions>(type: Type, data: Actions[Type]): ActionsWithTypes[Type] {
    return { type, ...data as any }
}
