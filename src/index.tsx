import * as React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './App';
import { createStore, Reducer } from 'redux';
import { Provider } from 'react-redux';
import * as injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import 'roboto-fontface/css/roboto/roboto-fontface.css';

import { AppState } from "./AppState";
import { AppAction, create } from "./AppAction";
import { set } from "./util";
import { widgetRepositoryReducer } from "./widget";
import './style.scss';
import { slideRepositoryReducer } from "./slide";
import './fonts/mini-ppt-glyphs.css';
import { uiInitialState, uiReducer } from "./ui";

injectTapEventPlugin();

const root = document.createElement('div');
document.body.appendChild(root);

const initialState: AppState = {
    data: {
        widgets: {},
        slides: {}
    },
    ui: uiInitialState
};

const appReducer: Reducer<AppState> = (state = initialState, action: AppAction) => (
    set(state, {
        data: set(state.data, {
            widgets: widgetRepositoryReducer(state.data.widgets, action),
            slides: slideRepositoryReducer(state.data.slides, action)
        }),
        ui: uiReducer(state.ui, action)
    })
);

const store = createStore<AppState>(appReducer, (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__());

const slideId = Math.random().toString();

store.dispatch(create('SlideNew', {
    slide: {
        id: slideId,
        widgetsIds: []
    }
}));

store.dispatch(create('UISetCurrentSlide', { slideId }));

const doRender = (component?: JSX.Element) => render(
    <AppContainer>
        <Provider store={store}>
            <MuiThemeProvider>
                    {component}
            </MuiThemeProvider>
        </Provider>
    </AppContainer>
, root);

doRender(<App />);

declare var require: any;
declare var module: any;

if (module.hot) {
    module.hot.accept("./App", () => {
        const NextApp = require("./App").default;
        doRender(<NextApp />);
    });
}
