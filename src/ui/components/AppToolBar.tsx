import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { currentSlide, selectedWidgets, createTextZoneWidget, createRectangleWidget } from "../../widget";
import { Toolbar, ToolbarGroup, IconButton, FontIcon, Popover } from "material-ui";
import * as ReactDOM from "react-dom";
import { SketchPicker } from "react-color";
import { rgbaToString } from "../../util";
import { AppState, AppAction, create } from "../../app";

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
            dispatch(create('WidgetSetBackgroundColor', { widgetId, backgroundColor }));
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
