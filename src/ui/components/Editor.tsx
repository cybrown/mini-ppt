import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { widgetsSelector, currentSlide, selectedWidgets, Widget } from "../../widget";
import { SlideEditor } from "../../slide/components/SlideEditor";
import { Paper } from "material-ui";
import { AppState, AppAction, create } from "../../app";

export const Editor = connect((state: AppState) => ({
    widgets: widgetsSelector(state),
    slide: currentSlide(state),
    selectedWidgets: selectedWidgets(state),
}), (dispatch: Dispatch<AppAction>) => ({
    onMoveWidget: (widgetId: string, x: number, y: number) => dispatch(create('WidgetUpdate', {widgetId, x, y})),
    onMoveWidgets: (widgets: Widget[], x: number, y: number) => {
        widgets.forEach(widget => dispatch(create('WidgetUpdate', {widgetId: widget.id, x: widget.x + x, y: widget.y + y})))
    },
    onResizeWidget: (widgetId: string, width: number, height: number) => dispatch(create('WidgetUpdate', {widgetId, width, height})),
    onWidgetUnselect: () => dispatch(create('UIWidgetReplaceSelection', {widgets: []})),
    onChangeFontSizeWidget: (widgetId: string, fontSize: number) => dispatch(create('WidgetUpdateTextZone', {
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
}))(props => (
    <div style={{
        paddingTop: '100px'
    }}>
        {props.slide !== null ? (
            <Paper zDepth={2} style={{width: '500px', height: '500px', marginLeft: 'auto', marginRight: 'auto'}} onClick={props.onWidgetUnselect}>
                <SlideEditor onSelectWidget={(widgetId, ctrl) => props.onSelectWidget(props.selectedWidgets, props.widgets.filter(widget => widget.id === widgetId)[0], ctrl)}
                             slide={props.slide}
                             onMoveWidget={(widgetId: string, x: number, y: number) => {
                                 widgetId;
                                 props.onMoveWidgets(props.widgets.filter(w => props.selectedWidgets.indexOf(w) !== -1), x, y);
                             }}
                             onResizeWidget={props.onResizeWidget}
                             selectedWidgets={props.selectedWidgets}
                             onStartChangeText={props.onStartChangeText} />
            </Paper>
        ) : null}
    </div>
));
