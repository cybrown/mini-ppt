import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { Paper } from "material-ui";
import { SlideRenderer } from "../../slide/components/SlideRenderer";
import { AppState, AppAction, create } from "../../app";

export const SlideList = connect((state: AppState) => ({
    slides: Object.keys(state.data.slides).map(id => state.data.slides[id]).map(slideRecord => ({
        id: slideRecord.id,
        widgets: slideRecord.widgetsIds.map(widgetId => state.data.widgets[widgetId])
    })),
    currentSlide: state.ui.currentSlide
}), (dispatch: Dispatch<AppAction>) => ({
    onSetCurrentSlide: (slideId: string) => dispatch(create('UISetCurrentSlide', { slideId }))
}))(props => (
    <Paper style={{backgroundColor: 'lightgrey', position: 'absolute', top: 0, bottom: 0, width: '200px', overflow: 'auto'}} zDepth={2}>
        {props.slides.map(slide => (
            <div key={slide.id} style={{width: '200px', height: '200px', padding: '35.25px'}} >
                <Paper zDepth={slide.id === props.currentSlide ? 3 : 1} style={{width: '125px', height: '125px'}} onClick={() => props.onSetCurrentSlide(slide.id)}>
                    <div style={{transform: 'scale(0.25, 0.25)', transformOrigin: 'top left', pointerEvents: 'none'}}>
                        <SlideRenderer slide={slide} />
                    </div>
                </Paper>
            </div>
        ))}
    </Paper>
));
