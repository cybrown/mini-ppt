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
    playRemote: state.ui.playRemote,
    numberOfSlides: state.presentation.slideList.length - 1
}), (dispatch: Dispatch<AppAction>) => ({
    onNewTextZoneClick: (slideId: string, backgroundColor: string) => dispatch(create('widget.new', {
        slideId,
        widget: createTextZoneWidget(backgroundColor)
    })),
    onNewRectangle: (slideId: string, backgroundColor: string) => dispatch(create('widget.new', {
        slideId,
        widget: createRectangleWidget(backgroundColor),
    })),
    onChangeColorWidget: (widgetIds: string[], backgroundColor: string, final: boolean) => {
        dispatch(create('widget.set.bulk.backgroundColor', { widgetIds, backgroundColor, history: final }));
        dispatch(create('ui.current.backgroundColor.set', {backgroundColor}));
    },
    onSetColorPickerisibility: (visible: boolean) => dispatch(create('ui.backgroundColorPicker.set.visiblity', {visible})),
    onCreateNewSlide: () => dispatch(create('slide.new', {
        slide: {
            id: Math.random().toString(),
            widgetsIds: []
        }
    })),
    onUndo: () => dispatch(create('ui.history.undo', {})),
    onPlay: () => dispatch(create('ui.presentation.play', {
        startingSlide: 0
    })),
    onPlayRemote: (slideToDisplay: number) => dispatch(create('ui.presentation.play.remote.on', {
        slideToDisplay
    })),
    onStopRemote: () => dispatch(create('ui.presentation.play.remote.off', {}))
}))(props => (
    <Toolbar>
        <ToolbarGroup firstChild={true}>
            <IconButton
                iconClassName="mppt-icon mppt-icon-plus"
                onClick={props.onCreateNewSlide}
            />
        </ToolbarGroup>
        <ToolbarGroup>
            <IconButton
                iconClassName="mppt-icon mppt-icon-undo"
                onClick={() => props.onUndo()}
            />
            <IconButton
                iconClassName="mppt-icon mppt-icon-text"
                onClick={() => props.slide && props.onNewTextZoneClick(props.slide.id, props.currentBackgroundColor)}
            />
            <IconButton
                iconClassName="mppt-icon mppt-icon-rectangle"
                onClick={() => props.slide && props.onNewRectangle(props.slide.id, props.currentBackgroundColor)}
            />
            <IconButton
                ref={el => el && (anchorForBackgroundColorPicker = ReactDOM.findDOMNode(el))}
                onClick={() => props.onSetColorPickerisibility(!props.showBackgroundColorPicker)}
            >
                <FontIcon
                    color={props.currentBackgroundColor}
                    className="mppt-icon mppt-icon-bucket"
                />
            </IconButton>
            <Popover
                open={props.showBackgroundColorPicker}
                anchorEl={anchorForBackgroundColorPicker}
                anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                targetOrigin={{horizontal: 'left', vertical: 'top'}}
                useLayerForClickAway={false}
            >
                <SketchPicker
                    color={props.currentBackgroundColor}
                    onChangeComplete={color => props.onChangeColorWidget(props.selectedWidgets.map(w => w.id), rgbaToString(color.rgb), true)}
                    onChange={color => props.onChangeColorWidget(props.selectedWidgets.map(w => w.id), rgbaToString(color.rgb), false)}
                />
            </Popover>
            <IconButton
                iconClassName="mppt-icon mppt-icon-play3"
                onClick={props.onPlay}
            />
            <IconButton
                iconClassName="mppt-icon mppt-icon-play3"
                onClick={() => props.onPlayRemote(0)}
            />
        </ToolbarGroup>
        { props.playRemote != null ? (
            <ToolbarGroup>
                    <IconButton
                        iconClassName="mppt-icon mppt-icon-stop2"
                        onClick={props.onStopRemote}
                    />
                    <IconButton
                        iconClassName="mppt-icon mppt-icon-previous2"
                        onClick={() => props.onPlayRemote(Math.max(props.playRemote! - 1, 0))}
                    />
                    <IconButton
                        iconClassName="mppt-icon mppt-icon-next2"
                        onClick={() => props.onPlayRemote(Math.min(props.playRemote! + 1, props.numberOfSlides))}
                    />
            </ToolbarGroup>
        ) : (
            <ToolbarGroup />
        )}
    </Toolbar>
));
