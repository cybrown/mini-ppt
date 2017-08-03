import { Reducer } from "redux";
import { AppAction, create } from "./AppAction";
import { set } from "./util";
import { Widget, currentSlide, selectedWidgets, WidgetTextZone, widgetsSelector } from "./widget";
import { connect, Dispatch } from "react-redux";
import { State } from "./State";
import { Toolbar, ToolbarGroup, IconButton, FontIcon, Popover, TextField, Paper, Dialog, FlatButton } from "material-ui";
import { SketchPicker } from "react-color";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { rgbaToString } from "./util";
import { SlideEditor } from "./slide";

export interface UIState {
    currentSlide: string;
    selectedWidgets: string[];
    showChangeTextPopup: boolean;
    currentWidgetText: string;
    currentBackgroundColor: string;
    showBackgroundColorPicker: boolean;
}

export interface UIActions {
    UIChangeTextPopupSetVisibility: {
        visible: boolean;
        text?: string;
    };
    UIChangeWidgetText: {
        text: string;
    };
    UIWidgetReplaceSelection: {
        widgets: Widget[];
    };
    UIChangeCurrentBackgroundColor: {
        backgroundColor: string;
    };
    UIChangeBackgroundColorPickerVisibility: {
        visible: boolean;
    };
}

export const uiInitialState: UIState = {
    currentSlide: 'toto',
    selectedWidgets: [],
    showChangeTextPopup: false,
    currentWidgetText: '',
    currentBackgroundColor: 'rgba(192,137,45,0.3)',
    showBackgroundColorPicker: false
};

export const uiReducer: Reducer<UIState> = (state: UIState, action: AppAction): UIState => {
    switch (action.type) {
        case 'UIWidgetReplaceSelection':
            return set(state, {
                selectedWidgets: action.widgets.map(w => w.id),
                showBackgroundColorPicker: false,
                currentBackgroundColor: action.widgets.length === 1 ? action.widgets[0].backgroundColor : state.currentBackgroundColor
            });
        case 'UIChangeWidgetText':
            return set(state, {
                showChangeTextPopup: true,
                currentWidgetText: action.text
            });
        case 'UIChangeTextPopupSetVisibility':
            return set(state, {
                showChangeTextPopup: action.visible,
                currentWidgetText: action.text ? action.text : state.currentWidgetText
            });
        case 'UIChangeCurrentBackgroundColor':
            return set(state, {
                currentBackgroundColor: action.backgroundColor
            });
        case 'WidgetNew':
            return set(state, {
                selectedWidgets: [action.widget.id]
            });
        case 'UIChangeBackgroundColorPickerVisibility':
            return set(state, {
                showBackgroundColorPicker: action.visible
            });
    }
    return state;
}

let anchorForBackgroundColorPicker: any;  // TODO: find another solution to store the color picker's anchor

export const AppToolBar = connect((state: State) => ({
    currentBackgroundColor: state.ui.currentBackgroundColor,
    slide: currentSlide(state),
    showBackgroundColorPicker: state.ui.showBackgroundColorPicker,
    selectedWidgets: selectedWidgets(state),
}), (dispatch: Dispatch<AppAction>) => ({
    onNewTextZoneClick: (slideId: string, backgroundColor: string) => dispatch(create('WidgetNew', {
        slideId,
        widget: {
            id: Math.random().toString(),
            x: 250 - 100 / 2,
            y: 250 - 20 / 2,
            width: 100,
            height: 20,
            backgroundColor,
            fontSize: 14,
            kind: 'text',
            text: 'Text'
        }
    })),
    onNewRectangle: (slideId: string, backgroundColor: string) => dispatch(create('WidgetNew', {
        slideId,
        widget: {
            id: Math.random().toString(),
            kind: 'rectangle',
            x: 250 - 40 / 2,
            y: 250 - 40 / 2,
            width: 40,
            height: 40,
            backgroundColor
        },
    })),
    onChangeColorWidget: (widgetId: string | null, backgroundColor: string) => {
        if (widgetId) {
            dispatch(create('WidgetUpdate', { widgetId, backgroundColor }));
        }
        dispatch(create('UIChangeCurrentBackgroundColor', {backgroundColor}));
    },
    onSetColorPickerisibility: (visible: boolean) => dispatch(create('UIChangeBackgroundColorPickerVisibility', {visible}))
}))(props => (
    <Toolbar>
        <ToolbarGroup firstChild={true}>
            <IconButton iconClassName="mppt-icon mppt-icon-text" onClick={() => props.onNewTextZoneClick(props.slide.id, props.currentBackgroundColor)} />
            <IconButton iconClassName="mppt-icon mppt-icon-rectangle" onClick={() => props.onNewRectangle(props.slide.id, props.currentBackgroundColor)} />
            <IconButton ref={el => el && (anchorForBackgroundColorPicker = ReactDOM.findDOMNode(el))} onClick={() => props.onSetColorPickerisibility(!props.showBackgroundColorPicker)}>
                <FontIcon color={props.currentBackgroundColor} className="mppt-icon mppt-icon-bucket" />
            </IconButton>
            <Popover open={props.showBackgroundColorPicker}
                        anchorEl={anchorForBackgroundColorPicker}
                        anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                        targetOrigin={{horizontal: 'left', vertical: 'top'}}
                        useLayerForClickAway={false}>
                <SketchPicker color={props.currentBackgroundColor} onChange={color => props.onChangeColorWidget(props.selectedWidgets[0] ? props.selectedWidgets[0].id : null, rgbaToString(color.rgb))} />
            </Popover>
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

export const Editor = connect((state: State) => ({
    widgets: widgetsSelector(state),
    slide: currentSlide(state),
    selectedWidgets: selectedWidgets(state),
}), (dispatch: Dispatch<AppAction>) => ({
    onMoveWidget: (widgetId: string, x: number, y: number) => dispatch(create('WidgetUpdate', {widgetId, x, y})),
    onResizeWidget: (widgetId: string, width: number, height: number) => dispatch(create('WidgetUpdate', {widgetId, width, height})),
    onWidgetUnselect: () => dispatch(create('UIWidgetReplaceSelection', {widgets: []})),
    onChangeFontSizeWidget: (widgetId: string, fontSize: number) => dispatch(create('WidgetUpdateTextZone', {
        widgetId, fontSize
    })),
    onStartChangeText: (text: string) => dispatch(create('UIChangeTextPopupSetVisibility', {visible: true, text})),
    onSelectWidget: (widget: Widget) => dispatch(create('UIWidgetReplaceSelection', {
        widgets: [widget]
    })),
}))(props => (
    <div style={{
        paddingTop: '100px'
    }}>
        <Paper zDepth={2} style={{width: '500px', height: '500px', marginLeft: 'auto', marginRight: 'auto'}} onClick={props.onWidgetUnselect}>
            <SlideEditor onSelectWidget={widgetId => props.onSelectWidget(props.widgets.filter(widget => widget.id === widgetId)[0])}
                         slide={props.slide}
                         onMoveWidget={props.onMoveWidget}
                         onResizeWidget={props.onResizeWidget}
                         selectedWidgets={props.selectedWidgets}
                         onStartChangeText={props.onStartChangeText} />
        </Paper>
    </div>
));

export const ChangeTextDialog = connect((state: State) => ({
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
