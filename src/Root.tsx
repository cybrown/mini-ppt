import * as React from 'react';
import { Store } from "redux";
import { Provider } from "react-redux";
import { MuiThemeProvider } from "material-ui/styles";

import './style.scss';
import './fonts/mini-ppt-glyphs.css';

import { App } from './app/App';
import { AppState } from "./app/index";

export const Root = ({store}: {store: Store<AppState>}) => (
    <MuiThemeProvider>
        <Provider store={store}>
            <App />
        </Provider>
    </MuiThemeProvider>
);
