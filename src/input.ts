import { AppAction } from "./AppAction";

export interface InputActions {
    InputChangeAction: {
        value: string;
    };
}

export const inputReducer = (value: string, action: AppAction) => {
    switch (action.type) {
        case 'InputChangeAction':
            return action.value;
        case 'WidgetNewTextZone':
            return '';
    }
    return value;
};
