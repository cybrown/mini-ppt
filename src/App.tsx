import * as React from 'react';
import { connect } from 'react-redux';
import { State } from "./State";
import { widgetsSelector, currentSlide, Widget, selectedWidgets, WidgetTextZone } from "./widget";
import { AppAction, create } from "./AppAction";
import { Dispatch } from "redux";
import { SlideEditor, Slide } from "./slide";
import { AppBar, Toolbar, ToolbarGroup, IconButton, Paper, TextField, Dialog, FlatButton, FontIcon, Popover } from "material-ui";
import { SketchPicker } from "react-color";
import * as ReactDOM from "react-dom";
import { rgbaToString } from "./util";

const Editor: React.SFC<{
    slide: Slide;
    onMoveWidget: (id: string, x: number, y: number) => void;
    onResizeWidget: (id: string, width: number, height: number) => void;
    selectedWidgets: Widget[];
    onSelectWidget: (widgetId: string) => void;
    onWidgetUnselect: () => void;
    onStartChangeText: (widgetId: string, text: string) => void;
}> = (props) => (
    <div style={{
        paddingTop: '100px'
    }}>
        <Paper zDepth={2} style={{width: '500px', height: '500px', marginLeft: 'auto', marginRight: 'auto'}} onClick={props.onWidgetUnselect}>
            <SlideEditor onSelectWidget={props.onSelectWidget}
                         slide={props.slide}
                         onMoveWidget={props.onMoveWidget}
                         onResizeWidget={props.onResizeWidget}
                         selectedWidgets={props.selectedWidgets}
                         onStartChangeText={props.onStartChangeText} />
        </Paper>
    </div>
)

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

const RightPanel: React.SFC<{
    widget?: Widget;
    onChangeFontSizeWidget: (fontSize: number) => void;
}> = ({widget, onChangeFontSizeWidget}) => (
    widget ? (
        <Paper style={{position: 'absolute', right: 0, top: 0, width: '218px'}}>
            <PropertiesPanel widget={widget} onChangeFontSizeWidget={onChangeFontSizeWidget} />
        </Paper>
    ) : null
);

let anchorForColorPicker: any;  // TODO: find another solution to store the color picker's anchor

const App = connect((state: State) => ({
    widgets: widgetsSelector(state),
    slide: currentSlide(state),
    selectedWidgets: selectedWidgets(state),
    showChangeTextPopup: state.ui.showChangeTextPopup,
    currentWidgetText: state.ui.currentWidgetText,
    currentColor: state.ui.currentColor,
    showColorPicker: state.ui.showColorPicker
}), (dispatch: Dispatch<AppAction>) => ({
    onMoveWidget: (id: string, x: number, y: number) => dispatch(create('WidgetMoveAction', {id, x, y})),
    onResizeWidget: (id: string, width: number, height: number) => dispatch(create('WidgetResizeAction', {id, width, height})),
    onNewTextZoneClick: (slideId: string) => dispatch(create('WidgetNewTextZone', {
        slideId,
        widgetId: Math.random().toString(),
        x: 250 - 100 / 2,
        y: 250 - 20 / 2,
        width: 100,
        height: 20
    })),
    onNewRectangle: (slideId: string, color: string) => dispatch(create('WidgetNewRectangle', {
        slideId,
        widgetId: Math.random().toString(),
        x: 250 - 40 / 2,
        y: 250 - 40 / 2,
        width: 40,
        height: 40,
        color
    })),
    onSelectWidget: (widget: Widget) => dispatch(create('UIWidgetSelect', {
        widget
    })),
    onWidgetUnselect: () => dispatch(create('UIWidgetUnselect', {})),
    onChangeColorWidget: (widgetId: string | null, color: string) => {
        if (widgetId) {
            dispatch(create('WidgetChangeColor', { widgetId, color }));
        }
        dispatch(create('UIChangeCurrentColor', {color}));
    ;},
    onChangeFontSizeWidget: (widgetId: string, fontSize: number) => dispatch(create('WidgetChangeFontSize', {
        widgetId, fontSize
    })),
    onStartChangeText: (widgetId: string, text: string) => dispatch(create('UIShowChangeTextPopup', {widgetId, text})),
    onCancelChangeText: () => dispatch(create('UIHideChangeTextPopup', {})),
    changeCurrentWidgetText: (text: string) => dispatch(create('UIChangeWidgetText', {text})),
    onSubmitChangeText: (widgetId: string, text: string) => {
        dispatch(create('WidgetChangeText', {widgetId, text}));
        dispatch(create('UIHideChangeTextPopup', {}));
    },
    onSetColorPickerisibility: (visible: boolean) => dispatch(create('UIChangeColorPickerVisibility', {visible}))
}))(props => (
    <div>
        <AppBar title="Mini PPT app" />
        <Toolbar>
            <ToolbarGroup firstChild={true}>
                <IconButton iconClassName="mppt-icon mppt-icon-text" onClick={() => props.onNewTextZoneClick(props.slide.id)} />
                <IconButton iconClassName="mppt-icon mppt-icon-rectangle" onClick={() => props.onNewRectangle(props.slide.id, props.currentColor)} />
                <IconButton ref={el => el && (anchorForColorPicker = ReactDOM.findDOMNode(el))} onClick={() => props.onSetColorPickerisibility(!props.showColorPicker)}>
                    <FontIcon color={props.currentColor} className="mppt-icon mppt-icon-bucket" />
                </IconButton>
                <Popover open={props.showColorPicker}
                         anchorEl={anchorForColorPicker}
                         anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                         targetOrigin={{horizontal: 'left', vertical: 'top'}}
                         useLayerForClickAway={false}>
            <SketchPicker color={props.currentColor} onChange={color => props.onChangeColorWidget(props.selectedWidgets[0] ? props.selectedWidgets[0].id : null, rgbaToString(color.rgb))} />
        </Popover>
            </ToolbarGroup>
        </Toolbar>
        <div style={{position: 'relative'}}>
            <Editor slide={props.slide}
                    onMoveWidget={props.onMoveWidget}
                    onResizeWidget={props.onResizeWidget}
                    selectedWidgets={props.selectedWidgets}
                    onSelectWidget={widgetId => props.onSelectWidget(props.widgets.filter(widget => widget.id === widgetId)[0])}
                    onWidgetUnselect={props.onWidgetUnselect}
                    onStartChangeText={props.onStartChangeText} />
            <RightPanel widget={props.selectedWidgets.length === 1 ? props.selectedWidgets[0] : undefined}
                        onChangeFontSizeWidget={fontSize => props.onChangeFontSizeWidget(props.selectedWidgets[0].id, fontSize)} />
        </div>
        { props.showChangeTextPopup ? (
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
        ) : null}
    </div>
));

export default App;
