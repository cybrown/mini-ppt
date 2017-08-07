import { AppAction, create } from "../AppAction";
import { Widget, currentSlide, selectedWidgets, WidgetTextZone, widgetsSelector, createTextZoneWidget, createRectangleWidget } from "../widget";
import { connect, Dispatch } from "react-redux";
import { AppState } from "../AppState";
import { Toolbar, ToolbarGroup, IconButton, FontIcon, Popover, TextField, Paper, Dialog, FlatButton } from "material-ui";
import { SketchPicker } from "react-color";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { rgbaToString } from "../util";
import { SlideEditor, SlideRenderer } from "../slide/components";

let anchorForBackgroundColorPicker: any;  // TODO: find another solution to store the color picker's anchor

export const AppToolBar = connect((state: AppState) => ({
    currentBackgroundColor: state.ui.currentBackgroundColor,
    slide: currentSlide(state),
    showBackgroundColorPicker: state.ui.showBackgroundColorPicker,
    selectedWidgets: selectedWidgets(state),
}), (dispatch: Dispatch<AppAction>) => ({
    onNewTextZoneClick: (slideId: string, backgroundColor: string) => dispatch(create('WidgetNew', {
        slideId,
        widget: createTextZoneWidget(backgroundColor)
    })),
    onNewRectangle: (slideId: string, backgroundColor: string) => dispatch(create('WidgetNew', {
        slideId,
        widget: createRectangleWidget(backgroundColor),
    })),
    onChangeColorWidget: (widgetId: string | null, backgroundColor: string) => {
        if (widgetId) {
            dispatch(create('WidgetUpdate', { widgetId, backgroundColor }));
        }
        dispatch(create('UIChangeCurrentBackgroundColor', {backgroundColor}));
    },
    onSetColorPickerisibility: (visible: boolean) => dispatch(create('UIChangeBackgroundColorPickerVisibility', {visible})),
    onCreateNewSlide: () => dispatch(create('SlideNew', {
        slide: {
            id: Math.random().toString(),
            widgetsIds: []
        }
    }))
}))(props => (
    <Toolbar>
        <ToolbarGroup firstChild={true}>
            <IconButton iconClassName="mppt-icon mppt-icon-plus" onClick={props.onCreateNewSlide} />
        </ToolbarGroup>
        <ToolbarGroup>
            <IconButton iconClassName="mppt-icon mppt-icon-text"
                        onClick={() => props.slide && props.onNewTextZoneClick(props.slide.id, props.currentBackgroundColor)} />
            <IconButton iconClassName="mppt-icon mppt-icon-rectangle"
                        onClick={() => props.slide && props.onNewRectangle(props.slide.id, props.currentBackgroundColor)} />
            <IconButton ref={el => el && (anchorForBackgroundColorPicker = ReactDOM.findDOMNode(el))}
                        onClick={() => props.onSetColorPickerisibility(!props.showBackgroundColorPicker)}>
                <FontIcon color={props.currentBackgroundColor} className="mppt-icon mppt-icon-bucket" />
            </IconButton>
            <Popover open={props.showBackgroundColorPicker}
                     anchorEl={anchorForBackgroundColorPicker}
                     anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                     targetOrigin={{horizontal: 'left', vertical: 'top'}}
                     useLayerForClickAway={false}>
                <SketchPicker color={props.currentBackgroundColor}
                              onChange={color => props.onChangeColorWidget(props.selectedWidgets[0] ? props.selectedWidgets[0].id : null, rgbaToString(color.rgb))} />
            </Popover>
        </ToolbarGroup>
        <ToolbarGroup>
        </ToolbarGroup>
    </Toolbar>
));

const PropertiesPanel: React.SFC<{
    widget: Widget;
    onChangeFontSizeWidget: (fontSize: number) => void;
}> = ({widget, onChangeFontSizeWidget}) => {
    switch (widget.kind) {
        case 'rectangle':
            return null;
        case 'text':
            return <TextPropertiesPanel widget={widget} onChangeFontSizeWidget={onChangeFontSizeWidget} />;
    }
}

const TextPropertiesPanel: React.SFC<{
    widget: WidgetTextZone;
    onChangeFontSizeWidget: (fontSize: number) => void;
}> = ({widget, onChangeFontSizeWidget}) => (
    <div>
        <TextField floatingLabelText="Font size" value={widget.fontSize} onChange={e => onChangeFontSizeWidget(Number((e.target as any).value))} />
    </div>
)

export const RightPanel: React.SFC<{
    widget?: Widget;
    onChangeFontSizeWidget: (fontSize: number) => void;
}> = ({widget, onChangeFontSizeWidget}) => (
    widget ? (
        <Paper style={{position: 'absolute', right: 0, top: 0, width: '218px'}}>
            <PropertiesPanel widget={widget} onChangeFontSizeWidget={onChangeFontSizeWidget} />
        </Paper>
    ) : null
);

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

export const SlideList = connect((state: AppState) => ({
    slides: Object.keys(state.data.slides).map(id => state.data.slides[id]).map(slideRecord => ({
        id: slideRecord.id,
        widgets: slideRecord.widgetsIds.map(widgetId => state.data.widgets[widgetId])
    })),
    currentSlide: state.ui.currentSlide
}), (dispatch: Dispatch<AppAction>) => ({
    onSetCurrentSlide: (slideId: string) => dispatch(create('UISetCurrentSlide', { slideId }))
}))(props => (
    <Paper style={{backgroundColor: 'lightgrey', position: 'absolute', top: 0, bottom: 0, width: '200px', overflow: 'auto'}} zDepth={2}>
        {props.slides.map(slide => (
            <div key={slide.id} style={{width: '200px', height: '200px', padding: '35.25px'}} >
                <Paper zDepth={slide.id === props.currentSlide ? 3 : 1} style={{width: '125px', height: '125px'}} onClick={() => props.onSetCurrentSlide(slide.id)}>
                    <div style={{transform: 'scale(0.25, 0.25)', transformOrigin: 'top left', pointerEvents: 'none'}}>
                        <SlideRenderer slide={slide} />
                    </div>
                </Paper>
            </div>
        ))}
    </Paper>
));
