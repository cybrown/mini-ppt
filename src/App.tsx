import * as React from 'react';
import { connect } from 'react-redux';
import { State } from "./State";
import { widgetsSelector, currentSlide, Widget, selectedWidgets } from "./widget";
import { AppAction, create } from "./AppAction";
import { Dispatch } from "redux";
import { SlideEditor, Slide } from "./slide";
import { AppBar, Toolbar, ToolbarGroup, IconButton, Paper, Divider } from "material-ui";

const Editor: React.SFC<{
    slide: Slide;
    onMoveWidget: (id: string, x: number, y: number) => void;
    onResizeWidget: (id: string, width: number, height: number) => void;
    selectedWidgets: Widget[];
    onSelectWidget: (widgetId: string) => void;
    onWidgetUnselect: () => void;
}> = (props) => (
    <div style={{
        paddingTop: '100px'
    }}>
        <Paper zDepth={2} style={{width: '500px', height: '500px', marginLeft: 'auto', marginRight: 'auto'}} onClick={props.onWidgetUnselect}>
            <SlideEditor onSelectWidget={props.onSelectWidget} slide={props.slide} onMoveWidget={props.onMoveWidget} onResizeWidget={props.onResizeWidget} selectedWidgets={props.selectedWidgets} />
        </Paper>
    </div>
)

const RightPanel = () => (
    <Paper style={{position: 'absolute', right: 0, top: 0, width: '200px'}}>
        right panel
        <Divider />
        right panel
    </Paper>
);

const App = connect((state: State) => ({
    widgets: widgetsSelector(state),
    slide: currentSlide(state),
    selectedWidgets: selectedWidgets(state)
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
    onNewRectangle: (slideId: string) => dispatch(create('WidgetNewRectangle', {
        slideId,
        widgetId: Math.random().toString(),
        x: 250 - 40 / 2,
        y: 250 - 40 / 2,
        width: 40,
        height: 40
    })),
    onSelectWidget: (widgetId: string) => dispatch(create('WidgetSelect', {
        widgetId
    })),
    onWidgetUnselect: () => dispatch(create('WidgetUnselect', {}))
}))(props => (
    <div>
        <AppBar title="Mini PPT app" />
        <Toolbar>
            <ToolbarGroup firstChild={true}>
                <IconButton iconClassName="mppt-icon mppt-icon-text" onClick={() => props.onNewTextZoneClick(props.slide.id)} />
                <IconButton iconClassName="mppt-icon mppt-icon-rectangle" onClick={() => props.onNewRectangle(props.slide.id)} />
            </ToolbarGroup>
        </Toolbar>
        <div style={{position: 'relative'}}>
            <Editor slide={props.slide}
                    onMoveWidget={props.onMoveWidget}
                    onResizeWidget={props.onResizeWidget}
                    selectedWidgets={props.selectedWidgets}
                    onSelectWidget={props.onSelectWidget}
                    onWidgetUnselect={props.onWidgetUnselect} />
            <RightPanel />
        </div>
    </div>
));

export default App;
