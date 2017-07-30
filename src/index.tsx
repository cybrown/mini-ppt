import * as React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './App';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { State } from "./State";
import { AppAction } from "./AppAction";

const root = document.createElement('div');
document.body.appendChild(root);

const initialState: State = {
    widgets: ['id0', 'id1'],
    data: {
        widgets: {
            id0: {
                kind: 'text',
                id: 'id0',
                x: 0,
                y: 0,
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
        }
    }
}

function set<T>(obj: T, data: Partial<T>): T {
    return {...obj as any, ...data as any};
}

const store = createStore<State>((state = initialState, action: AppAction) => {
    switch (action.type) {
        case 'widget.move':
            return set(state, {
                data: set(state.data, {
                    widgets: set(state.data.widgets, {
                        [action.id]: set(state.data.widgets[action.id], {
                            x: action.x,
                            y: action.y
                        })
                    })
                })
            })
    }
    return state;
}, (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__());

const doRender = (component?: JSX.Element) => render(<AppContainer>{component}</AppContainer>, root);

doRender(<Provider store={store}><App /></Provider>);

declare var require: any;
declare var module: any;

if (module.hot) {
    module.hot.accept("./App", () => {
        const NextApp = require("./App").default;
        doRender(<NextApp />);
    });
}
