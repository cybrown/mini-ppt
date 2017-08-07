import * as React from 'react';
import { connect } from 'react-redux';
import { selectedWidgets } from "../widget";
import { Dispatch } from "redux";
import { AppBar } from "material-ui";
import { AppToolBar } from "../ui/components/AppToolBar";
import { SlideList } from "../ui/components/SlideList";
import { Editor } from "../ui/components/Editor";
import { RightPanel } from "../ui/components/RightPanel";
import { ChangeTextDialog } from "../ui/components/ChangeTextDialog";
import { AppState, AppAction, create } from "./index";

export const App = connect((state: AppState) => ({
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
    <div style={{display: 'flex', height: '100vh', flexDirection: 'column'}}>
        <AppBar title="Mini PPT app" />
        <AppToolBar />
        <div style={{position: 'relative', flexGrow: 1}}>
            <SlideList />
            <Editor />
            <RightPanel widget={props.selectedWidgets.length === 1 ? props.selectedWidgets[0] : undefined}
                        onChangeFontSizeWidget={fontSize => props.onChangeFontSizeWidget(props.selectedWidgets[0].id, fontSize)} />
        </div>
        { props.showChangeTextPopup ? <ChangeTextDialog /> : null}
    </div>
));

export default App;
