import * as React from 'react';
import { connect } from 'react-redux';
import { State } from "./State";
import { Widget } from "./widget";
import { AppAction } from "./AppAction";
import { Dispatch } from "redux";

const TextZone: React.SFC<{text: string}> = ({text}) => (
    <div>{text}</div>
);

const Rectangle: React.SFC<{color: string, width: number, height: number}> = ({color, width, height}) => (
    <div style={{width: width + 'px', height: height + 'px', backgroundColor: color}}></div>
)

const DrawingZone: React.SFC = ({children}) => (
    <div style={{position: 'relative'}}>
        {children}
    </div>
)

class HasPosition extends React.Component<{x: number, y: number, onMove: (x: number, y: number) => void}, {deltaX: number, deltaY: number}> {

    isMoving = false;
    originalX = 0;
    originalY = 0;

    state = {
        deltaX: 0,
        deltaY: 0
    }

    onmousedown: React.EventHandler<React.MouseEvent<HTMLDivElement>> = event => {
        this.isMoving = true;
        this.originalX = event.clientX;
        this.originalY = event.clientY;
        this.setupDocumentEvents();
    }

    onmousemove: EventListener = (event: MouseEvent) => {
        const deltaX = event.clientX - this.originalX;
        const deltaY = event.clientY - this.originalY;
        this.setState({
            deltaX, deltaY
        })
    }

    onmouseup = () => {
        this.removeDocumentEvents();
        this.props.onMove(this.props.x + this.state.deltaX, this.props.y + this.state.deltaY);
        this.setState({deltaX: 0, deltaY: 0})
    }

    private setupDocumentEvents() {
        document.addEventListener('mousemove', this.onmousemove);
        document.addEventListener('mouseup', this.onmouseup);
    }

    private removeDocumentEvents() {
        document.removeEventListener('mousemove', this.onmousemove);
        document.removeEventListener('mouseup', this.onmouseup);
    }

    componentWillUnmount() {
        this.removeDocumentEvents();
    }

    render() {
        const {x, y, children} = this.props;
        return (
            <div style={{position: 'absolute', left: x + this.state.deltaX + 'px', top: y + this.state.deltaY + 'px'}}
                 onMouseDown={this.onmousedown}>
                {children}
            </div>
        )
    }
}

const RenderWidget: React.SFC<{widget: Widget}> = ({widget}) => {
    switch (widget.kind) {
        case 'text':
            return <TextZone text={widget.text} />;
        case 'rectangle':
            return <Rectangle color={widget.color} width={widget.width} height={widget.height} />;
    }
}

const App = connect((state: State) => ({
    widgets: state.widgets.map(widgetId => state.data.widgets[widgetId])
}), (dispatch: Dispatch<AppAction>) => ({
    onMoveWidget: (id: string, x: number, y: number) => dispatch({
        type: 'widget.move', id, x, y
    })
}))(class App extends React.Component<{widgets: Widget[], onMoveWidget: (id: string, x: number, y: number) => any}> {

    render() {
        return (
            <div>
                <h1>Mini ppt app</h1>
                <DrawingZone>
                    {this.props.widgets.map(widget => (
                        <HasPosition key={widget.id} x={widget.x} y={widget.y} onMove={(x, y) => this.props.onMoveWidget(widget.id, x, y)}>
                            <RenderWidget widget={widget} />
                        </HasPosition>
                    ))}
                </DrawingZone>
            </div>
        );
    }
});

export default App;
