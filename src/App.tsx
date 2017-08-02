import * as React from 'react';
import { connect } from 'react-redux';
import { State } from "./State";
import { widgetsSelector, currentSlide } from "./widget";
import { AppAction, create } from "./AppAction";
import { Dispatch } from "redux";
import { SlideEditor } from "./slide";
import { AppBar, Toolbar, ToolbarGroup, IconButton } from "material-ui";

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
                <IconButton iconClassName="mppt-icon mppt-icon-text" onClick={() => props.onNewTextZoneClick(props.slide.id)} />
                <IconButton iconClassName="mppt-icon mppt-icon-rectangle" onClick={() => props.onNewRectangle(props.slide.id)} />
            </ToolbarGroup>
        </Toolbar>
        <SlideEditor slide={props.slide} onMoveWidget={props.onMoveWidget} onResizeWidget={props.onResizeWidget} />
    </div>
));

export default App;
