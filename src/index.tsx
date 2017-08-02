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
import './fonts/mini-ppt-glyphs.css';

injectTapEventPlugin();

const root = document.createElement('div');
document.body.appendChild(root);

const initialState: State = {
    data: {
        widgets: {},
        slides: {
            toto: {
                id: 'toto',
                widgetsIds: []
            }
        }
    },
    editor: {
        currentSlide: 'toto',
        selectedWidgets: []
    }
};

const editorReducer: Reducer<State['editor']> = (state: State['editor'], action: AppAction): State['editor'] => {
    switch (action.type) {
        case 'WidgetSelect':
            return set(state, {
                selectedWidgets: [action.widgetId]
            });
        case 'WidgetUnselect':
            return set(state, {selectedWidgets: []});
    }
    return state;
}

const appReducer: Reducer<State> = (state = initialState, action: AppAction) => (
    set(state, {
        data: set(state.data, {
            widgets: widgetRepositoryReducer(state.data.widgets, action),
            slides: slideRepositoryReducer(state.data.slides, action)
        }),
        editor: editorReducer(state.editor, action)
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
