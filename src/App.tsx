import * as React from 'react';
import { connect } from 'react-redux';
import { State } from "./State";
import { Widget, widgetsSelector, HasPosition, WidgetRenderer, currentSlide } from "./widget";
import { AppAction, create } from "./AppAction";
import { Dispatch } from "redux";
import { Slide, SlideEditor } from "./slide";

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
    slide: currentSlide(state)
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
