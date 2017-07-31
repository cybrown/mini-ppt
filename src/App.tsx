import * as React from 'react';
import { connect } from 'react-redux';
import { State } from "./State";
import { Widget, widgetsSelector, HasPosition, RenderWidget } from "./widget";
import { AppAction, create } from "./AppAction";
import { Dispatch } from "redux";
import { createSelector } from 'reselect';

const DrawingZone: React.SFC = ({children}) => (
    <div style={{position: 'relative'}}>
        {children}
    </div>
)

const App = connect((state: State) => ({
    widgets: widgetsSelector(state),
    value: state.value
}), (dispatch: Dispatch<AppAction>) => ({
    onMoveWidget: (id: string, x: number, y: number) => dispatch(create('WidgetMoveAction', {id, x, y})),
    onInputChange: (value: string) => dispatch(create('InputChangeAction', {value})),
}))(props => (
    <div>
        <h1>Mini ppt app</h1>
        <input value={props.value} onChange={(e) => props.onInputChange(e.target.value)} />
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
