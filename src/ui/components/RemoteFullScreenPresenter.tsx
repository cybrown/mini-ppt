import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from "redux";
import { AppState, AppAction, create } from "../../App";
import { set } from "../../util";

interface RemoteFullScreenPresenterProps {
    remotePresenter: boolean;
    state: AppState;
    slideToDisplay: number;
    closeRemoteWindow: () => any;
    dispatch: Dispatch<AppState>;
}

class RemoteFullScreenPresenterInner extends React.Component<RemoteFullScreenPresenterProps> {

    remoteWindow: Window | null = null;

    componentDidMount() {
        window.addEventListener('message', event => {
            if (typeof event.data === 'object') {
                if (event.data.isAppMessage) {
                    this.props.dispatch(event.data.action);
                    console.log(event);
                }
            }
        });
    }

    componentWillReceiveProps(nextProps: RemoteFullScreenPresenterProps) {
        if (nextProps.remotePresenter != this.props.remotePresenter) {
            if (nextProps.remotePresenter) {
                this.remoteWindow = window.open(location.origin);
                this.remoteWindow.addEventListener('beforeunload', () => {
                    this.props.closeRemoteWindow()
                });
                setTimeout(() => {
                    if (this.remoteWindow) {
                        this.remoteWindow.postMessage({
                            isAppMessage: true,
                            action: create('state.set', {
                                state: set(this.props.state, {
                                    ui: set(this.props.state.ui, {
                                        playRemote: null,
                                        playmode: 0
                                    })
                                })
                            })
                        }, location.origin);
                    }
                }, 100);
            } else if (this.remoteWindow) {
                this.remoteWindow.close();
                this.remoteWindow = null;
            }
        }
        if (nextProps.slideToDisplay != this.props.slideToDisplay) {
            if (this.remoteWindow) {
                this.remoteWindow.postMessage({
                    isAppMessage: true,
                    action: create('ui.presentation.play', {
                        startingSlide: nextProps.slideToDisplay
                    })
                }, location.origin);
            }
        }
    }

    render() {
        return null;
    }
}

const RemoteFullScreenPresenter = connect((state: AppState) => ({
    remotePresenter: state.ui.playRemote != null,
    state: state,
    slideToDisplay: state.ui.playRemote
}), (dispatch: Dispatch<AppAction>) => ({
    closeRemoteWindow: () => dispatch(create('ui.presentation.play.remote.off', {})),
    dispatch
}))(RemoteFullScreenPresenterInner)

export default RemoteFullScreenPresenter;
