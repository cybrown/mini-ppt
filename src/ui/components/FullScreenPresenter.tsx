import * as React from "react";
import { Slide } from "../../slide";
import { SlideRenderer } from "../../slide/components/SlideRenderer";
import { SpeedDial, SpeedDialItem } from 'react-mui-speeddial';
import { ContentAdd, NavigationClose } from "material-ui/svg-icons";
import { FontIcon } from "material-ui";
import { requestFullscreen, getFullscreenElement } from "../../util";

export class FullScreenPresenter extends React.Component<{
    slideToDisplay: Slide;
    slideIndex: number;
    numberSlides: number;
    onExitPresenterMode: () => void;
    onChangeSlide: (slideIndex: number) => void;
}> {

    presenterDiv: HTMLDivElement;

    escKeyHandler: EventListener = (e: KeyboardEvent) => {
        if (e.keyCode === 27 || e.code === 'Escape') {
            this.props.onExitPresenterMode();
        }
    };

    fullScreenChangeHandler = () => {
        if (!getFullscreenElement()) {
            this.props.onExitPresenterMode();
        }
    };

    setFullScreenChangeEvent() {
        document.addEventListener('webkitfullscreenchange', this.fullScreenChangeHandler);
    }

    unsetFullScreenChangeEvent() {
        document.removeEventListener('webkitfullscreenchange', this.fullScreenChangeHandler);
    }

    componentDidMount() {
        document.addEventListener('keyup', this.escKeyHandler);
        if (this.presenterDiv) {
            requestFullscreen(this.presenterDiv);
            this.setFullScreenChangeEvent();
        }
    }

    componentWillUnmount() {
        document.removeEventListener('keyup', this.escKeyHandler);
        this.unsetFullScreenChangeEvent();
    }

    requestFullscreen = (e: HTMLDivElement) => {
        this.presenterDiv = e;
    };

    render() {
        const props = this.props;
        return (
            <div
                ref={this.requestFullscreen}
                style={{position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
            >
                { props.slideToDisplay ? <SlideRenderer slide={props.slideToDisplay} /> : null }
                <SpeedDial
                    style={{position: 'absolute', bottom: '32px', right: '32px'}}
                    fabContentOpen={ <ContentAdd /> }
                    fabContentClose={ <NavigationClose /> }
                >
                    <SpeedDialItem
                        label={<span style={{color: 'white'}}>Previous slide</span>}
                        fabContent={<FontIcon className="mppt-icon mppt-icon-previous2" />}
                        onTouchTap={() => props.slideIndex > 0 && props.onChangeSlide(props.slideIndex - 1)}
                    />
                    <SpeedDialItem
                        label={<span style={{color: 'white'}}>Next slide</span>}
                        fabContent={<FontIcon className="mppt-icon mppt-icon-next2" />}
                        onTouchTap={() => props.slideIndex < (props.numberSlides - 1) && props.onChangeSlide(props.slideIndex + 1)}
                    />
                    <SpeedDialItem
                        label={<span style={{color: 'white'}}>Exit presentation</span>}
                        fabContent={<FontIcon className="mppt-icon mppt-icon-exit" />}
                        onTouchTap={props.onExitPresenterMode}
                    />
                </SpeedDial>
            </div>
        )
    }
}
