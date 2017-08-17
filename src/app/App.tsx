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
import { Slide, slideRecordToSlide } from "../slide/index";
import { FullScreenPresenter } from "../ui/components/FullScreenPresenter";
import RemoteFullScreenPresenter from '../ui/components/RemoteFullScreenPresenter';

class AppComponent extends React.Component<{
    selectedWidgets: Widget[];
    showChangeTextPopup: boolean;
    currentWidgetText: string;
    contextMenuPosition: {top: number; left: number;};
    showContextMenu: boolean;
    presentationMode: boolean;
    slideToDisplay: Slide | null;
    slideIndex: number | null;
    numberSlides: number;
    onChangeFontSizeWidget: (widgets: Widget[], fontSize: number) => any;
    onCancelChangeText: () => any;
    changeCurrentWidgetText: (text: string) => any;
    onSubmitChangeText: (widgetId: string, text: string) => any;
    onChangeOpacity: (widgets: Widget[], opacity: number, final: boolean) => any;
    showContextMenuAtPosition: (top: number, left: number) => any;
    hideContextMenu: () => any;
    onExitPresenterMode: () => any;
    onChangeSlide: (slideIndex: number) => any;
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
            <div>
                { (props.presentationMode && props.slideToDisplay && props.slideIndex != null)  ? (
                    <FullScreenPresenter
                        slideToDisplay={props.slideToDisplay}
                        onExitPresenterMode={props.onExitPresenterMode}
                        slideIndex={props.slideIndex}
                        numberSlides={props.numberSlides}
                        onChangeSlide={props.onChangeSlide}
                    />
                ) : (
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
                                        onChangeOpacity={(opacity, final) => props.onChangeOpacity(props.selectedWidgets, opacity, final)} />
                        </div>
                        { props.showChangeTextPopup ? <ChangeTextDialog /> : null}
                    </div>
                )}
                <RemoteFullScreenPresenter />
            </div>
        )
    }
}

export const App = connect((state: AppState) => ({
    selectedWidgets: selectedWidgets(state),
    showChangeTextPopup: state.ui.showChangeTextPopup,
    currentWidgetText: state.ui.currentWidgetText,
    contextMenuPosition: state.ui.contextMenu.position,
    showContextMenu: state.ui.contextMenu.visible && Object.keys(state.ui.contextMenu.entries).length > 0,
    presentationMode: state.ui.playmode != null,
    slideIndex: state.ui.playmode,
    slideToDisplay: state.ui.playmode != null ? slideRecordToSlide(state.presentation.slides[state.presentation.slideList[state.ui.playmode]], state.presentation.widgets) : null,
    numberSlides: state.presentation.slideList.length
}), (dispatch: Dispatch<AppAction>) => ({
    onChangeFontSizeWidget: (widgets: Widget[], fontSize: number) => dispatch(create('widget.textZone.set.bulk.fontSize', {
        widgetIds: widgets.map(w => w.id), fontSize
    })),
    onCancelChangeText: () => dispatch(create('ui.popup.changeText.set.visibility', {visible: false})),
    changeCurrentWidgetText: (text: string) => dispatch(create('ui.set.widgetText', {text})),
    onSubmitChangeText: (widgetId: string, text: string) => {
        dispatch(create('widget.textZone.set.text', {widgetId, text}));
        dispatch(create('ui.popup.changeText.set.visibility', {visible: false}));
    },
    onChangeOpacity: (widgets: Widget[], opacity: number, final: boolean) => dispatch(create('widget.set.bulk.opacity', { widgetIds: widgets.map(w => w.id), opacity, history: final })),
    showContextMenuAtPosition: (top: number, left: number) => dispatch(create('ui.contextMenu.showAtPosition', { top, left })),
    hideContextMenu: () => dispatch(create('ui.contextMenu.hide', {})),
    onExitPresenterMode: () => dispatch(create('ui.presentation.stop', {})),
    onChangeSlide: (slideIndex: number) => dispatch(create('ui.presentation.slide.change', { slideIndex }))
}))(AppComponent);

export default App;
