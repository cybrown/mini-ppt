import * as React from "react";

export class Movable extends React.Component<{
    onMove: (x: number, y: number) => void;
    onMoveStart?: () => void;
    onMoveEnd?: () => void;
    immediate?: boolean;
}, {
    deltaX: number;
    deltaY: number;
}> {

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
        event.preventDefault();
        event.stopPropagation();
    }

    onmousemove: EventListener = (event: MouseEvent) => {
        const deltaX = event.clientX - this.originalX;
        const deltaY = event.clientY - this.originalY;
        if (this.props.immediate) {
            this.originalX += deltaX;
            this.originalY += deltaY;
            this.props.onMove(deltaX, deltaY);
        } else {
            this.setState({
                deltaX, deltaY
            });
        }
        this.props.onMoveStart && this.props.onMoveStart();
    }

    onmouseup = () => {
        this.removeDocumentEvents();
        this.props.onMove(this.state.deltaX, this.state.deltaY);
        this.setState({deltaX: 0, deltaY: 0});
        this.props.onMoveEnd && this.props.onMoveEnd();
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
