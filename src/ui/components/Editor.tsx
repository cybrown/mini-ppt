import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { widgetsSelector, currentSlide, selectedWidgets, Widget } from "../../widget";
import { SlideEditor } from "../../slide/components/SlideEditor";
import { Paper } from "material-ui";
import { AppState, AppAction, create } from "../../app";
import { Slide } from "../../slide/index";
import * as ReactDOM from "react-dom";

class EditorComponent extends React.Component<{
    slide: Slide;
    widgets: Widget[];
    selectedWidgets: Widget[];
    widgetsToPaste: Widget[];
    onMoveWidget: (widgetId: string, x: number, y: number) => any;
    onMoveWidgets: (widgets: Widget[], x: number, y: number) => any;
    onResizeWidget: (widgetId: string, width: number, height: number) => any;
    onChangeFontSizeWidget: (widgetId: string, fontSize: number) => any;
    onWidgetUnselect: () => any;
    onStartChangeText: (text: string) => any;
    onSelectWidget: (selectedWidgets: Widget[], widgetToSelect: Widget, addToSelection: boolean) => any;
    setContextMenuTopic: (x: number, y: number, selectedWidgets: Widget[], widgetsToPaste: Widget[], slideId: string) => any;
}> {

    editorElement: Element | null;

    render() {
        const props = this.props;
        const rect = this.editorElement ? this.editorElement.getBoundingClientRect() : null;
        return (
            <div style={{ paddingTop: '100px' }}>
                {props.slide !== null ? (
                    <Paper zDepth={2}
                        ref={el => el && (this.editorElement = ReactDOM.findDOMNode(el))}
                        style={{width: '500px', height: '500px', marginLeft: 'auto', marginRight: 'auto'}}
                        onClick={props.onWidgetUnselect}
                        onContextMenu={event => rect && (props.setContextMenuTopic(event.clientX - rect.left, event.clientY - rect.top, props.selectedWidgets, props.widgetsToPaste, props.slide.id))}>
                        <SlideEditor onSelectWidget={(widgetId, ctrl) => props.onSelectWidget(props.selectedWidgets, props.widgets.filter(widget => widget.id === widgetId)[0], ctrl)}
                                    slide={props.slide}
                                    onMoveWidget={(_: string, x: number, y: number) => {
                                        props.onMoveWidgets(props.widgets.filter(w => props.selectedWidgets.indexOf(w) !== -1), x, y);
                                    }}
                                    onResizeWidget={props.onResizeWidget}
                                    selectedWidgets={props.selectedWidgets}
                                    onStartChangeText={props.onStartChangeText} />
                    </Paper>
                ) : null}
            </div>
        );
    }
}

export const Editor = connect((state: AppState) => ({
    widgets: widgetsSelector(state),
    slide: currentSlide(state),
    selectedWidgets: selectedWidgets(state),
    widgetsToPaste: state.ui.clipboard
}), (dispatch: Dispatch<AppAction>) => ({
    onMoveWidget: (widgetId: string, x: number, y: number) => dispatch(create('WidgetSetPosition', {widgetId, x, y})),
    onMoveWidgets: (widgets: Widget[], x: number, y: number) => {
        widgets.forEach(widget => dispatch(create('WidgetSetPosition', {widgetId: widget.id, x: widget.x + x, y: widget.y + y})))
    },
    onResizeWidget: (widgetId: string, width: number, height: number) => dispatch(create('WidgetSetDimensions', {widgetId, width, height})),
    onWidgetUnselect: () => dispatch(create('UIWidgetReplaceSelection', {widgets: []})),
    onChangeFontSizeWidget: (widgetId: string, fontSize: number) => dispatch(create('WidgetTextZoneSetFontSize', {
        widgetId, fontSize
    })),
    onStartChangeText: (text: string) => dispatch(create('UIChangeTextPopupSetVisibility', {visible: true, text})),
    onSelectWidget: (selectedWidgets: Widget[], widgetToSelect: Widget, addToSelection: boolean) => {
        let newSelection: Widget[] | null;
        if (addToSelection) {
            const isAlreadySelected = selectedWidgets.filter(w => w.id === widgetToSelect.id).length > 0;
            if (isAlreadySelected) {
                newSelection = selectedWidgets.filter(w => w.id !== widgetToSelect.id);
            } else {
                newSelection = selectedWidgets.concat(widgetToSelect);
            }
        } else {
            newSelection = [widgetToSelect];
        }
        dispatch(create('UIWidgetReplaceSelection', {
            widgets: newSelection
        }))
    },
    setContextMenuTopic: (x: number, y: number, selectedWidgets: Widget[], widgetsToPaste: Widget[], slideId: string) => {
        dispatch(create('UIContextMenuSetTopic', {
            topic: 'editor',
            entries: [{
                caption: 'Copy',
                actions: [create('UICopyWidgets', {
                    x, y,
                    widgets: selectedWidgets
                })]
            }, {
                caption: 'Paste',
                actions: [create('UIPasteWidgets', {
                    slideId, x, y,
                    widgets: widgetsToPaste
                }), create('UICopyWidgets', {
                    x: 0,
                    y: 0,
                    widgets: widgetsToPaste
                })]
            }]
        }))
    }
}))(EditorComponent);
