import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { selectedWidgets } from "../../widget";
import { Dialog, FlatButton, TextField } from "material-ui";
import { AppState, AppAction, create } from "../../app";

export const ChangeTextDialog = connect((state: AppState) => ({
    selectedWidgets: selectedWidgets(state),
    currentWidgetText: state.ui.currentWidgetText,
}), (dispatch: Dispatch<AppAction>) => ({
    onCancelChangeText: () => dispatch(create('UIChangeTextPopupSetVisibility', {visible: false})),
    changeCurrentWidgetText: (text: string) => dispatch(create('UIChangeWidgetText', {text})),
    onSubmitChangeText: (widgetId: string, text: string) => {
        dispatch(create('WidgetUpdateTextZone', {widgetId, text}));
        dispatch(create('UIChangeTextPopupSetVisibility', {visible: false}));
    },
}))(props =>
    <Dialog title="Change text"
            actions={[
                <FlatButton
                    label="Cancel"
                    primary={true}
                    onClick={props.onCancelChangeText}
                />,
                <FlatButton
                    label="Submit"
                    primary={true}
                    keyboardFocused={true}
                    onClick={() => props.onSubmitChangeText(props.selectedWidgets[0].id, props.currentWidgetText)}
                />,
            ]}
            modal={false}
            open={true}
            onRequestClose={() => null} >
        <TextField fullWidth value={props.currentWidgetText} onChange={e => props.changeCurrentWidgetText((e.target as any).value)} />
    </Dialog>
);
