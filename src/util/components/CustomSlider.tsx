import * as React from "react";
import { Slider } from "material-ui";

interface CustomSliderProps {
    value: number;
    onChange: (event: React.MouseEvent<{}>, value: number) => void;
    onDragStop: (event: React.MouseEvent<{}>, value: number) => void;
}

export class CustomSlider extends React.Component<CustomSliderProps, {
    value: number;
}> {

    state = {
        value: this.props.value
    };

    componentDidMount() {
        this.setState({
            value: this.props.value
        });
    }

    componentWillReceiveProps(props: CustomSliderProps) {
        this.setState({
            value: props.value
        });
    }

    render() {
        return <Slider value={this.state.value}
                       onChange={(event, value) => {
                           this.setState({ value });
                           this.props.onChange(event, value);
                       }}
                       onDragStop={event => this.props.onDragStop(event, this.state.value)} />;
    }
}
