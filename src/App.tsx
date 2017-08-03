import * as React from 'react';
import { connect } from 'react-redux';
import { State } from "./State";
import { selectedWidgets } from "./widget";
import { AppAction, create } from "./AppAction";
import { Dispatch } from "redux";
import { AppBar } from "material-ui";
import { AppToolBar, RightPanel, Editor, ChangeTextDialog } from "./ui";

const App = connect((state: State) => ({
    selectedWidgets: selectedWidgets(state),
    showChangeTextPopup: state.ui.showChangeTextPopup,
    currentWidgetText: state.ui.currentWidgetText,
}), (dispatch: Dispatch<AppAction>) => ({
    onChangeFontSizeWidget: (widgetId: string, fontSize: number) => dispatch(create('WidgetUpdateTextZone', {
        widgetId, fontSize
    })),
    onCancelChangeText: () => dispatch(create('UIChangeTextPopupSetVisibility', {visible: false})),
    changeCurrentWidgetText: (text: string) => dispatch(create('UIChangeWidgetText', {text})),
    onSubmitChangeText: (widgetId: string, text: string) => {
        dispatch(create('WidgetUpdateTextZone', {widgetId, text}));
        dispatch(create('UIChangeTextPopupSetVisibility', {visible: false}));
    },
}))(props => (
    <div>
        <AppBar title="Mini PPT app" />
        <AppToolBar />
        <div style={{position: 'relative'}}>
            <Editor />
            <RightPanel widget={props.selectedWidgets.length === 1 ? props.selectedWidgets[0] : undefined}
                        onChangeFontSizeWidget={fontSize => props.onChangeFontSizeWidget(props.selectedWidgets[0].id, fontSize)} />
        </div>
        { props.showChangeTextPopup ? <ChangeTextDialog /> : null}
    </div>
));

export default App;
