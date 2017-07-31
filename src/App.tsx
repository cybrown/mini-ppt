import * as React from 'react';
import { connect } from 'react-redux';
import { State } from "./State";
import { Widget, widgetsSelector, HasPosition, RenderWidget } from "./widget";
import { AppAction, create } from "./AppAction";
import { Dispatch } from "redux";
import { createSelector } from 'reselect';

const DrawingZone: React.SFC = ({children}) => (
    <div style={{backgroundColor: 'white', position: 'relative', width: 500 + 'px', height: 500 + 'px'}}>
        {children}
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
    widgets: widgetsSelector(state)
}), (dispatch: Dispatch<AppAction>) => ({
    onMoveWidget: (id: string, x: number, y: number) => dispatch(create('WidgetMoveAction', {id, x, y})),
    onNewTextZoneClick: () => dispatch(create('WidgetNewTextZone', {
        widgetId: Math.random().toString()
    })),
    onNewRectangle: () => dispatch(create('WidgetNewRectangle', {
        widgetId: Math.random().toString()
    }))
}))(props => (
    <div>
        <h1>Mini ppt app</h1>
        <Toolbar onCreateTextZone={() => props.onNewTextZoneClick()} onCreateRectangle={() => props.onNewRectangle()} />
        <DrawingZone>
            {props.widgets.map(widget => (
                <HasPosition key={widget.id} x={widget.x} y={widget.y} onMove={(x, y) => props.onMoveWidget(widget.id, x, y)}>
                    <RenderWidget widget={widget} />
                </HasPosition>
            ))}
        </DrawingZone>
    </div>
));

export default App;
