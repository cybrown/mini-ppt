import * as React from 'react';
import { connect } from 'react-redux';
import { State } from "./State";
import { Widget, widgetsSelector, HasPosition, RenderWidget } from "./widget";
import { AppAction, create } from "./AppAction";
import { Dispatch } from "redux";
import { createSelector } from 'reselect';
import { Slide } from "./slide";

const SlideEditor: React.SFC<{
    widgets: Widget[],
    slide: Slide,
    onMoveWidget: (id: string, x: number, y: number) => void
}> = ({children, widgets, slide, onMoveWidget}) => (
    <div style={{backgroundColor: 'white', position: 'relative', width: 500 + 'px', height: 500 + 'px'}}>
        {widgets.map(widget => (
            <HasPosition key={widget.id} x={widget.x} y={widget.y} onMove={(x, y) => onMoveWidget(widget.id, x, y)}>
                <RenderWidget widget={widget} />
            </HasPosition>
        ))}
    </div>
)

const Toolbar: React.SFC<{
    onCreateTextZone: () => void;
    onCreateRectangle: () => void;
}> = ({onCreateTextZone, onCreateRectangle}) => (
    <div>
        <button onClick={onCreateTextZone}>Text zone</button>
        <button onClick={onCreateRectangle}>Rectangle</button>
    </div>
);

const App = connect((state: State) => ({
    widgets: widgetsSelector(state),
    slide: state.data.slides[state.editor.currentSlide]
}), (dispatch: Dispatch<AppAction>) => ({
    onMoveWidget: (id: string, x: number, y: number) => dispatch(create('WidgetMoveAction', {id, x, y})),
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
        <h1>Mini ppt app</h1>
        <Toolbar onCreateTextZone={() => props.onNewTextZoneClick(props.slide.id)} onCreateRectangle={() => props.onNewRectangle(props.slide.id)} />
        <SlideEditor slide={props.slide} widgets={props.widgets} onMoveWidget={props.onMoveWidget} />
    </div>
));

export default App;
