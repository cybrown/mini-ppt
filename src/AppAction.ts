import { WidgetActions } from "./widget";

interface Actions extends WidgetActions {

}

type ActionsWithTypes = {
    [ActionType in keyof Actions]: {type: ActionType} & Actions[ActionType];
}

export type AppAction = ActionsWithTypes[keyof ActionsWithTypes];

export function create<Type extends keyof Actions>(type: Type, data: Actions[Type]): ActionsWithTypes[Type] {
    return { type, ...data as any }
}
