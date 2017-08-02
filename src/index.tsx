import * as React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './App';
import { createStore, Reducer } from 'redux';
import { Provider } from 'react-redux';
import { State } from "./State";
import { AppAction } from "./AppAction";
import { set } from "./util";
import { widgetRepositoryReducer } from "./widget";
import './style.scss';
import { slideRepositoryReducer } from "./slide";
import * as injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import 'roboto-fontface/css/roboto/roboto-fontface.css';

injectTapEventPlugin();

const root = document.createElement('div');
document.body.appendChild(root);

const initialState: State = {
    data: {
        widgets: {
            id0: {
                kind: 'text',
                id: 'id0',
                x: 100,
                y: 50,
                width: 50,
                height: 50,
                text: 'Hello, world'
            },
            id1: {
                kind: 'rectangle',
                id: 'id1',
                x: 0,
                y: 0,
                color: 'green',
                width: 50,
                height: 50
            }
        },
        slides: {
            toto: {
                id: 'toto',
                widgetsIds: ['id0', 'id1']
            }
        }
    },
    editor: {
        currentSlide: 'toto'
    }
}

const appReducer: Reducer<State> = (state = initialState, action: AppAction) => (
    set(state, {
        data: set(state.data, {
            widgets: widgetRepositoryReducer(state.data.widgets, action),
            slides: slideRepositoryReducer(state.data.slides, action)
        })
    })
);

const store = createStore<State>(appReducer, (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__());

const doRender = (component?: JSX.Element) => render(
    <Provider store={store}>
        <MuiThemeProvider>
            <AppContainer>
                {component}
            </AppContainer>
        </MuiThemeProvider>
    </Provider>
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
