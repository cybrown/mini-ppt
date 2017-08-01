import * as React from "react";

export function set<T>(obj: T, data: Partial<T>): T {
    return {...obj as any, ...data as any};
}

export const HasPosition: React.SFC<{x: number, y: number}> = ({x, y, children}) => (
    <div style={{position: 'absolute', left: x + 'px', top: y + 'px'}}>
        {children}
    </div>
);

export class Movable extends React.Component<{onMove: (x: number, y: number) => void}, {deltaX: number, deltaY: number}> {

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
        this.props.onMove(this.state.deltaX, this.state.deltaY);
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
        return (
            <div style={{position: 'absolute', left: this.state.deltaX + 'px', top: this.state.deltaY + 'px'}}
                 onMouseDown={this.onmousedown}>
                {this.props.children}
            </div>
        )
    }
}
