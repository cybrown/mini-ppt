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
    onMoveWidgets: (widgets: Widget[], x: number, y: number, history: boolean) => any;
    onResizeWidget: (widget: Widget, deltaX: number, deltaY: number, width: number, height: number, history: boolean) => any;
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
                                     onMoveSelectedWidgets={(x: number, y: number, isEnd: boolean) => {
                                         props.onMoveWidgets(props.widgets.filter(w => props.selectedWidgets.indexOf(w) !== -1), x, y, isEnd);
                                     }}
                                     onResizeWidget={(widgetId, deltaX, deltaY, width, height, history) => props.onResizeWidget(props.widgets.filter(widget => widget.id === widgetId)[0], deltaX, deltaY, width, height, history)}
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
    onMoveWidgets: (widgets: Widget[], x: number, y: number, history) => {
        dispatch(create('widget.set.bulk.position', {
            widgetProperties: widgets.map(widget => ({
                widgetId: widget.id,
                x: widget.x + x,
                y: widget.y + y
            })),
            history
        }))
    },
    onResizeWidget: (widget: Widget, deltaX: number, deltaY: number, width: number, height: number, history) => dispatch(create('widget.set.dimensionsAndPosition', {widgetId: widget.id, x: widget.x + deltaX, y: widget.y + deltaY, width, height, history})),
    onWidgetUnselect: () => dispatch(create('ui.selection.widgets.replace', {widgets: []})),
    onStartChangeText: (text: string) => dispatch(create('ui.popup.changeText.set.visibility', {visible: true, text})),
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
        dispatch(create('ui.selection.widgets.replace', {
            widgets: newSelection
        }))
    },
    setContextMenuTopic: (x: number, y: number, selectedWidgets: Widget[], widgetsToPaste: Widget[], slideId: string) => {
        dispatch(create('ui.contextMenu.topic.add', {
            topic: 'editor',
            entries: [{
                caption: 'Copy',
                actions: [create('ui.clipboard.copy.widgets', {
                    x, y,
                    widgets: selectedWidgets
                })]
            }, {
                caption: 'Paste',
                actions: [create('ui.clipboard.paste.widgets', {
                    slideId, x, y,
                    widgets: widgetsToPaste
                }), create('ui.clipboard.copy.widgets', {
                    x: 0,
                    y: 0,
                    widgets: widgetsToPaste
                })]
            }, {
                caption: 'Remove',
                actions: [create('widget.remove', {
                    slideId,
                    widgetIds: selectedWidgets.map(w => w.id)
                })]
            }]
        }))
    }
}))(EditorComponent);
