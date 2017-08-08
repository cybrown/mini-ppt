import * as React from 'react';
import { connect } from 'react-redux';
import { selectedWidgets, Widget } from "../widget";
import { Dispatch } from "redux";
import { AppBar, Popover } from "material-ui";
import { AppToolBar } from "../ui/components/AppToolBar";
import { SlideList } from "../ui/components/SlideList";
import { Editor } from "../ui/components/Editor";
import { RightPanel } from "../ui/components/RightPanel";
import { ChangeTextDialog } from "../ui/components/ChangeTextDialog";
import { AppState, AppAction, create } from "./index";
import * as ReactDOM from "react-dom";
import { ContextMenu } from "../ui/components/ContextMenu";

class AppComponent extends React.Component<{
    selectedWidgets: Widget[];
    showChangeTextPopup: boolean;
    currentWidgetText: string;
    contextMenuPosition: {top: number; left: number;};
    showContextMenu: boolean;
    onChangeFontSizeWidget: (widgets: Widget[], fontSize: number) => any;
    onCancelChangeText: () => any;
    changeCurrentWidgetText: (text: string) => any;
    onSubmitChangeText: (widgetId: string, text: string) => any;
    onChangeOpacity: (widgets: Widget[], opacity: number) => any;
    showContextMenuAtPosition: (top: number, left: number) => any;
    hideContextMenu: () => any;
}> {

    contextMenuElement: Element;

    contextMenuListener: EventListener = (event: PointerEvent) => {
        this.props.showContextMenuAtPosition(event.clientY, event.clientX);
        event.preventDefault();
        event.stopPropagation();
    };

    clickListener: EventListener = () => this.props.hideContextMenu();

    componentDidMount() {
        document.addEventListener('contextmenu', this.contextMenuListener);
        document.addEventListener('click', this.clickListener);
    }

    componentDidUnmout() {
        document.removeEventListener('contextmenu', this.contextMenuListener);
        document.removeEventListener('click', this.clickListener);
    }

    render() {
        const props = this.props;
        return (
            <div style={{display: 'flex', height: '100vh', flexDirection: 'column'}}
                 onContextMenuCapture={this.props.hideContextMenu}>
                <div ref={el => el && (this.contextMenuElement = ReactDOM.findDOMNode(el))} style={{position: 'fixed', top: props.contextMenuPosition.top + 'px', left: props.contextMenuPosition.left + 'px'}}></div>
                <Popover open={this.props.showContextMenu} anchorEl={this.contextMenuElement} useLayerForClickAway={false}>
                    <ContextMenu />
                </Popover>
                <AppBar title="Mini PPT app" />
                <AppToolBar />
                <div style={{position: 'relative', flexGrow: 1}}>
                    <SlideList />
                    <Editor />
                    <RightPanel widgets={props.selectedWidgets}
                                onChangeFontSizeWidget={fontSize => props.onChangeFontSizeWidget(props.selectedWidgets, fontSize)}
                                onChangeOpacity={opacity => props.onChangeOpacity(props.selectedWidgets, opacity)} />
                </div>
                { props.showChangeTextPopup ? <ChangeTextDialog /> : null}
            </div>
        )
    }
}

export const App = connect((state: AppState) => ({
    selectedWidgets: selectedWidgets(state),
    showChangeTextPopup: state.ui.showChangeTextPopup,
    currentWidgetText: state.ui.currentWidgetText,
    contextMenuPosition: state.ui.contextMenu.position,
    showContextMenu: state.ui.contextMenu.visible && Object.keys(state.ui.contextMenu.entries).length > 0
}), (dispatch: Dispatch<AppAction>) => ({
    onChangeFontSizeWidget: (widgets: Widget[], fontSize: number) => widgets.forEach(widget => dispatch(create('WidgetTextZoneSetFontSize', {
        widgetId: widget.id, fontSize
    }))),
    onCancelChangeText: () => dispatch(create('UIChangeTextPopupSetVisibility', {visible: false})),
    changeCurrentWidgetText: (text: string) => dispatch(create('UIChangeWidgetText', {text})),
    onSubmitChangeText: (widgetId: string, text: string) => {
        dispatch(create('WidgetTextZoneSetText', {widgetId, text}));
        dispatch(create('UIChangeTextPopupSetVisibility', {visible: false}));
    },
    onChangeOpacity: (widgets: Widget[], opacity: number) => widgets.forEach(widget => dispatch(create('WidgetSetOpacity', { widgetId: widget.id, opacity }))),
    showContextMenuAtPosition: (top: number, left: number) => dispatch(create('UIContextMenuShowAtPosition', { top, left })),
    hideContextMenu: () => dispatch(create('UIContextMenuHide', {}))
}))(AppComponent);

export default App;
