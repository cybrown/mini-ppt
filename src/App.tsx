import * as React from 'react';
import { connect } from 'react-redux';
import { State } from "./State";
import { widgetsSelector, currentSlide } from "./widget";
import { AppAction, create } from "./AppAction";
import { Dispatch } from "redux";
import { SlideEditor } from "./slide";
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import { AppBar, Toolbar, ToolbarGroup, DropDownMenu, MenuItem, ToolbarTitle, FontIcon, ToolbarSeparator, RaisedButton, IconMenu, IconButton } from "material-ui";

const App = connect((state: State) => ({
    widgets: widgetsSelector(state),
    slide: currentSlide(state)
}), (dispatch: Dispatch<AppAction>) => ({
    onMoveWidget: (id: string, x: number, y: number) => dispatch(create('WidgetMoveAction', {id, x, y})),
    onResizeWidget: (id: string, width: number, height: number) => dispatch(create('WidgetResizeAction', {id, width, height})),
    onNewTextZoneClick: (slideId: string) => dispatch(create('WidgetNewTextZone', {
        slideId,
        widgetId: Math.random().toString()
    })),
    onNewRectangle: (slideId: string) => dispatch(create('WidgetNewRectangle', {
        slideId,
        widgetId: Math.random().toString()
    }))
}))(props => (
    <div>
        <AppBar title="Mini PPT app" />
        <Toolbar>
            <ToolbarGroup firstChild={true}>
            <DropDownMenu value={3} onChange={() => null}>
                <MenuItem value={1} primaryText="All Broadcasts" />
                <MenuItem value={2} primaryText="All Voice" />
                <MenuItem value={3} primaryText="All Text" />
                <MenuItem value={4} primaryText="Complete Voice" />
                <MenuItem value={5} primaryText="Complete Text" />
                <MenuItem value={6} primaryText="Active Voice" />
                <MenuItem value={7} primaryText="Active Text" />
            </DropDownMenu>
            </ToolbarGroup>
            <ToolbarGroup>
            <ToolbarTitle text="Options" />
            <FontIcon className="muidocs-icon-custom-sort" />
            <ToolbarSeparator />
            <RaisedButton label="Rectangle" primary={true} onClick={() => props.onNewRectangle(props.slide.id)} />
            <RaisedButton label="Text" primary={true} onClick={() => props.onNewTextZoneClick(props.slide.id)} />
            <IconMenu
                iconButtonElement={
                <IconButton touch={true}>
                    <NavigationExpandMoreIcon />
                </IconButton>
                }
            >
                <MenuItem primaryText="Download" />
                <MenuItem primaryText="More Info" />
            </IconMenu>
            </ToolbarGroup>
        </Toolbar>
        <SlideEditor slide={props.slide} onMoveWidget={props.onMoveWidget} onResizeWidget={props.onResizeWidget} />
    </div>
));

export default App;
